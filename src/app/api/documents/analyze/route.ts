import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { documentText, role, company } = await request.json();

    if (!documentText) {
      return NextResponse.json({ error: "No document text provided" }, { status: 400 });
    }

    const systemPrompt = `You are an expert HR and Technical Interviewer. Analyze the following resume.
    Target Role: ${role || "General Software Engineer"}
    Target Company: ${company || "General"}

    Resume Text:
    ---
    ${documentText}
    ---

    Provide your analysis STRICTLY in JSON format matching this schema:
    {
      "skills": ["extracted skill 1", "extracted skill 2"],
      "missingSkills": ["skill suggested for the target role", "another suggested skill"],
      "suggestions": ["specific improvement suggestion 1", "industry tip 2"],
      "questions": ["mock interview question 1", "mock interview question 2"]
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
    const result = JSON.parse(data.response);

    return NextResponse.json({
      success: true,
      skills: result.skills || [],
      missingSkills: result.missingSkills || [],
      suggestions: result.suggestions || [],
      questions: result.questions || [],
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume with local AI." },
      { status: 500 }
    );
  }
}
