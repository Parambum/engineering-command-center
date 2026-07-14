"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Share2, GitCommit, TerminalSquare } from "lucide-react";
import {
  CommandCenterProvider,
  useCommandCenter,
} from "@/components/CommandCenterProvider";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import GitTimeline from "@/components/GitTimeline";
import Terminal from "@/components/Terminal";
import NodeInspector from "@/components/NodeInspector";
import StatusBar from "@/components/StatusBar";
import BootScreen from "@/components/BootScreen";
import BackgroundFX from "@/components/fx/BackgroundFX";
import GlowPanel from "@/components/fx/GlowPanel";
import Dock from "@/components/fx/Dock";
import { NODE_COLORS, NODE_TYPE_LABEL, type NodeType } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "graph" | "timeline" | "terminal";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "timeline", label: "git log", icon: GitCommit },
  { id: "graph", label: "graph", icon: Share2 },
  { id: "terminal", label: "terminal", icon: TerminalSquare },
];

const panelIn = (delay: number) => ({
  initial: { opacity: 0, y: 26, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.55, delay, ease: [0.21, 0.65, 0.32, 1] as const },
});

// ---- minimize/restore choreography (ReactBits-style springy blur reveals,
// panels collapse toward the dock like an OS window minimize) ----
const timelineVariants: Variants = {
  open: {
    width: "30rem",
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    visibility: "visible",
    transition: { type: "spring", stiffness: 230, damping: 28 },
  },
  closed: {
    width: 0,
    opacity: 0,
    x: -90,
    scale: 0.85,
    filter: "blur(10px)",
    transition: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
    transitionEnd: { visibility: "hidden" },
  },
};

const terminalVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    visibility: "visible",
    transition: { type: "spring", stiffness: 240, damping: 23 },
  },
  closed: {
    opacity: 0,
    y: 150,
    scale: 0.6,
    filter: "blur(12px)",
    transition: { duration: 0.3, ease: "easeIn" },
    transitionEnd: { visibility: "hidden" },
  },
};

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

function Workspace() {
  const [tab, setTab] = useState<Tab>("graph");
  const [booted, setBooted] = useState(false);
  const { panelOpen, togglePanel } = useCommandCenter();

  // keyboard shortcuts: ctrl+` terminal · ctrl+b git log (VS Code muscle memory)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "`") {
        e.preventDefault();
        togglePanel("terminal");
      } else if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        togglePanel("timeline");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePanel]);

  return (
    <>
      <BootScreen onDone={() => setBooted(true)} />

      <div className="bg-grid scanlines relative flex h-dvh flex-col bg-void">
        <StatusBar />

        {/* ================= desktop: layered dashboard ================= */}
        <main className="relative hidden flex-1 overflow-hidden lg:block">
          <BackgroundFX />
          <KnowledgeGraph />

          {booted && (
            <div className="pointer-events-none absolute inset-0 flex gap-4 p-4">
              {/* left — git timeline (collapsible) */}
              <motion.section
                initial={false}
                animate={panelOpen.timeline ? "open" : "closed"}
                variants={timelineVariants}
                style={{ transformOrigin: "bottom left" }}
                className="pointer-events-auto shrink-0"
              >
                <motion.div {...panelIn(0.05)} className="h-full w-[30rem]">
                  <GlowPanel className="h-full">
                    <div className="glass h-full overflow-hidden rounded-lg">
                      <GitTimeline onClose={() => togglePanel("timeline", false)} />
                    </div>
                  </GlowPanel>
                </motion.div>
              </motion.section>

              {/* right column — legend, inspector, terminal */}
              <div className="flex min-w-0 flex-1 flex-col items-end justify-between gap-3">
                <div className="flex w-full items-start justify-between gap-3">
                  <motion.div {...panelIn(0.28)}>
                    <Legend />
                  </motion.div>
                  <motion.div
                    {...panelIn(0.2)}
                    className="pointer-events-auto w-[24rem] max-w-full"
                  >
                    <NodeInspector />
                  </motion.div>
                </div>

                {/* terminal (collapsible — minimizes toward the dock) */}
                <motion.div
                  initial={false}
                  animate={panelOpen.terminal ? "open" : "closed"}
                  variants={terminalVariants}
                  style={{ transformOrigin: "bottom center" }}
                  className="pointer-events-auto h-[42%] w-[36rem] max-w-full"
                >
                  <motion.div {...panelIn(0.12)} className="h-full">
                    <GlowPanel className="h-full">
                      <Terminal onClose={() => togglePanel("terminal", false)} />
                    </GlowPanel>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          )}

          {booted && <Dock />}
        </main>

        {/* ================= mobile: tabbed panels ================= */}
        <main className="relative flex-1 overflow-hidden lg:hidden">
          <div className={cn("absolute inset-0", tab !== "graph" && "invisible")}>
            <BackgroundFX />
            <KnowledgeGraph />
            <div className="pointer-events-none absolute inset-x-3 top-3 space-y-2">
              <Legend />
              <div className="pointer-events-auto">
                <NodeInspector />
              </div>
            </div>
          </div>
          {tab === "timeline" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass absolute inset-3 overflow-hidden rounded-lg"
            >
              <GitTimeline />
            </motion.div>
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
                "relative flex flex-1 items-center justify-center gap-2 py-3 text-[10px] tracking-widest uppercase transition-colors",
                tab === id ? "text-neon" : "text-dim",
              )}
            >
              {tab === id && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-electric to-neon shadow-[0_0_8px_rgba(52,245,164,0.8)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <CommandCenterProvider>
      <Workspace />
    </CommandCenterProvider>
  );
}
