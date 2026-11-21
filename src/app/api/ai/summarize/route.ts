import { careNotesSummaryPrompt } from "@/lib/ai/prompts";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
export async function POST(req: NextRequest) {
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
  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt: careNotesSummaryPrompt(notesText, senior.name),
    onFinish: async ({ text }) => {
      await prisma.aiSummary.create({
        data: { seniorId, type, content: text },
      });
    },
  });
  return result.toUIMessageStreamResponse();
}
