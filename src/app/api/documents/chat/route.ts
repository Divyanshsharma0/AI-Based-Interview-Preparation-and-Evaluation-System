import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

type Chunk = { id: string; text: string };
type EmbeddedDoc = { chunks: Chunk[]; vectors?: number[][] };

const embeddingCache = new Map<string, EmbeddedDoc>();
const EMBEDDING_MODEL = process.env.DOCUMENT_EMBEDDING_MODEL || "embeddinggemma";
const CHAT_MODEL = process.env.DOCUMENT_CHAT_MODEL || "mistral";

const GREETING_RE = /^\s*(hi|hello|hey|hola|howdy|yo)\b[!.?\s]*$/i;
const GOOD_MORNING_RE = /^\s*good\s+(morning|afternoon|evening)\b[!.?\s]*$/i;

function chunkDocument(documentText: string, chunkChars = 1100, overlapChars = 160): Chunk[] {
  const text = documentText.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: Chunk[] = [];

  let current = "";
  let chunkIndex = 1;

  for (const para of paragraphs) {
    if (!current) {
      current = para;
      continue;
    }

    if (current.length + 2 + para.length <= chunkChars) {
      current = `${current}\n\n${para}`;
      continue;
    }

    chunks.push({ id: String(chunkIndex++), text: current });
    const overlap = overlapChars > 0 ? current.slice(Math.max(0, current.length - overlapChars)) : "";
    current = overlap ? `${overlap}\n\n${para}` : para;
  }

  if (current) {
    chunks.push({ id: String(chunkIndex++), text: current });
  }

  return chunks;
}

function dot(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

async function embedTexts(texts: string[]) {
  const res = await fetch("http://localhost:11434/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
      truncate: true,
    }),
  });

  const data = await res.json();
  if (!Array.isArray(data.embeddings)) {
    throw new Error("Ollama embedding response missing `embeddings`");
  }
  return data.embeddings as number[][];
}

function isGreeting(message: string) {
  return GREETING_RE.test(message) || GOOD_MORNING_RE.test(message);
}

function tokenizeQuery(query: string) {
  return (query.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length >= 3).slice(0, 30);
}

function keywordScore(tokens: string[], chunkText: string) {
  if (tokens.length === 0) return 0;
  const hay = chunkText.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += 1 + Math.min(3, token.length / 6);
  }
  return score;
}

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

    const isGreetingRequest = isGreeting(String(message));
    const retrievalQuery = isGreetingRequest
      ? "project overview goals objectives key features how it works"
      : String(message);
    const userMessage = isGreetingRequest
      ? `User greeting: "${message}". Provide a short project/document overview using ONLY the context chunks. Then ask what they want to know next.\n\nReturn format:\nOverview: <one line> [Chunk X]\nObjectives: <one line> [Chunk X]\nKey components: <one line> [Chunk X]`
      : String(message);

    const docHash = crypto.createHash("sha256").update(documentText).digest("hex");
    let cached = embeddingCache.get(docHash);

    if (!cached) {
      const chunks = chunkDocument(documentText);
      const maxChunks = 45;
      const trimmed = chunks.slice(0, maxChunks);

      const textsToEmbed = trimmed.map((c) => c.text);
      let vectors: number[][] | undefined;
      try {
        vectors = await embedTexts(textsToEmbed);
      } catch {
        vectors = undefined;
      }

      cached = { chunks: trimmed, vectors };

      embeddingCache.set(docHash, cached);
      if (embeddingCache.size > 6) embeddingCache.clear();
    }

    const topK = 6;
    let topChunks: Array<{ id: string; text: string }>;

    if (cached.vectors && cached.vectors.length === cached.chunks.length) {
      const queryVectors = await embedTexts([retrievalQuery]);
      const queryVector = queryVectors[0];

      const scored = cached.chunks.map((c, idx) => ({
        id: c.id,
        text: c.text,
        score: dot(queryVector, cached.vectors![idx]),
      }));

      scored.sort((a, b) => b.score - a.score);
      topChunks = scored.slice(0, topK);
    } else {
      const tokens = tokenizeQuery(retrievalQuery);
      const scored = cached.chunks.map((c) => ({
        id: c.id,
        text: c.text,
        score: keywordScore(tokens, c.text),
      }));

      scored.sort((a, b) => b.score - a.score);
      const slice = scored.slice(0, topK);
      topChunks = slice.every((s) => s.score === 0) ? cached.chunks.slice(0, topK) : slice;
    }

    const contextBlock = topChunks
      .map((c) => `[Chunk ${c.id}]\n${c.text}`)
      .join("\n\n---\n\n");

    const systemPrompt = isGreetingRequest
      ? `You are a document assistant. Answer the user's request using ONLY the evidence in the provided context chunks.

Rules:
1. Use ONLY the facts present in the provided chunks. Do NOT use outside knowledge.
2. If the answer is not supported by the chunks, respond with exactly: I cannot find this information in the document.
3. Produce a concise reply (target 80–140 words total).
4. Evidence: when you mention a claim, cite the chunk like [Chunk X].
5. Follow the user's requested format exactly (Overview:, Objectives:, Key components:).

Context chunks:
---
${contextBlock}
---`
      : `You are a document assistant that answers questions using RAG-style evidence.

You will be given context chunks extracted from an uploaded document.
Rules:
1. Use ONLY the facts present in the provided chunks. Do NOT use outside knowledge.
2. If the answer is not supported by the chunks, respond with exactly: I cannot find this information in the document.
3. Keep answers short by default (about 150–250 words).
4. Evidence: when you mention a claim, cite the chunk like [Chunk X]. If multiple chunks support the same claim, include multiple citations.
5. Use clear Markdown with brief bullets or short paragraphs.

Context chunks:
---
${contextBlock}
---`;

    const historySource = Array.isArray(previousMessages)
      ? (previousMessages as { role: string; content: string }[])
      : [];
    const history = historySource.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage },
    ];

    // Query Local Ollama
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: formattedMessages,
        stream: false,
        options: { num_predict: isGreetingRequest ? 170 : 210 },
      }),
    });

    const data = await response.json();
    const botReply = data.message?.content || "No response generated.";

    // Save Chat Log to local JSON file for inspection
    try {
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
