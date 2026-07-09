"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, FileDiff, Trophy, FlaskConical, Rocket, TrendingUp, Users, GraduationCap, HeartHandshake } from "lucide-react";
import { COMMITS, PROFILE, type Commit, type CommitType } from "@/lib/data";
import { useCommandCenter } from "@/components/CommandCenterProvider";
import { cn } from "@/lib/utils";

const TYPE_META: Record<
  CommitType,
  { color: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  feat: { color: "text-neon", icon: Rocket },
  research: { color: "text-electric", icon: FlaskConical },
  win: { color: "text-amber-soft", icon: Trophy },
  perf: { color: "text-cyan-neon", icon: TrendingUp },
  mentor: { color: "text-violet-soft", icon: Users },
  community: { color: "text-rose-300", icon: HeartHandshake },
  init: { color: "text-pink-400", icon: GraduationCap },
};

function DiffBlock({ commit }: { commit: Commit }) {
  return (
    <div className="mt-3 overflow-hidden rounded border border-line bg-void/70 text-[11px]">
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5 text-dim">
        <FileDiff size={11} />
        <span>{commit.diff.file}</span>
        <span className="ml-auto">
          <span className="text-blood">-{commit.diff.before.length}</span>{" "}
          <span className="text-neon">+{commit.diff.after.length}</span>
        </span>
      </div>
      <div className="px-0 py-1 leading-relaxed">
        <div className="px-3 py-0.5 text-electric/70">
          @@ challenge → solution @@
        </div>
        {commit.diff.before.map((line, i) => (
          <div key={`b${i}`} className="bg-blood/10 px-3 py-0.5 text-red-300">
            <span className="mr-2 select-none text-blood">-</span>
            {line}
          </div>
        ))}
        {commit.diff.after.map((line, i) => (
          <div key={`a${i}`} className="bg-neon/10 px-3 py-0.5 text-emerald-200">
            <span className="mr-2 select-none text-neon">+</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GitTimeline() {
  const { expandedCommit, focusNode, expandCommit } = useCommandCenter();
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // scroll expanded commit into view when set externally
  useEffect(() => {
    if (!expandedCommit) return;
    const el = rowRefs.current.get(expandedCommit);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [expandedCommit]);

  const toggle = (c: Commit) => {
    if (expandedCommit === c.hash) {
      expandCommit(null, "timeline");
    } else {
      // focusNode lights the graph + logs + fires the trace; expandCommit
      // wins afterwards so the clicked hash (not the node's default) opens
      focusNode(c.nodeId, "timeline");
      expandCommit(c.hash, "timeline");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <GitCommit size={13} className="text-neon" />
        <span className="panel-title">
          git log --graph · branch: <span className="text-neon">career/main</span>
        </span>
        <span className="ml-auto text-[10px] text-dim">{COMMITS.length} commits</span>
      </div>

      <div className="relative flex-1 overflow-y-auto px-4 py-3">
        {/* rail */}
        <div className="absolute top-3 bottom-3 left-[27px] w-px bg-line" />

        <div className="space-y-1">
          {COMMITS.map((c) => {
            const meta = TYPE_META[c.type];
            const Icon = meta.icon;
            const open = expandedCommit === c.hash;
            return (
              <div
                key={c.hash}
                ref={(el) => {
                  if (el) rowRefs.current.set(c.hash, el);
                }}
                className="relative pl-8"
              >
                {/* dot on rail */}
                <span
                  className={cn(
                    "absolute top-2.5 left-[3px] flex h-4 w-4 items-center justify-center rounded-full border bg-void",
                    open ? "border-neon" : "border-line-bright",
                  )}
                >
                  <Icon size={9} className={meta.color} />
                </span>

                <button
                  onClick={() => toggle(c)}
                  className={cn(
                    "w-full rounded px-2 py-1.5 text-left transition-colors hover:bg-panel",
                    open && "bg-panel",
                  )}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 text-[11.5px]">
                    <span className="text-amber-soft">{c.hash}</span>
                    <span className={cn("font-medium", meta.color)}>
                      {c.title}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-dim">
                    <span>{c.dateLabel}</span>
                    <span>·</span>
                    <span>{PROFILE.handle}</span>
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-line px-1 py-px text-[9px] text-ghost"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <DiffBlock commit={c} />
                      <div className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
