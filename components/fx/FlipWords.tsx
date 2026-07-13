"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Aceternity-style FlipWords: rotating word with blur/slide transitions.

interface Props {
  words: string[];
  className?: string;
  interval?: number;
}

export default function FlipWords({ words, className, interval = 2600 }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={className} style={{ display: "inline-block" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[idx]}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ display: "inline-block" }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
