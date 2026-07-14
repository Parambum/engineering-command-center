"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { NODE_MAP, NODE_TYPE_LABEL, neighborsOf } from "@/lib/data";

// ---------------------------------------------------------------------------
// Global state + event bus wiring the Terminal, Knowledge Graph and Git
// Timeline together. Panels dispatch high-level intents; the provider
// orchestrates cross-panel side effects (logs, traces, focus, confetti).
// ---------------------------------------------------------------------------

export type LogTone = "system" | "info" | "success" | "warn" | "error" | "agent";

export interface LogEvent {
  lines: string[];
  tone: LogTone;
}

export type EventSource = "terminal" | "graph" | "timeline" | "inspector";

export type PanelId = "timeline" | "terminal";

interface TraceSignal {
  nodeId: string;
  ts: number;
}

interface CommandCenterState {
  focusedNodeId: string | null;
  highlightedIds: Set<string>;
  trace: TraceSignal | null;
  expandedCommit: string | null;
  llmMode: boolean;
  panelOpen: Record<PanelId, boolean>;
  /** logs that arrived while the terminal panel was minimized */
  unseenLogs: number;
}

interface CommandCenterApi extends CommandCenterState {
  focusNode: (nodeId: string, source: EventSource) => void;
  clearFocus: () => void;
  runTrace: (nodeId: string) => void;
  expandCommit: (hash: string | null, source: EventSource) => void;
  setLlmMode: (on: boolean) => void;
  log: (lines: string[], tone?: LogTone) => void;
  celebrate: () => void;
  togglePanel: (id: PanelId, open?: boolean) => void;
  /** terminal registers here to receive logs pushed by other panels */
  subscribeLogs: (fn: (e: LogEvent) => void) => () => void;
}

const Ctx = createContext<CommandCenterApi | null>(null);

export function useCommandCenter(): CommandCenterApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCommandCenter must be used inside provider");
  return ctx;
}

export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [trace, setTrace] = useState<TraceSignal | null>(null);
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);
  const [llmMode, setLlmMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState<Record<PanelId, boolean>>({
    timeline: true,
    terminal: true,
  });
  const [unseenLogs, setUnseenLogs] = useState(0);

  // ref mirror so log() sees the live panel state without re-subscribing
  const panelOpenRef = useRef(panelOpen);
  panelOpenRef.current = panelOpen;

  const logListeners = useRef<Set<(e: LogEvent) => void>>(new Set());

  const log = useCallback((lines: string[], tone: LogTone = "system") => {
    logListeners.current.forEach((fn) => fn({ lines, tone }));
    if (!panelOpenRef.current.terminal) setUnseenLogs((n) => n + 1);
  }, []);

  const togglePanel = useCallback((id: PanelId, open?: boolean) => {
    setPanelOpen((prev) => {
      const next = open ?? !prev[id];
      if (id === "terminal" && next) setUnseenLogs(0);
      return { ...prev, [id]: next };
    });
  }, []);

  const subscribeLogs = useCallback((fn: (e: LogEvent) => void) => {
    logListeners.current.add(fn);
    return () => {
      logListeners.current.delete(fn);
    };
  }, []);

  const runTrace = useCallback((nodeId: string) => {
    setTrace({ nodeId, ts: Date.now() });
  }, []);

  const celebrate = useCallback(() => {
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#34f5a4", "#38bdf8", "#fbbf24"],
      });
    });
  }, []);

  const focusNode = useCallback(
    (nodeId: string, source: EventSource) => {
      const node = NODE_MAP.get(nodeId);
      if (!node) return;

      const neighbors = neighborsOf(nodeId);
      setFocusedNodeId(nodeId);
      setHighlightedIds(new Set([nodeId, ...neighbors]));
      setTrace({ nodeId, ts: Date.now() });

      if (node.commitHash) setExpandedCommit(node.commitHash);

      if (source !== "terminal") {
        const neighborLabels = neighbors
          .map((id) => NODE_MAP.get(id)?.label)
          .filter(Boolean)
          .join(", ");
        log(
          [
            `[sys] node.focus → ${node.id} (${NODE_TYPE_LABEL[node.type]})`,
            ...node.details.map((d) => `      ${d}`),
            neighborLabels ? `[sys] linked: ${neighborLabels}` : "",
            `[sys] trace.execute(${node.id}) … packets dispatched`,
          ].filter(Boolean),
          "info",
        );
      }

      if (node.type === "achievement") celebrate();
    },
    [log, celebrate],
  );

  const clearFocus = useCallback(() => {
    setFocusedNodeId(null);
    setHighlightedIds(new Set());
    setExpandedCommit(null);
  }, []);

  const expandCommit = useCallback(
    (hash: string | null, source: EventSource) => {
      setExpandedCommit(hash);
      if (hash && source === "timeline") {
        // timeline click also lights up the graph + terminal
        // (focusNode handles logging + trace)
      }
    },
    [],
  );

  const api = useMemo<CommandCenterApi>(
    () => ({
      focusedNodeId,
      highlightedIds,
      trace,
      expandedCommit,
      llmMode,
      panelOpen,
      unseenLogs,
      focusNode,
      clearFocus,
      runTrace,
      expandCommit,
      setLlmMode,
      log,
      celebrate,
      togglePanel,
      subscribeLogs,
    }),
    [
      focusedNodeId,
      highlightedIds,
      trace,
      expandedCommit,
      llmMode,
      panelOpen,
      unseenLogs,
      focusNode,
      clearFocus,
      runTrace,
      expandCommit,
      log,
      celebrate,
      togglePanel,
      subscribeLogs,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
