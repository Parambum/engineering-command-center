"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Crosshair, X } from "lucide-react";
import { NODE_MAP, NODE_COLORS, NODE_TYPE_LABEL, neighborsOf } from "@/lib/data";
import { useCommandCenter } from "@/components/CommandCenterProvider";

export default function NodeInspector() {
  const { focusedNodeId, focusNode, clearFocus } = useCommandCenter();
  const node = focusedNodeId ? NODE_MAP.get(focusedNodeId) : null;

  return (
    <AnimatePresence mode="wait">
      {node ? (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-lg p-4"
        >
          <div className="flex items-start gap-2">
            <span
              className="mt-1 inline-block h-2.5 w-2.5 rounded-full"
              style={{
                background: NODE_COLORS[node.type],
                boxShadow: `0 0 10px ${NODE_COLORS[node.type]}`,
              }}
            />
            <div className="min-w-0">
              <div className="panel-title">{NODE_TYPE_LABEL[node.type]} :: node/{node.id}</div>
              <h3 className="truncate text-sm font-semibold text-slate-100">
                {node.label}
              </h3>
            </div>
            <button
              onClick={clearFocus}
              className="ml-auto text-dim transition-colors hover:text-ghost"
              aria-label="close inspector"
            >
              <X size={13} />
            </button>
          </div>

          <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-slate-300">
            {node.details.map((d, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-electric">▹</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {neighborsOf(node.id).map((id) => {
              const n = NODE_MAP.get(id);
              if (!n) return null;
              return (
                <button
                  key={id}
                  onClick={() => focusNode(id, "inspector")}
                  className="rounded border border-line px-1.5 py-0.5 text-[9.5px] text-ghost transition-colors hover:border-electric/60 hover:text-electric"
                >
                  {n.label}
                </button>
              );
            })}
          </div>

          {node.link && (
            <a
              href={node.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded border border-neon/40 px-2 py-1 text-[10px] tracking-wider text-neon uppercase transition-colors hover:bg-neon/10"
            >
              <ExternalLink size={10} /> open source repo
            </a>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass flex items-center gap-2 rounded-lg px-4 py-3 text-[11px] text-dim"
        >
          <Crosshair size={12} className="text-electric" />
          node inspector idle — click a node on the graph or a commit hash
        </motion.div>
      )}
    </AnimatePresence>
  );
}
