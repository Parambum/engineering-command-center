"use client";

import { useEffect, useRef } from "react";
import {
  EDGES,
  NODES,
  NODE_COLORS,
  type GraphNode,
} from "@/lib/data";
import { useCommandCenter } from "@/components/CommandCenterProvider";

// ---------------------------------------------------------------------------
// Interactive knowledge-graph rendered on raw HTML5 canvas.
//  - nodes float gently; hover brightens; click focuses + notifies terminal
//  - focusing dims unrelated nodes and brightens the dependency subgraph
//  - "trace execution": light packets travel along every edge touching the
//    activated node, staggered, two loops
// ---------------------------------------------------------------------------

interface Packet {
  from: GraphNode;
  to: GraphNode;
  start: number;
  dur: number;
  color: string;
}

const RADIUS: Record<GraphNode["type"], number> = {
  project: 11,
  achievement: 9,
  experience: 8,
  internship: 8,
  education: 8,
  skill: 5.5,
};

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { focusedNodeId, highlightedIds, trace, focusNode, clearFocus } =
    useCommandCenter();

  // latest interaction state, readable inside the rAF loop
  const stateRef = useRef({ focusedNodeId, highlightedIds });
  stateRef.current = { focusedNodeId, highlightedIds };

  const hoverRef = useRef<string | null>(null);
  const packetsRef = useRef<Packet[]>([]);
  const rippleRef = useRef<{ nodeId: string; start: number } | null>(null);

  // spawn trace packets whenever a trace signal fires
  useEffect(() => {
    if (!trace) return;
    const nodeMap = new Map(NODES.map((n) => [n.id, n]));
    const target = nodeMap.get(trace.nodeId);
    if (!target) return;

    const packets: Packet[] = [];
    let i = 0;
    for (const e of EDGES) {
      if (e.from !== trace.nodeId && e.to !== trace.nodeId) continue;
      const from = nodeMap.get(e.from === trace.nodeId ? e.to : e.from)!;
      // packets flow inward, toward the activated node
      for (let loop = 0; loop < 2; loop++) {
        packets.push({
          from,
          to: target,
          start: performance.now() + i * 90 + loop * 1000,
          dur: 850,
          color: NODE_COLORS[target.type],
        });
      }
      i++;
    }
    packetsRef.current = packets;
    rippleRef.current = { nodeId: trace.nodeId, start: performance.now() };
  }, [trace]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // pixel position with gentle float
    const pos = (n: GraphNode, t: number) => {
      const fx = Math.sin(t / 2400 + n.x * 12) * 5;
      const fy = Math.cos(t / 2900 + n.y * 12) * 5;
      return {
        x: n.x * (w - 120) + 60 + fx,
        y: n.y * (h - 120) + 60 + fy,
      };
    };

    const hitTest = (mx: number, my: number, t: number): GraphNode | null => {
      for (const n of NODES) {
        const p = pos(n, t);
        const r = RADIUS[n.type] + 8;
        if ((mx - p.x) ** 2 + (my - p.y) ** 2 <= r * r) return n;
      }
      return null;
    };

    const onMove = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const n = hitTest(
        ev.clientX - rect.left,
        ev.clientY - rect.top,
        performance.now(),
      );
      hoverRef.current = n?.id ?? null;
      canvas.style.cursor = n ? "pointer" : "default";
    };

    const onClick = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const n = hitTest(
        ev.clientX - rect.left,
        ev.clientY - rect.top,
        performance.now(),
      );
      if (n) focusNode(n.id, "graph");
      else clearFocus();
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);

    const nodeMap = new Map(NODES.map((n) => [n.id, n]));

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const { focusedNodeId: focused, highlightedIds: hi } = stateRef.current;
      const hasFocus = focused !== null && hi.size > 0;
      const hover = hoverRef.current;

      // ---- edges ----
      for (const e of EDGES) {
        const a = nodeMap.get(e.from)!;
        const b = nodeMap.get(e.to)!;
        const pa = pos(a, t);
        const pb = pos(b, t);
        const lit =
          hasFocus && hi.has(a.id) && hi.has(b.id) &&
          (a.id === focused || b.id === focused);

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        if (lit) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
          ctx.lineWidth = 1.4;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 6;
        } else {
          ctx.strokeStyle = hasFocus
            ? "rgba(36, 57, 94, 0.25)"
            : "rgba(36, 57, 94, 0.55)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ---- trace packets ----
      const now = performance.now();
      packetsRef.current = packetsRef.current.filter(
        (p) => now < p.start + p.dur,
      );
      for (const p of packetsRef.current) {
        if (now < p.start) continue;
        const raw = (now - p.start) / p.dur;
        const k = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2; // easeInOut
        const pa = pos(p.from, t);
        const pb = pos(p.to, t);
        const x = pa.x + (pb.x - pa.x) * k;
        const y = pa.y + (pb.y - pa.y) * k;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
        // short tail
        ctx.beginPath();
        const tx = pa.x + (pb.x - pa.x) * Math.max(k - 0.06, 0);
        const ty = pa.y + (pb.y - pa.y) * Math.max(k - 0.06, 0);
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.strokeStyle = p.color + "88";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // ---- ripple on traced node ----
      const ripple = rippleRef.current;
      if (ripple && now - ripple.start < 1200) {
        const n = nodeMap.get(ripple.nodeId);
        if (n) {
          const p = pos(n, t);
          const k = (now - ripple.start) / 1200;
          ctx.beginPath();
          ctx.arc(p.x, p.y, RADIUS[n.type] + k * 34, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 245, 164, ${0.5 * (1 - k)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // ---- nodes ----
      for (const n of NODES) {
        const p = pos(n, t);
        const r = RADIUS[n.type];
        const color = NODE_COLORS[n.type];
        const isFocused = focused === n.id;
        const isLit = !hasFocus || hi.has(n.id);
        const isHover = hover === n.id;
        const alpha = isLit ? 1 : 0.22;

        ctx.globalAlpha = alpha;

        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isFocused || isHover ? 26 : 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // inner core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(r - 3, 2), 0, Math.PI * 2);
        ctx.fillStyle = "#04060b";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(r - 5, 1.2), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // focus ring
        if (isFocused) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 5 + Math.sin(t / 220) * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // label
        ctx.font =
          n.type === "skill"
            ? "10px var(--font-jetbrains), monospace"
            : "600 11px var(--font-jetbrains), monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = isFocused || isHover ? "#e2e8f0" : "#94a3b8";
        ctx.fillText(n.label, p.x, p.y + r + 14);

        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [focusNode, clearFocus]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
