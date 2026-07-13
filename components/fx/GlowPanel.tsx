"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

// Aceternity-style Card Spotlight + Moving Border combined:
//  - a radial spotlight follows the cursor inside the panel
//  - a slow conic-gradient arc orbits the panel border (CSS @property)

interface Props {
  children: ReactNode;
  className?: string;
  /** disable the orbiting border arc (for very small panels) */
  border?: boolean;
}

export default function GlowPanel({ children, className, border = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn("glow-panel group", border && "glow-panel-border", className)}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(56,189,248,0.09), transparent 65%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
