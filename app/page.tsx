"use client";

import { useState } from "react";
import { Share2, GitCommit, TerminalSquare } from "lucide-react";
import { CommandCenterProvider } from "@/components/CommandCenterProvider";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import GitTimeline from "@/components/GitTimeline";
import Terminal from "@/components/Terminal";
import NodeInspector from "@/components/NodeInspector";
import StatusBar from "@/components/StatusBar";
import { NODE_COLORS, NODE_TYPE_LABEL, type NodeType } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "graph" | "timeline" | "terminal";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "timeline", label: "git log", icon: GitCommit },
  { id: "graph", label: "graph", icon: Share2 },
  { id: "terminal", label: "terminal", icon: TerminalSquare },
];

function Legend() {
  return (
    <div className="glass pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-1.5">
      {(Object.keys(NODE_COLORS) as NodeType[]).map((t) => (
        <span key={t} className="flex items-center gap-1.5 text-[9px] tracking-wider text-ghost uppercase">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: NODE_COLORS[t], boxShadow: `0 0 6px ${NODE_COLORS[t]}` }}
          />
          {NODE_TYPE_LABEL[t]}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("graph");

  return (
    <CommandCenterProvider>
      <div className="bg-grid scanlines relative flex h-dvh flex-col bg-void">
        <StatusBar />

        {/* ================= desktop: layered dashboard ================= */}
        <main className="relative hidden flex-1 overflow-hidden lg:block">
          <KnowledgeGraph />

          <div className="pointer-events-none absolute inset-0 flex gap-4 p-4">
            {/* left — git timeline */}
            <section className="glass pointer-events-auto w-[30rem] shrink-0 overflow-hidden rounded-lg">
              <GitTimeline />
            </section>

            {/* right column — legend, inspector, terminal */}
            <div className="flex min-w-0 flex-1 flex-col items-end justify-between gap-3">
              <div className="flex w-full items-start justify-between gap-3">
                <Legend />
                <div className="pointer-events-auto w-[24rem] max-w-full">
                  <NodeInspector />
                </div>
              </div>
              <div className="pointer-events-auto h-[42%] w-[36rem] max-w-full">
                <Terminal />
              </div>
            </div>
          </div>
        </main>

        {/* ================= mobile: tabbed panels ================= */}
        <main className="relative flex-1 overflow-hidden lg:hidden">
          <div className={cn("absolute inset-0", tab !== "graph" && "invisible")}>
            <KnowledgeGraph />
            <div className="pointer-events-none absolute inset-x-3 top-3 space-y-2">
              <Legend />
              <div className="pointer-events-auto">
                <NodeInspector />
              </div>
            </div>
          </div>
          {tab === "timeline" && (
            <div className="glass absolute inset-3 overflow-hidden rounded-lg">
              <GitTimeline />
            </div>
          )}
          <div className={cn("absolute inset-3", tab !== "terminal" && "hidden")}>
            <Terminal />
          </div>
        </main>

        {/* mobile tab bar */}
        <nav className="glass z-20 flex border-x-0 border-b-0 lg:hidden">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-[10px] tracking-widest uppercase transition-colors",
                tab === id ? "text-neon" : "text-dim",
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </CommandCenterProvider>
  );
}
