// ---------------------------------------------------------------------------
// THE ENGINEERING COMMAND CENTER — single source of truth for all panels.
// Every fact here is real profile data for Aditya Parameswar.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Aditya Parameswar",
  handle: "parambum",
  role: "ML Research Analyst · Full-Stack & Agentic AI Engineer",
  email: "adityaparam2006@gmail.com",
  phone: "+91 9137601844",
  github: "https://github.com/Parambum",
  linkedin: "https://www.linkedin.com/in/aditya-parameswar-339418276/",
  education: {
    school: "Mukesh Patel School of Technology Management and Engineering",
    program: "B.Tech Computer Science (Aug 2022 – Present) · Mumbai",
    cgpa: "3.65",
    prior: "Arya Vidya Mandir — X grade ICSE, 96 percentile",
  },
  skills: {
    languages: ["Java", "Python", "C/C++", "SQL (Postgres)", "JavaScript", "HTML/CSS", "R"],
    frameworks: ["React", "Next.js", "Node.js", "Flask", "FastAPI", "WordPress"],
    tools: ["Pandas", "NumPy", "Matplotlib", "LangChain", "MongoDB", "Git"],
  },
} as const;

export type NodeType =
  | "skill"
  | "experience"
  | "project"
  | "achievement"
  | "education";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  /** normalized layout position, 0..1 in both axes */
  x: number;
  y: number;
  details: string[];
  link?: string;
  /** timeline commit this node maps to, if any */
  commitHash?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export const NODES: GraphNode[] = [
  // ---- education ----
  {
    id: "mpstme",
    label: "MPSTME · CS",
    type: "education",
    x: 0.5,
    y: 0.9,
    details: [
      "Mukesh Patel School of Technology Management and Engineering, Mumbai",
      "B.Tech Computer Science (Aug 2022 – Present) — CGPA 3.65",
      "Prior: Arya Vidya Mandir — X grade ICSE, 96 percentile",
    ],
    commitHash: "a0d17ya",
  },

  // ---- experience ----
  {
    id: "ml-research",
    label: "ML Research @ MPSTME",
    type: "experience",
    x: 0.68,
    y: 0.74,
    details: [
      "Machine Learning Research Analyst (Jan 2026 – Present)",
      "Framework for fingerprint analysis using Graph Neural Networks",
      "Applies graph theory to map minutiae with high precision",
    ],
    commitHash: "f1n6er9",
  },
  {
    id: "wecare",
    label: "WeCare Digital",
    type: "experience",
    x: 0.3,
    y: 0.78,
    details: [
      "Technical Intern (May 2025 – July 2025) · Mumbai",
      "Optimized on-page content & metadata for high-priority keywords",
      "+10% organic search traffic within 2 months",
      "Keyword research & competitor analysis → top-10 rankings",
    ],
    commitHash: "5e0b00st",
  },
  {
    id: "acm",
    label: "ACM MPSTME",
    type: "experience",
    x: 0.18,
    y: 0.6,
    details: [
      "Technical Executive (July 2024 – July 2025)",
      "Conducted frontend development workshops",
      "Taught HTML5, CSS3 & React fundamentals to a cohort of 50 students",
    ],
    commitHash: "m3nt0r50",
  },
  {
    id: "gdg",
    label: "GDG MPSTME",
    type: "experience",
    x: 0.4,
    y: 0.68,
    details: [
      "Business Development Executive (Aug 2025 – Present)",
      "Secured strategic sponsorships with local tech firms",
      "Directed outreach to onboard industry experts & expand community reach",
    ],
    commitHash: "9d9biz0",
  },
  {
    id: "genesis",
    label: "Genesis Foundation",
    type: "experience",
    x: 0.07,
    y: 0.92,
    details: [
      "Volunteer — Genesis Worldwide Foundation (Jun 2025 – Aug 2025)",
      "Managed logistics for health check-up camps",
      "Daily administrative support for 25+ residents",
    ],
    commitHash: "v0lunt33r",
  },

  // ---- projects ----
  {
    id: "raai",
    label: "RAAI",
    type: "project",
    x: 0.46,
    y: 0.38,
    details: [
      "Full-stack Agentic RAG system (Sept 2025)",
      "Automates complex data retrieval & reasoning tasks",
      "Stack: Next.js · React · FastAPI · MongoDB · LangChain",
    ],
    link: "https://github.com/Parambum/RaAI-2.0",
    commitHash: "ra9a1b2",
  },
  {
    id: "stock-dash",
    label: "Stock Analytics",
    type: "project",
    x: 0.78,
    y: 0.42,
    details: [
      "Real-time market analytics pipeline (May 2026 – Present)",
      "Fetches live equities, computes MACD & RSI indicators",
      "Stack: Flask · PostgreSQL · Pandas",
    ],
    link: "https://github.com/Parambum/StockTrader",
    commitHash: "57ockda5h",
  },

  // ---- achievements ----
  {
    id: "hackxplore",
    label: "IEEE HackXplore 🏆",
    type: "achievement",
    x: 0.32,
    y: 0.2,
    details: [
      "Winner — IEEE HackXplore (Nov 2025)",
      "Multi-LLM RAG system for emotional intelligence analysis",
      "Orchestrated with LangChain · full-stack interface in Next.js",
    ],
    commitHash: "w1nhackx",
  },
  {
    id: "iete-ace",
    label: "IETE ACE 2.0 🏆",
    type: "achievement",
    x: 0.62,
    y: 0.16,
    details: ["Winner — IETE ACE 2.0 (Oct 2025)"],
    commitHash: "w1nace2",
  },

  // ---- skills ----
  { id: "python", label: "Python", type: "skill", x: 0.88, y: 0.62, details: ["Core language for ML research, pipelines & backends"] },
  { id: "react", label: "React", type: "skill", x: 0.22, y: 0.42, details: ["Frontend library — used in RAAI, taught at ACM"] },
  { id: "nextjs", label: "Next.js", type: "skill", x: 0.34, y: 0.52, details: ["Full-stack React framework — powers RAAI"] },
  { id: "fastapi", label: "FastAPI", type: "skill", x: 0.52, y: 0.56, details: ["Async Python API layer for RAAI"] },
  { id: "mongodb", label: "MongoDB", type: "skill", x: 0.6, y: 0.5, details: ["Document store backing RAAI"] },
  { id: "langchain", label: "LangChain", type: "skill", x: 0.44, y: 0.24, details: ["Agent & RAG orchestration — RAAI, HackXplore winner build"] },
  { id: "rag", label: "Agentic RAG", type: "skill", x: 0.54, y: 0.3, details: ["Retrieval-augmented generation with agentic reasoning loops"] },
  { id: "gnn", label: "Graph Neural Nets", type: "skill", x: 0.82, y: 0.8, details: ["GNNs + graph theory for fingerprint minutiae mapping"] },
  { id: "flask", label: "Flask", type: "skill", x: 0.88, y: 0.3, details: ["Python microframework — stock analytics pipeline"] },
  { id: "postgresql", label: "PostgreSQL", type: "skill", x: 0.94, y: 0.46, details: ["Relational store for live market data"] },
  { id: "pandas", label: "Pandas", type: "skill", x: 0.72, y: 0.28, details: ["Technical indicator computation (MACD, RSI)"] },
  { id: "seo", label: "SEO / Web Opt.", type: "skill", x: 0.14, y: 0.76, details: ["On-page content & metadata optimization"] },
  { id: "webfund", label: "HTML5 / CSS3", type: "skill", x: 0.1, y: 0.44, details: ["Web fundamentals — ACM mentorship curriculum"] },
];

export const EDGES: GraphEdge[] = [
  // education feeds experience
  { from: "mpstme", to: "ml-research" },
  { from: "mpstme", to: "acm" },
  { from: "mpstme", to: "wecare" },
  { from: "mpstme", to: "gdg" },

  // RAAI dependencies
  { from: "nextjs", to: "raai" },
  { from: "react", to: "raai" },
  { from: "fastapi", to: "raai" },
  { from: "mongodb", to: "raai" },
  { from: "langchain", to: "raai" },
  { from: "rag", to: "raai" },

  // Stock dashboard dependencies
  { from: "flask", to: "stock-dash" },
  { from: "postgresql", to: "stock-dash" },
  { from: "pandas", to: "stock-dash" },
  { from: "python", to: "stock-dash" },

  // research
  { from: "gnn", to: "ml-research" },
  { from: "python", to: "ml-research" },

  // hackathons
  { from: "langchain", to: "hackxplore" },
  { from: "rag", to: "hackxplore" },
  { from: "raai", to: "hackxplore" },
  { from: "nextjs", to: "hackxplore" },
  { from: "rag", to: "iete-ace" },

  // wecare + acm
  { from: "seo", to: "wecare" },
  { from: "react", to: "acm" },
  { from: "webfund", to: "acm" },

  // skill lineage
  { from: "react", to: "nextjs" },
  { from: "python", to: "fastapi" },
  { from: "python", to: "flask" },
  { from: "python", to: "pandas" },
  { from: "langchain", to: "rag" },
];

export type CommitType =
  | "research"
  | "feat"
  | "win"
  | "perf"
  | "mentor"
  | "community"
  | "init";

export interface Commit {
  hash: string;
  type: CommitType;
  title: string;
  dateLabel: string;
  nodeId: string;
  tags: string[];
  diff: {
    file: string;
    before: string[];
    after: string[];
  };
}

/** newest first — rendered top-down like `git log` */
export const COMMITS: Commit[] = [
  {
    hash: "57ockda5h",
    type: "feat",
    title: "feat(pipeline): real-time stock market analytics dashboard",
    dateLabel: "May 2026 — Present",
    nodeId: "stock-dash",
    tags: ["Flask", "PostgreSQL", "Pandas"],
    diff: {
      file: "market_pipeline.py",
      before: [
        "Market data arrives as raw, unstructured equity feeds",
        "Technical indicators computed manually, after the fact",
        "No persistent store for historical analysis",
      ],
      after: [
        "Real-time data pipeline fetches live market equities via Flask",
        "Pandas computes live technical indicators: MACD + RSI",
        "PostgreSQL persists series for querying & backtesting",
      ],
    },
  },
  {
    hash: "f1n6er9",
    type: "research",
    title: "research(gnn): fingerprint minutiae mapping framework",
    dateLabel: "Jan 2026 — Present",
    nodeId: "ml-research",
    tags: ["GNN", "Graph Theory", "MPSTME"],
    diff: {
      file: "minutiae_graph.py",
      before: [
        "Classical fingerprint matching treats minutiae as isolated points",
        "Spatial relationships between ridge features underexploited",
      ],
      after: [
        "Framework models minutiae as graph nodes with relational edges",
        "Graph Neural Networks learn structure for high-precision mapping",
        "Graph theory formalizes topology of ridge networks",
      ],
    },
  },
  {
    hash: "w1nhackx",
    type: "win",
    title: "win(hackathon): IEEE HackXplore — 1st place 🏆",
    dateLabel: "Nov 2025",
    nodeId: "hackxplore",
    tags: ["Multi-LLM", "RAG", "LangChain"],
    diff: {
      file: "emotional_iq_rag.py",
      before: [
        "Single-LLM systems miss nuance in emotional intelligence analysis",
        "36-hour constraint: architecture had to ship, not just demo",
      ],
      after: [
        "Engineered a multi-LLM RAG system orchestrated with LangChain",
        "Specialized models cooperate on emotional intelligence analysis",
        "Architected the full-stack interface with Next.js",
        "Result: winner, IEEE HackXplore 2025",
      ],
    },
  },
  {
    hash: "w1nace2",
    type: "win",
    title: "win(hackathon): IETE ACE 2.0 — 1st place 🏆",
    dateLabel: "Oct 2025",
    nodeId: "iete-ace",
    tags: ["Hackathon", "IETE"],
    diff: {
      file: "ace2_submission.md",
      before: [
        "Competitive field at IETE ACE 2.0",
      ],
      after: [
        "Shipped the winning build — first of two hackathon wins in two months",
      ],
    },
  },
  {
    hash: "ra9a1b2",
    type: "feat",
    title: "feat(agentic): RAAI — full-stack agentic RAG system",
    dateLabel: "Sept 2025",
    nodeId: "raai",
    tags: ["Next.js", "FastAPI", "MongoDB", "LangChain"],
    diff: {
      file: "raai/architecture.md",
      before: [
        "Complex data retrieval requires manual multi-step reasoning",
        "Naive RAG retrieves once and hopes — no agency, no iteration",
      ],
      after: [
        "Agentic RAG loop: retrieve → reason → act → refine",
        "FastAPI + LangChain agent core; MongoDB vector-backed memory",
        "Next.js/React frontend streams agent reasoning to the user",
      ],
    },
  },
  {
    hash: "9d9biz0",
    type: "community",
    title: "chore(growth): business development @ GDG MPSTME",
    dateLabel: "Aug 2025 — Present",
    nodeId: "gdg",
    tags: ["GDG", "Sponsorships", "Outreach"],
    diff: {
      file: "gdg/partnerships.md",
      before: [
        "Community events limited by sponsorship pipeline",
        "Few industry experts engaged with the chapter",
      ],
      after: [
        "Secured strategic sponsorships with local tech firms",
        "Directed outreach onboarding industry experts",
        "Expanded community reach to local hubs",
      ],
    },
  },
  {
    hash: "v0lunt33r",
    type: "community",
    title: "chore(impact): volunteer @ Genesis Worldwide Foundation",
    dateLabel: "Jun 2025 — Aug 2025",
    nodeId: "genesis",
    tags: ["Volunteering", "Logistics"],
    diff: {
      file: "genesis/camps.md",
      before: [
        "Health check-up camps needed structured logistics support",
      ],
      after: [
        "Managed camp logistics and daily administrative support",
        "Sustained a structured environment for 25+ residents",
      ],
    },
  },
  {
    hash: "5e0b00st",
    type: "perf",
    title: "perf(seo): +10% organic traffic @ WeCare Digital",
    dateLabel: "May 2025 — July 2025",
    nodeId: "wecare",
    tags: ["SEO", "Metadata", "Internship"],
    diff: {
      file: "onpage_optimization.md",
      before: [
        "On-page content & metadata unoptimized for high-priority keywords",
        "Organic acquisition underperforming; content gaps unmapped",
      ],
      after: [
        "Systematically optimized on-page content and metadata",
        "Keyword research + competitor analysis → top-10 rankings",
        "Measured outcome: +10% organic traffic within 2 months",
      ],
    },
  },
  {
    hash: "m3nt0r50",
    type: "mentor",
    title: "docs(mentorship): trained 50-student cohort @ ACM MPSTME",
    dateLabel: "July 2024 — July 2025",
    nodeId: "acm",
    tags: ["HTML5", "CSS3", "React", "Teaching"],
    diff: {
      file: "acm_cohort/syllabus.md",
      before: [
        "50 students, zero-to-some frontend experience",
      ],
      after: [
        "Designed & delivered HTML5, CSS3 and React fundamentals track",
        "Mentored the full cohort as Technical Executive",
      ],
    },
  },
  {
    hash: "a0d17ya",
    type: "init",
    title: "init: B.Tech Computer Science @ MPSTME",
    dateLabel: "Aug 2022 — Present",
    nodeId: "mpstme",
    tags: ["CS Major", "CGPA 3.65"],
    diff: {
      file: "README.md",
      before: [
        "Arya Vidya Mandir — X grade ICSE, 96 percentile",
      ],
      after: [
        "Enrolled: Mukesh Patel School of Technology Management & Engineering",
        "Computer Science major — CGPA 3.65 · Mumbai",
      ],
    },
  },
];

// ---- lookups ----
export const NODE_MAP = new Map(NODES.map((n) => [n.id, n]));
export const COMMIT_MAP = new Map(COMMITS.map((c) => [c.hash, c]));

export function neighborsOf(nodeId: string): string[] {
  const out = new Set<string>();
  for (const e of EDGES) {
    if (e.from === nodeId) out.add(e.to);
    if (e.to === nodeId) out.add(e.from);
  }
  return [...out];
}

export const NODE_COLORS: Record<NodeType, string> = {
  skill: "#38bdf8",
  project: "#34f5a4",
  experience: "#a78bfa",
  achievement: "#fbbf24",
  education: "#f472b6",
};

export const NODE_TYPE_LABEL: Record<NodeType, string> = {
  skill: "SKILL",
  project: "PROJECT",
  experience: "EXPERIENCE",
  achievement: "ACHIEVEMENT",
  education: "EDUCATION",
};
