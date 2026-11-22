/* eslint-disable @typescript-eslint/no-explicit-any */
import { careNotesSummaryPrompt } from "@/lib/ai/prompts";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { seniorId, type } = await req.json();
    if (type !== "care-notes")
      return NextResponse.json({ error: "Unsupported type" }, { status: 400 });

    const senior = await prisma.senior.findFirst({
      where: {
        id: seniorId,
        members: {
          some: { userId: session.user.id, role: { in: ["OWNER", "EDITOR"] } },
        },
      },
    });
    if (!senior)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rangeEnd = new Date();
    const rangeStart = new Date(rangeEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    const notes = await prisma.careNote.findMany({
      where: { seniorId, createdAt: { gte: rangeStart, lte: rangeEnd } },
      orderBy: { createdAt: "desc" },
      select: { content: true, createdAt: true, authorName: true },
    });

    if (notes.length === 0) {
      return NextResponse.json(
        { error: "No care notes in this period" },
        { status: 400 },
      );
    }

    const notesText = notes
      .map((n) => `[${n.createdAt.toISOString().slice(0, 10)}] ${n.content}`)
      .join("\n");

    // 👇 streamText ব্যবহার করছি
    const result = streamText({
      model: google("gemini-flash-latest"),
      prompt: careNotesSummaryPrompt(notesText, senior.name),
      onError({ error }) {
        console.error("AI Stream Error:", error);
      },
      // 👇 টেক্সট পুরো তৈরি হওয়ার পর ডেটাবেসে সেভ হবে
      onFinish: async ({ text }) => {
        await prisma.aiSummary.create({
          data: {
            seniorId,
            type,
            rangeStart,
            rangeEnd,
            content: text, // 👈 এখানে সম্পূর্ণ তৈরি হওয়া string টেক্সট যাচ্ছে
            status: "draft",
          },
        });
      },
    });

    // 👇 স্ট্রিম রেসপন্স হিসেবে রিটার্ন করছি
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 },
    );
  }
}
