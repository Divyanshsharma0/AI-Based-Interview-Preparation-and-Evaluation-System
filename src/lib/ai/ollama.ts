const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "mistral";

interface OllamaResponse {
  response: string;
}

export async function generateQuestions(
  role: string,
  company: string,
  difficulty: string,
  count: number = 5
): Promise<string[]> {
  const prompt = `You are an expert interviewer for ${company} hiring for a ${role} position.
Generate ${count} highly relevant interview questions suitable for a ${difficulty} difficulty level.
Return your response as a JSON object with a "questions" key containing a list of strings (the questions).
Do NOT include any extra text, only valid JSON.`;

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: prompt,
        stream: false,
        format: "json", // Forces JSON output
      }),
    });

    if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
    const data: OllamaResponse = await res.json();
    const parsed = JSON.parse(data.response);
    return parsed.questions || [];
  } catch (error) {
    console.error("Error generating questions with Ollama:", error);
    // Fallback static questions just in case offline fails during testing
    return [
      `Tell us about yourself and your experience with ${role}.`,
      `What is your approach to solving complex problems?`,
      `Describe a challenging project you worked on.`,
      `How do you keep up with industry trends?`,
      `Why do you want to join ${company}?`,
    ];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> {
  const prompt = `You are an interviewer evaluating an candidate's answer.
Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer. Provide:
1. A score between 1 and 100.
2. Actionable constructive feedback.

Return your response as JSON with keys "score" (number) and "feedback" (string).`;

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: prompt,
        stream: false,
        format: "json",
      }),
    });

    if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
    const data: OllamaResponse = await res.json();
    return JSON.parse(data.response);
  } catch (error) {
    console.error("Error evaluating with Ollama:", error);
    return {
      score: 0,
      feedback: "Failed to connect to local AI for evaluation. Please ensure Ollama is running.",
    };
  }
}
