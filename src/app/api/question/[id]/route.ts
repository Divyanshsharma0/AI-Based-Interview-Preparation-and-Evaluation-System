export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPrisma } from "../../../../lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userAnswer } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Update the question with the user's answer
    const updatedQuestion = await getPrisma().question.update({
      where: { id },
      data: {
        userAnswer: userAnswer || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Answer saved",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error saving answer:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
