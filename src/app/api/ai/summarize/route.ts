/* eslint-disable @typescript-eslint/no-explicit-any */
import { careNotesSummaryPrompt } from "@/lib/ai/prompts";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai"; // 👈 streamText এর জায়গায় generateText
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export const maxDuration = 30; // 👈 Vercel টাইমআউট ফিক্স

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

    // 👇 এখানে generateText ব্যবহার করছি
    const { text } = await generateText({
      model: google("gemini-flash-latest"),
      prompt: careNotesSummaryPrompt(notesText, senior.name),
    });

    // ডেটাবেসে সেভ
    await prisma.aiSummary.create({
      data: {
        seniorId,
        type,
        rangeStart,
        rangeEnd,
        content: text,
        status: "draft",
      },
    });

    // সরাসরি টেক্সট রেসপন্স পাঠাচ্ছি
    return new NextResponse(text, { status: 200 });
  } catch (error: any) {
    console.error("AI Route Error:", error); // Vercel লগে দেখতে পাবি
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 },
    );
  }
}
