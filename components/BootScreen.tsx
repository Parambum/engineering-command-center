"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrambleText from "@/components/fx/ScrambleText";
import { PROFILE } from "@/lib/data";

// Aceternity multi-step-loader-style boot sequence. Plays once per browser
// session, is click-skippable, and hands control to the dashboard on finish.

const STEPS = [
  "initializing command center kernel",
  "mounting knowledge graph",
  "replaying career git history",
  "arming agent-aditya v1.0",
];

const STEP_MS = 420;
const HOLD_MS = 700;

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("cc-booted")) {
      setVisible(false);
      onDone();
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)));
    });
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("cc-booted", "1");
        setVisible(false);
        onDone();
      }, STEP_MS * STEPS.length + HOLD_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const skip = () => {
    sessionStorage.setItem("cc-booted", "1");
    setVisible(false);
    onDone();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onClick={skip}
          className="bg-grid fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-void"
        >
          <div className="w-[min(90vw,520px)] font-mono">
            <div className="mb-1 text-[10px] tracking-[0.3em] text-dim uppercase">
              engineering command center
            </div>
            <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
              <ScrambleText text={PROFILE.name.toUpperCase()} speed={28} />
            </h1>

            <div className="mt-6 space-y-1.5 text-[11.5px]">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={
                    i < step
                      ? "text-neon transition-colors"
                      : i === step
                        ? "text-slate-300"
                        : "text-dim/40"
                  }
                >
                  {i < step ? "✓" : i === step ? "▸" : "·"} {s}
                  {i === step && <span className="cursor-blink ml-1 inline-block h-3 w-[6px] bg-neon/90 align-middle" />}
                </div>
              ))}
            </div>

            {/* progress bar */}
            <div className="mt-6 h-[3px] w-full overflow-hidden rounded bg-line">
              <motion.div
                className="h-full bg-gradient-to-r from-electric via-cyan-neon to-neon"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / STEPS.length) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
            <div className="mt-3 text-[9px] tracking-widest text-dim/60 uppercase">
              click anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
