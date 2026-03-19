import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { message, documentText, previousMessages } = await request.json();

    if (!documentText) {
      return NextResponse.json(
        { error: "No document text provided for Q&A" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a helpful AI Document Assistant. Below is the text content of the uploaded document:
    
---
${documentText}
---

Your task is to answer user questions strictly based ONLY on the document text provided above.
1. **Greetings**: If the user sends a simple greeting (like "hi", "hello"), respond with a friendly greeting and ask how you can help them analyze the document. **Do not summarize the document** unless explicitly asked.
2. **References**: Include short direct quotes or citations from the text (e.g., "According to the document: '...'") where applicable to back up your answers.
3. **Accuracy**: If an answer cannot be found in the text or inferred safely, strictly answer with: "I cannot find this information in the document."
4. **Formating**: Use clean Markdown (bullet points, bolding) for easy reading.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...(previousMessages || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Query Local Ollama
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        messages: formattedMessages,
        stream: false,
      }),
    });

    const data = await response.json();
    const botReply = data.message?.content || "No response generated.";

    // Save Chat Log to local JSON file for inspection
    try {
      const fs = require("fs");
      const path = require("path");
      const logPath = path.resolve(process.cwd(), "document_chat_logs.json");
      
      let logs = [];
      if (fs.existsSync(logPath)) {
        const fileContent = fs.readFileSync(logPath, "utf-8");
        if (fileContent.trim()) {
          logs = JSON.parse(fileContent);
        }
      }
      
      logs.push({
        timestamp: new Date().toLocaleString(),
        question: message,
        answer: botReply,
      });

      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
    } catch (logErr) {
      console.error("Failed to save chat log:", logErr);
    }

    return NextResponse.json({
      success: true,
      content: botReply,
    });
  } catch (error) {
    console.error("Error in document chat:", error);
    return NextResponse.json(
      { error: "Failed to query the document using local AI." },
      { status: 500 }
    );
  }
}
