"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { TerminalSquare, Zap, ZapOff } from "lucide-react";
import { useCommandCenter, type LogTone } from "@/components/CommandCenterProvider";
import { routeIntent, BOOT_SEQUENCE } from "@/lib/intentRouter";
import { cn } from "@/lib/utils";

interface Entry {
  id: number;
  kind: "input" | "output";
  lines: string[];
  tone: LogTone;
  /** number of lines currently revealed (streaming effect) */
  shown: number;
}

const PROMPT = "aditya@command-center:~$";

function lineClass(line: string, tone: LogTone): string {
  if (line.startsWith("[err]")) return "text-blood";
  if (line.startsWith("[boot]") || line.startsWith("[sys]")) return "text-dim";
  if (line.startsWith("▸")) return "text-neon glow-green";
  if (line.startsWith("  ✓")) return "text-electric";
  switch (tone) {
    case "success":
      return "text-neon";
    case "warn":
      return "text-amber-soft";
    case "error":
      return "text-blood";
    case "info":
      return "text-sky-200";
    case "agent":
      return "text-slate-200";
    default:
      return "text-slate-400";
  }
}

export default function Terminal({ onClose }: { onClose?: () => void }) {
  const { subscribeLogs, focusNode, celebrate, llmMode, setLlmMode } =
    useCommandCenter();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted = useRef(false);

  const pushEntry = useCallback(
    (kind: Entry["kind"], lines: string[], tone: LogTone, stream = true) => {
      const id = nextId.current++;
      setEntries((prev) => [
        ...prev,
        { id, kind, lines, tone, shown: stream ? 0 : lines.length },
      ]);
    },
    [],
  );

  // ---- streaming reveal: tick every 55ms, reveal one pending line per entry
  useEffect(() => {
    const t = setInterval(() => {
      setEntries((prev) => {
        if (!prev.some((e) => e.shown < e.lines.length)) return prev;
        return prev.map((e) =>
          e.shown < e.lines.length ? { ...e, shown: e.shown + 1 } : e,
        );
      });
    }, 55);
    return () => clearInterval(t);
  }, []);

  // ---- boot sequence (once) ----
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    pushEntry("output", BOOT_SEQUENCE, "system");
  }, [pushEntry]);

  // ---- receive logs from graph / timeline ----
  useEffect(
    () =>
      subscribeLogs(({ lines, tone }) => {
        pushEntry("output", lines, tone);
      }),
    [subscribeLogs, pushEntry],
  );

  // ---- autoscroll ----
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const askLlm = useCallback(
    async (prompt: string) => {
      setBusy(true);
      pushEntry("output", ["[sys] uplink → groq · llama-3.3-70b …"], "system");
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!res.ok) {
          pushEntry(
            "output",
            [
              `[err] uplink unavailable (${data.error ?? res.status})`,
              "[sys] falling back to local intent router — try /help",
            ],
            "error",
          );
        } else {
          pushEntry("output", String(data.text).split("\n"), "agent");
        }
      } catch {
        pushEntry("output", ["[err] uplink failed — network error"], "error");
      } finally {
        setBusy(false);
      }
    },
    [pushEntry],
  );

  const execute = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      pushEntry("input", [cmd], "system", false);

      const routed = routeIntent(cmd);
      const a = routed.actions;

      if (a?.clear) {
        setEntries([]);
        return;
      }
      if (a?.llm) setLlmMode(a.llm === "on");

      if (a?.escalate && llmMode) {
        void askLlm(cmd);
        return;
      }

      if (routed.lines.length) {
        pushEntry("output", routed.lines, routed.tone ?? "agent");
      }
      if (a?.focusNode) focusNode(a.focusNode, "terminal");
      if (a?.confetti) celebrate();
    },
    [pushEntry, llmMode, setLlmMode, askLlm, focusNode, celebrate],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      if (history[idx] !== undefined) {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIdx - 1;
      setHistIdx(Math.max(idx, -1));
      setInput(idx >= 0 ? history[idx] : "");
    }
  };

  return (
    <div
      className="glass flex h-full flex-col overflow-hidden rounded-lg"
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar — the red traffic light actually minimizes the window */}
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        {onClose ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="minimize terminal (ctrl+`)"
            aria-label="minimize terminal"
            className="group flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blood/80 transition-shadow hover:bg-blood hover:shadow-[0_0_9px_rgba(248,113,113,0.9)]"
          >
            <span className="text-[7px] leading-none font-bold text-void opacity-0 transition-opacity group-hover:opacity-100">
              ×
            </span>
          </button>
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-blood/80" />
        )}
        <span className="h-2.5 w-2.5 rounded-full bg-amber-soft/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon/80" />
        <TerminalSquare size={13} className="ml-2 text-electric" />
        <span className="panel-title">agentic os terminal — agent-aditya v1.0</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLlmMode(!llmMode);
            pushEntry(
              "output",
              [
                llmMode
                  ? "[agent] LLM uplink → DISABLED. Local intent router active."
                  : "[agent] LLM uplink → ENABLED. Free-text routes to Groq.",
              ],
              llmMode ? "warn" : "success",
            );
          }}
          className={cn(
            "ml-auto flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] tracking-widest uppercase transition-colors",
            llmMode
              ? "border-neon/50 text-neon"
              : "border-line-bright text-dim hover:text-ghost",
          )}
          title="Toggle live LLM uplink"
        >
          {llmMode ? <Zap size={10} /> : <ZapOff size={10} />}
          {llmMode ? "llm:on" : "llm:off"}
        </button>
      </div>

      {/* scrollback */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-2 text-[11.5px] leading-relaxed"
      >
        {entries.map((e) =>
          e.kind === "input" ? (
            <div key={e.id} className="flex gap-2">
              <span className="shrink-0 text-neon">{PROMPT}</span>
              <span className="text-slate-100">{e.lines[0]}</span>
            </div>
          ) : (
            <div key={e.id}>
              {e.lines.slice(0, e.shown).map((line, i) => (
                <div
                  key={i}
                  className={cn("whitespace-pre-wrap", lineClass(line, e.tone))}
                >
                  {line || " "}
                </div>
              ))}
            </div>
          ),
        )}
      </div>

      {/* input line */}
      <div className="flex items-center gap-2 border-t border-line px-3 py-2">
        <span className="shrink-0 text-[11.5px] text-neon glow-green">
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          placeholder={busy ? "agent thinking…" : 'try /help or "show hackathon wins"'}
          className="w-full bg-transparent text-[11.5px] text-slate-100 caret-neon outline-none placeholder:text-dim/60"
        />
        <span className="cursor-blink h-3.5 w-[7px] shrink-0 bg-neon/90" />
      </div>
    </div>
  );
}
