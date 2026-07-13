"use client";

import { useEffect, useRef, useState } from "react";

// ReactBits-style decrypt/scramble text: characters resolve left-to-right
// from a pool of glitch glyphs into the real string.

const GLYPHS = "!<>-_\\/[]{}—=+*^?#@$%&";

interface Props {
  text: string;
  className?: string;
  /** ms before the effect starts */
  delay?: number;
  /** ms per resolve step */
  speed?: number;
}

export default function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 35,
}: Props) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    frame.current = 0;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame.current += 1;
        const resolved = frame.current;
        if (resolved >= text.length + 4) {
          setDisplay(text);
          clearInterval(interval);
          return;
        }
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < resolved) return ch;
              return GLYPHS[(i * 7 + frame.current * 3) % GLYPHS.length];
            })
            .join(""),
        );
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return <span className={className}>{display}</span>;
}
