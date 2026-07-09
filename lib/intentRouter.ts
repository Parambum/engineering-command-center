import { COMMITS, EDGES, NODES, PROFILE } from "@/lib/data";

// ---------------------------------------------------------------------------
// Client-side keyword/intent router — Agent-Aditya v1.0 works fully offline.
// Flip `/llm on` in the terminal to route unmatched queries to /api/agent.
// ---------------------------------------------------------------------------

export interface RoutedResponse {
  lines: string[];
  tone?: "info" | "success" | "warn" | "error" | "agent";
  actions?: {
    focusNode?: string;
    confetti?: boolean;
    clear?: boolean;
    llm?: "on" | "off";
    /** unmatched — caller may escalate to the LLM API if enabled */
    escalate?: boolean;
  };
}

const HELP: string[] = [
  "AGENT-ADITYA v1.0 — command reference",
  "─────────────────────────────────────",
  "  /help          this menu",
  "  /whoami        operator profile",
  "  /projects      deployed project modules",
  "  /skills        loaded skill packages",
  "  /experience    professional runtime history",
  "  /wins          hackathon victories 🏆",
  "  /education     academic bootloader",
  "  /contact       open comms channels",
  "  /trace <node>  fire trace on a graph node (e.g. /trace raai)",
  "  /llm on|off    route free-text to live LLM (Groq)",
  "  /clear         wipe terminal buffer",
  "",
  "or just talk to me: “show hackathon wins”, “what is RAAI?”…",
];

function nodeSummary(id: string): string[] {
  const n = NODES.find((x) => x.id === id);
  return n ? n.details.map((d) => `  ${d}`) : [];
}

export function routeIntent(raw: string): RoutedResponse {
  const input = raw.trim();
  const q = input.toLowerCase();

  // ---- slash commands ----
  if (q === "/help" || q === "help" || q === "?") {
    return { lines: HELP, tone: "info" };
  }

  if (q === "/clear" || q === "clear" || q === "cls") {
    return { lines: [], actions: { clear: true } };
  }

  if (q.startsWith("/llm")) {
    const on = q.includes("on");
    return {
      lines: on
        ? [
            "[agent] LLM uplink → ENABLED",
            "[agent] free-text queries now route through /api/agent (Groq)",
            "[agent] if no API key is configured server-side, I fall back to local intents",
          ]
        : ["[agent] LLM uplink → DISABLED. Running on local intent router."],
      tone: on ? "success" : "warn",
      actions: { llm: on ? "on" : "off" },
    };
  }

  if (q.startsWith("/trace")) {
    const target = q.replace("/trace", "").trim();
    const node = NODES.find(
      (n) => n.id === target || n.label.toLowerCase().includes(target),
    );
    if (node) {
      return {
        lines: [
          `[sys] trace.execute(${node.id})`,
          `[sys] dispatching light packets along ${node.label} edges…`,
        ],
        tone: "success",
        actions: { focusNode: node.id },
      };
    }
    return {
      lines: [
        `[err] unknown node “${target}”`,
        `[sys] valid ids: ${NODES.map((n) => n.id).join(", ")}`,
      ],
      tone: "error",
    };
  }

  if (q === "/whoami" || q.includes("who are you") || q.includes("about you") || q.includes("about aditya")) {
    return {
      lines: [
        `operator : ${PROFILE.name}`,
        `role     : ${PROFILE.role}`,
        `handle   : ${PROFILE.handle}`,
        `edu      : ${PROFILE.education.school}`,
        `           ${PROFILE.education.program} · CGPA ${PROFILE.education.cgpa}`,
        `uptime   : building agentic systems, GNN research & winning hackathons`,
      ],
      tone: "info",
    };
  }

  if (q === "/projects" || q.includes("project")) {
    return {
      lines: [
        "[agent] mounting project modules…",
        "",
        "▸ RAAI — full-stack agentic RAG system (Sept 2025)",
        ...nodeSummary("raai"),
        "",
        "▸ Stock Market Analytics Dashboard (May 2026 – Present)",
        ...nodeSummary("stock-dash"),
        "",
        "[sys] tip: click the green nodes on the graph to trace their stack",
      ],
      tone: "success",
      actions: { focusNode: "raai" },
    };
  }

  if (q === "/skills" || q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language")) {
    return {
      lines: [
        "[agent] loaded skill packages:",
        "",
        `  languages  : ${PROFILE.skills.languages.join(", ")}`,
        `  frameworks : ${PROFILE.skills.frameworks.join(", ")}`,
        `  libs/tools : ${PROFILE.skills.tools.join(", ")}`,
        "",
        "[sys] blue nodes on the graph — click any to see where it's used",
      ],
      tone: "info",
    };
  }

  if (q === "/experience" || q.includes("experience") || q.includes("work") || q.includes("intern")) {
    return {
      lines: [
        "[agent] professional runtime history:",
        "",
        "▸ ML Research Analyst — MPSTME (Jan 2026 – Present)",
        ...nodeSummary("ml-research"),
        "",
        "▸ Technical Intern — WeCare Digital (May – July 2025)",
        ...nodeSummary("wecare"),
        "",
        "▸ Technical Executive — ACM MPSTME (July 2024 – July 2025)",
        ...nodeSummary("acm"),
        "",
        "▸ Business Development Executive — GDG MPSTME (Aug 2025 – Present)",
        ...nodeSummary("gdg"),
        "",
        "▸ Volunteer — Genesis Worldwide Foundation (Jun – Aug 2025)",
        ...nodeSummary("genesis"),
      ],
      tone: "info",
      actions: { focusNode: "ml-research" },
    };
  }

  if (
    q === "/wins" ||
    q.includes("hackathon") ||
    q.includes("win") ||
    q.includes("achievement") ||
    q.includes("award") ||
    q.includes("trophy")
  ) {
    return {
      lines: [
        "[agent] querying trophy cabinet… 2 records found 🏆🏆",
        "",
        "▸ IEEE HackXplore — WINNER (Nov 2025)",
        ...nodeSummary("hackxplore"),
        "",
        "▸ IETE ACE 2.0 — WINNER (Oct 2025)",
        ...nodeSummary("iete-ace"),
        "",
        "[sys] two wins in two months. deploying confetti…",
      ],
      tone: "success",
      actions: { focusNode: "hackxplore", confetti: true },
    };
  }

  if (q === "/education" || q.includes("education") || q.includes("college") || q.includes("cgpa") || q.includes("university")) {
    return {
      lines: [
        "[agent] academic bootloader:",
        `  ${PROFILE.education.school}`,
        `  ${PROFILE.education.program} — CGPA ${PROFILE.education.cgpa}`,
      ],
      tone: "info",
      actions: { focusNode: "mpstme" },
    };
  }

  if (q === "/contact" || q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("github") || q.includes("hire") || q.includes("reach")) {
    return {
      lines: [
        "[agent] opening comms channels…",
        `  mail     → ${PROFILE.email}`,
        `  phone    → ${PROFILE.phone}`,
        `  linkedin → ${PROFILE.linkedin}`,
        `  github   → ${PROFILE.github}`,
        "[sys] links are live in the header bar ↑",
      ],
      tone: "success",
    };
  }

  // ---- specific entities ----
  if (q.includes("raai") || q.includes("rag") || q.includes("agentic") || q.includes("langchain")) {
    return {
      lines: [
        "[agent] RAAI — the flagship module:",
        ...nodeSummary("raai"),
        `  source: https://github.com/Parambum/RaAI-2.0`,
      ],
      tone: "success",
      actions: { focusNode: "raai" },
    };
  }

  if (q.includes("stock") || q.includes("market") || q.includes("macd") || q.includes("rsi") || q.includes("trading")) {
    return {
      lines: [
        "[agent] Stock Market Analytics Dashboard:",
        ...nodeSummary("stock-dash"),
        `  source: https://github.com/Parambum/StockTrader`,
      ],
      tone: "success",
      actions: { focusNode: "stock-dash" },
    };
  }

  if (q.includes("gnn") || q.includes("fingerprint") || q.includes("research") || q.includes("graph neural")) {
    return {
      lines: [
        "[agent] active research thread:",
        ...nodeSummary("ml-research"),
      ],
      tone: "info",
      actions: { focusNode: "ml-research" },
    };
  }

  if (q.includes("seo") || q.includes("wecare") || q.includes("traffic")) {
    return {
      lines: ["[agent] WeCare Digital internship:", ...nodeSummary("wecare")],
      tone: "info",
      actions: { focusNode: "wecare" },
    };
  }

  if (q.includes("acm") || q.includes("mentor") || q.includes("teach")) {
    return {
      lines: ["[agent] ACM MPSTME — Technical Executive:", ...nodeSummary("acm")],
      tone: "info",
      actions: { focusNode: "acm" },
    };
  }

  if (q.includes("gdg") || q.includes("google developer") || q.includes("sponsor") || q.includes("business dev")) {
    return {
      lines: ["[agent] GDG MPSTME — Business Development Executive:", ...nodeSummary("gdg")],
      tone: "info",
      actions: { focusNode: "gdg" },
    };
  }

  if (q.includes("volunteer") || q.includes("genesis") || q.includes("community")) {
    return {
      lines: ["[agent] Genesis Worldwide Foundation:", ...nodeSummary("genesis")],
      tone: "info",
      actions: { focusNode: "genesis" },
    };
  }

  if (q.includes("timeline") || q.includes("history") || q.includes("log")) {
    return {
      lines: [
        "[agent] the main workspace ← is a live git log of my career.",
        `[sys] ${COMMITS.length} commits on branch main. click any hash to expand its diff.`,
      ],
      tone: "info",
    };
  }

  // ---- fallback ----
  return {
    lines: [
      `[agent] no local intent matched “${input}”.`,
      "[sys] try /help — or enable the live LLM uplink with /llm on",
    ],
    tone: "warn",
    actions: { escalate: true },
  };
}

export const BOOT_SEQUENCE: string[] = [
  "AGENT-ADITYA v1.0 — engineering command center",
  "──────────────────────────────────────────────",
  "[boot] kernel loaded … OK",
  `[boot] mounting knowledge graph (${NODES.length} nodes / ${EDGES.length} edges) … OK`,
  `[boot] replaying git history (${COMMITS.length} commits) … OK`,
  "[boot] intent router online — no API key required",
  "",
  `Welcome. I'm the agent guarding ${PROFILE.name}'s portfolio.`,
  "Type /help to see what I can do, or click anything on screen.",
];
