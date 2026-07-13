"use client";

// Ambient background layer — Aceternity-style Aurora + Spotlight + Meteors
// + twinkling stars. Pure CSS animations (GPU-friendly), fixed positions to
// stay hydration-safe. Sits behind the knowledge-graph canvas.

const STARS: Array<{ x: number; y: number; s: number; d: number }> = [
  { x: 8, y: 12, s: 1, d: 0 }, { x: 18, y: 62, s: 2, d: 1.2 },
  { x: 27, y: 28, s: 1, d: 2.1 }, { x: 36, y: 80, s: 1, d: 0.6 },
  { x: 44, y: 18, s: 2, d: 1.8 }, { x: 52, y: 55, s: 1, d: 2.6 },
  { x: 61, y: 9, s: 1, d: 0.9 }, { x: 68, y: 71, s: 2, d: 1.5 },
  { x: 76, y: 33, s: 1, d: 2.9 }, { x: 84, y: 58, s: 1, d: 0.4 },
  { x: 91, y: 21, s: 2, d: 2.3 }, { x: 96, y: 76, s: 1, d: 1.1 },
  { x: 13, y: 88, s: 1, d: 3.2 }, { x: 58, y: 90, s: 1, d: 1.7 },
  { x: 88, y: 92, s: 1, d: 2.7 }, { x: 4, y: 44, s: 1, d: 0.2 },
];

const METEORS: Array<{ x: number; delay: number; dur: number }> = [
  { x: 15, delay: 2, dur: 5.2 },
  { x: 42, delay: 7, dur: 6.5 },
  { x: 65, delay: 12, dur: 4.8 },
  { x: 85, delay: 18, dur: 6 },
];

export default function BackgroundFX() {
  return (
    <div aria-hidden className="fx-layer pointer-events-none absolute inset-0 overflow-hidden">
      {/* aurora blobs */}
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />

      {/* entrance spotlight sweep */}
      <div className="spotlight" />

      {/* twinkling stars */}
      {STARS.map((st, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            animationDelay: `${st.d}s`,
          }}
        />
      ))}

      {/* meteors */}
      {METEORS.map((m, i) => (
        <span
          key={i}
          className="meteor"
          style={{
            left: `${m.x}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
          }}
        />
      ))}

      {/* vignette to keep panel edges readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(4,6,11,0.8)_100%)]" />
    </div>
  );
}
