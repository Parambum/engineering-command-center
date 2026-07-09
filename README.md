# The Engineering Command Center

Interactive single-page portfolio of **Aditya Parameswar** — built as a live developer dashboard instead of a static resume.

## Features

- **🖥️ Agentic OS Terminal** — `Agent-Aditya v1.0` answers slash commands (`/help`, `/projects`, `/wins`, `/trace raai`…) and natural language via a client-side intent router. Toggle `/llm on` to route free-text through a Groq-backed API route.
- **🕸️ Interactive Knowledge Graph** — an HTML5 canvas network of skills, experience, projects and achievements. Click a node to highlight its dependency subgraph and fire a *trace execution* animation — light packets travel down the connecting edges.
- **📜 Git-Commit Timeline** — career milestones rendered as a `git log`. Each commit expands into a code-diff: red `-` lines for the challenge, green `+` lines for the solution.

All three panels are wired through a single React context event bus — clicking anything anywhere updates everything else.

## Stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · canvas-confetti

## Run locally

```bash
npm install
npm run dev
```

Optional: copy `.env.example` to `.env.local` and add a `GROQ_API_KEY` to enable the live LLM uplink. The site is fully functional without it.

## Edit the content

Everything — profile, graph nodes/edges, timeline commits — lives in [`lib/data.ts`](lib/data.ts). Edit one file, the whole dashboard updates.
