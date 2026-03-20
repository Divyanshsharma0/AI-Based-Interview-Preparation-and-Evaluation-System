import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { documentText, role, company } = await request.json();

    if (!documentText) {
      return NextResponse.json({ error: "No document text provided" }, { status: 400 });
    }

    const systemPrompt = `You are a senior technical recruiter and hiring manager. Give a DEEP, SPECIFIC analysis of this resume—not generic career advice. Ground every point in what actually appears in the resume text (companies, titles, dates, technologies, metrics). If the resume is thin in an area, say so explicitly.

Target role the candidate is aiming for: ${role || "not specified—infer reasonable seniority from experience"}
Target company context: ${company || "not specified—use general strong-employer standards"}

Resume text:
---
${documentText}
---

Return STRICTLY valid JSON (no markdown fences) matching this schema. Be thorough: prefer concrete detail over buzzwords.

{
  "summary": "3–5 sentences: career arc, seniority level, domains, and explicit fit (or misfit) for the target role/company. Mention 2–3 concrete facts from the resume (employers, stack, outcomes).",
  "strengths": [
    "Each item: 2–4 sentences. Name the evidence (role, project, or metric from the resume) and why it matters to employers.",
    "At least 3 items if the resume has enough content; fewer only if the resume is very short."
  ],
  "skills": [
    "8–20 specific items when possible: languages, frameworks, tools, cloud, data, leadership scope—not vague soft skills unless clearly evidenced."
  ],
  "missingSkills": [
    "Each item: name the gap AND one sentence on why it matters for the target role or company type. Skip generic filler."
  ],
  "suggestions": [
    "6–10 actionable edits: weak bullet → stronger rewrite, missing metrics, ordering/ATS, keyword alignment to target role. Each suggestion should be 2–3 sentences and reference actual resume content where possible."
  ],
  "formattingAndAts": [
    "3–6 bullets on layout, parsing, section order, file hygiene, or keyword density—specific to THIS resume."
  ],
  "questions": [
    "6–10 behavioral or technical mock questions an interviewer would ask based on claims in THIS resume. Each should reference a specific employer, project, or skill from the text (e.g. 'You list X at Y—how did you measure success?')."
  ]
}`;

    // Query Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: systemPrompt,
        stream: false,
        format: "json",
      }),
    });

    const data = await response.json();
    const raw = typeof data.response === "string" ? data.response.trim() : "{}";
    let result: Record<string, unknown> = {};
    try {
      result = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          result = JSON.parse(raw.slice(start, end + 1));
        } catch {
          result = {};
        }
      }
    }

    const asStrings = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

    return NextResponse.json({
      success: true,
      summary: typeof result.summary === "string" ? result.summary : "",
      strengths: asStrings(result.strengths),
      skills: asStrings(result.skills),
      missingSkills: asStrings(result.missingSkills),
      suggestions: asStrings(result.suggestions),
      formattingAndAts: asStrings(result.formattingAndAts),
      questions: asStrings(result.questions),
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume with local AI." },
      { status: 500 }
    );
  }
}
