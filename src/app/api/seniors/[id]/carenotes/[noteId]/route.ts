import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const { id, noteId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const note = await prisma.careNote.findFirst({
      where: { id: noteId, seniorId: id }, // ← seniorId যোগ
    });

    if (!note) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    if (note.userId !== session.user.id) {
      return NextResponse.json({ error: "削除できません" }, { status: 403 });
    }

    await prisma.careNote.delete({ where: { id: noteId } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> },
) {
  try {
    const { id, noteId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const note = await prisma.careNote.findFirst({
      where: { id: noteId, seniorId: id }, // ← seniorId যোগ
    });

    if (!note) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    if (note.userId !== session.user.id) {
      return NextResponse.json({ error: "編集できません" }, { status: 403 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "内容を入力してください" },
        { status: 400 },
      );
    }

    const updated = await prisma.careNote.update({
      where: { id: noteId },
      data: { content: content.trim() },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
