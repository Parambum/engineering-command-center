import { NextResponse } from "next/server";
import { NODES, COMMITS, PROFILE } from "@/lib/data";

// ---------------------------------------------------------------------------
// Optional live-LLM uplink for the terminal (enabled via `/llm on`).
// Requires GROQ_API_KEY in .env.local — without it the endpoint returns 503
// and the client falls back to the local intent router.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are AGENT-ADITYA v1.0, a terminal-style AI agent embedded in the portfolio site of ${PROFILE.name}.
Answer visitor questions about Aditya using ONLY the facts below. Never invent achievements, metrics, employers or dates. If asked something you don't know, say so and suggest /help.
Style: terse terminal output. Prefix system remarks with [sys] and your own voice with [agent]. Max ~10 short lines. No markdown headers.

PROFILE:
- ${PROFILE.name} — ${PROFILE.role}
- Email ${PROFILE.email} · GitHub ${PROFILE.github} · LinkedIn ${PROFILE.linkedin}
- ${PROFILE.education.school}, ${PROFILE.education.program}, CGPA ${PROFILE.education.cgpa}

NODES:
${NODES.map((n) => `- [${n.type}] ${n.label}: ${n.details.join("; ")}`).join("\n")}

TIMELINE:
${COMMITS.map((c) => `- ${c.dateLabel}: ${c.title}`).join("\n")}`;

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "LLM uplink not configured (missing GROQ_API_KEY)" },
      { status: 503 },
    );
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = String(body.prompt ?? "").slice(0, 500);
    if (!prompt.trim()) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `upstream ${res.status}`, detail: detail.slice(0, 200) },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content ?? "[agent] …no response.";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "uplink failed" }, { status: 502 });
  }
}
