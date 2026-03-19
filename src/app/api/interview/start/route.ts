export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPrisma } from "../../../../lib/prisma";
import { generateQuestions } from "../../../../lib/ai/ollama";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, company, difficulty, interviewType, questionCount } = body;

    if (!role || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields (role, difficulty)" },
        { status: 400 }
      );
    }

    // 1. Create the Interview setup in DB
    const interview = await getPrisma().interview.create({
      data: {
        role,
        company: company || "General",
        difficulty,
        interviewType: interviewType || "Technical",
        questionCount: questionCount || 5,
      },
    });

    // 2. Generate Initial Questions via local Ollama
    const questionTexts = await generateQuestions(
      role,
      company || "General",
      difficulty,
      questionCount || 5
    );

    // 3. Save Questions connected to Interview
    const createdQuestions = await Promise.all(
      questionTexts.map((text) =>
        getPrisma().question.create({
          data: {
            interviewId: interview.id,
            text,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      interviewId: interview.id,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to initialize interview" },
      { status: 500 }
    );
  }
}
