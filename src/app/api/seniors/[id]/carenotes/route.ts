import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const careNoteSchema = z.object({
  content: z.string().min(1, "内容を入力してください").max(1000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const member = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: session.user.id },
    });
    if (!member) {
      return NextResponse.json(
        { error: "アクセス権限がありません" },
        { status: 403 },
      );
    }
    if (member.role === "VIEWER") {
      return NextResponse.json(
        { error: "閲覧者はノートを追加できません" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const parsed = careNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const careNote = await prisma.careNote.create({
      data: {
        seniorId: id,
        userId: session.user.id,
        authorName: session.user.name,
        content: parsed.data.content,
      },
    });

    return NextResponse.json(careNote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
