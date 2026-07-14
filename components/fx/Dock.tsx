"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { GitCommit, TerminalSquare } from "lucide-react";
import { useCommandCenter, type PanelId } from "@/components/CommandCenterProvider";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Floating dock (Aceternity FloatingDock pattern): icons magnify based on
// cursor proximity, tooltips float above, and each item toggles a workspace
// panel. A neon badge counts logs that arrived while the terminal was closed.
// ---------------------------------------------------------------------------

const ITEMS: {
  id: PanelId;
  label: string;
  kbd: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "timeline", label: "git log", kbd: "ctrl+b", icon: GitCommit },
  { id: "terminal", label: "terminal", kbd: "ctrl+`", icon: TerminalSquare },
];

function DockItem({
  item,
  mouseX,
}: {
  item: (typeof ITEMS)[number];
  mouseX: MotionValue<number>;
}) {
  const { panelOpen, togglePanel, unseenLogs } = useCommandCenter();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const open = panelOpen[item.id];
  const badge = item.id === "terminal" ? unseenLogs : 0;
  const Icon = item.icon;

  // proximity magnification — the closer the cursor, the bigger the icon
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.x + r.width / 2) : Infinity;
  });
  const sizeRaw = useTransform(distance, [-110, 0, 110], [44, reduced ? 44 : 62, 44]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 180, damping: 14 });
  const iconScaleRaw = useTransform(distance, [-110, 0, 110], [1, reduced ? 1 : 1.35, 1]);
  const iconScale = useSpring(iconScaleRaw, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <motion.button
      ref={ref}
      style={{ width: size, height: size }}
      onClick={() => togglePanel(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${open ? "close" : "open"} ${item.label}`}
      aria-pressed={open}
      className={cn(
        "relative flex items-center justify-center rounded-xl border transition-colors",
        open
          ? "border-line-bright bg-panel/80 text-electric"
          : "border-line bg-void/70 text-dim hover:text-ghost",
      )}
    >
      {/* tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute -top-9 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded border border-line bg-void/95 px-2 py-1 text-[9px] whitespace-nowrap text-ghost uppercase tracking-widest"
          >
            {open ? "close" : "open"} {item.label}
            <kbd className="rounded border border-line-bright px-1 text-[8px] text-dim normal-case">
              {item.kbd}
            </kbd>
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span style={{ scale: iconScale }} className="flex">
        <Icon size={18} />
      </motion.span>

      {/* unseen-logs badge */}
      <AnimatePresence>
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon px-1 text-[9px] font-bold text-void shadow-[0_0_10px_rgba(52,245,164,0.8)]"
          >
            {badge > 9 ? "9+" : badge}
          </motion.span>
        )}
      </AnimatePresence>

      {/* active indicator */}
      <span
        className={cn(
          "absolute -bottom-[7px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all",
          open
            ? "bg-neon shadow-[0_0_6px_rgba(52,245,164,0.9)]"
            : "bg-line-bright",
        )}
      />
    </motion.button>
  );
}

export default function Dock() {
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.21, 0.65, 0.32, 1] }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      aria-label="workspace dock"
      className="glass pointer-events-auto absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-end gap-3 rounded-2xl px-3 pt-2 pb-3 lg:flex"
    >
      {ITEMS.map((item) => (
        <DockItem key={item.id} item={item} mouseX={mouseX} />
      ))}
    </motion.nav>
  );
}
