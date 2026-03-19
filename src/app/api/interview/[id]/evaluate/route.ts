export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPrisma } from "../../../../../lib/prisma";
import { evaluateAnswer } from "../../../../../lib/ai/ollama";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    

    if (!id) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // 1. Fetch the Interview and its questions
    const interview = await getPrisma().interview.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    let totalScore = 0;
    let answeredCount = 0;

    // 2. Evaluate each question with an answer using Ollama
    for (const question of interview.questions) {
      if (question.userAnswer && question.userAnswer.trim().length > 0) {
        try {
          const evalResult = await evaluateAnswer(question.text, question.userAnswer);
          
          await getPrisma().question.update({
            where: { id: question.id },
            data: {
              score: evalResult.score,
              feedback: evalResult.feedback,
            },
          });

          totalScore += evalResult.score;
          answeredCount++;
        } catch (evalErr) {
          console.error(`Evaluation failed for question ${question.id}`, evalErr);
          // Continue to next question if one fails
        }
      }
    }

    const overallScore = answeredCount > 0 ? totalScore / answeredCount : 0;
    const overallFeedback = answeredCount > 0 
      ? `Successfully evaluated ${answeredCount} responses. Average score is ${overallScore.toFixed(1)}/100.` 
      : "No responses were provided to evaluate.";

    // 3. Update Interview with aggregated results
    await getPrisma().interview.update({
      where: { id },
      data: {
        overallScore,
        overallFeedback,
      },
    });

    return NextResponse.json({
      success: true,
      overallScore,
      overallFeedback,
    });
  } catch (error) {
    console.error("Error evaluating interview:", error);
    return NextResponse.json(
      { error: "Failed to evaluate interview" },
      { status: 500 }
    );
  }
}
