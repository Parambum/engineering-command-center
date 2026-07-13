"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { useCommandCenter } from "@/components/CommandCenterProvider";
import ScrambleText from "@/components/fx/ScrambleText";
import FlipWords from "@/components/fx/FlipWords";
import { cn } from "@/lib/utils";

const ROLES = [
  "ML Research Analyst",
  "Agentic AI Engineer",
  "2× Hackathon Winner",
  "Full-Stack Developer",
];

export default function StatusBar() {
  const { llmMode } = useCommandCenter();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="glass relative z-20 flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5">
      <span className="shimmer-line absolute inset-x-0 bottom-0 h-px" />
      <span className="relative inline-block h-8 w-8 shrink-0 overflow-hidden rounded-full border border-electric/50 shadow-[0_0_10px_rgba(56,189,248,0.35)]">
        <Image
          src="https://avatars.githubusercontent.com/Parambum?size=96"
          alt="Aditya Parameswar"
          fill
          sizes="32px"
          className="object-cover"
          priority
        />
      </span>
      <div className="leading-tight">
        <h1 className="text-[13px] font-semibold tracking-wide text-slate-100">
          <ScrambleText text={PROFILE.name} delay={250} />
          <span className="ml-2 hidden text-[10px] font-normal tracking-[0.2em] text-dim uppercase sm:inline">
            engineering command center
          </span>
        </h1>
        <p className="hidden text-[10px] text-ghost md:block">
          <FlipWords words={ROLES} className="text-electric" />
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 text-[10px] tracking-widest text-neon uppercase lg:flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-neon" />
          all systems operational
        </span>
        <span
          className={cn(
            "hidden rounded border px-1.5 py-0.5 text-[9px] tracking-widest uppercase sm:inline",
            llmMode ? "border-neon/50 text-neon" : "border-line-bright text-dim",
          )}
        >
          {llmMode ? "llm uplink" : "local intents"}
        </span>
        <span className="hidden text-[11px] text-dim tabular-nums md:inline">
          {time} IST
        </span>

        <nav className="flex items-center gap-2 border-l border-line pl-3 text-[10px] tracking-wider">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded border border-line px-1.5 py-0.5 text-ghost transition-colors hover:border-neon/60 hover:text-neon"
          >
            gh
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded border border-line px-1.5 py-0.5 text-ghost transition-colors hover:border-electric/60 hover:text-electric"
          >
            in
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            aria-label="Email"
            className="flex items-center rounded border border-line px-1.5 py-0.5 text-ghost transition-colors hover:border-amber-soft/60 hover:text-amber-soft"
          >
            <Mail size={11} />
          </a>
        </nav>
      </div>
    </header>
  );
}
