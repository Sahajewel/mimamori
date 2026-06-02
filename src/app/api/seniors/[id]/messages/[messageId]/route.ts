import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  try {
    const { id, messageId } = await params; // ← id-ও নাও
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    // member চেক — এই senior-এর member কিনা
    const member = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: session.user.id },
    });
    if (!member) {
      return NextResponse.json(
        { error: "アクセス権限がありません" },
        { status: 403 },
      );
    }

    // IDOR fix — message এই senior-এর কিনা মেলাও (findUnique → findFirst)
    const message = await prisma.message.findFirst({
      where: { id: messageId, seniorId: id },
    });
    if (!message) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    // ownership — শুধু নিজের message edit করা যাবে
    if (message.userId !== session.user.id) {
      return NextResponse.json({ error: "編集できません" }, { status: 403 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "メッセージを入力してください" },
        { status: 400 },
      );
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { content: content.trim(), editedAt: new Date() },
      include: { user: { select: { name: true, id: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Message PATCH failed:", error); // ← যোগ
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  try {
    const { id, messageId } = await params; // ← id-ও নাও
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

    const message = await prisma.message.findFirst({
      where: { id: messageId, seniorId: id }, // IDOR fix
    });
    if (!message) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    if (message.userId !== session.user.id) {
      return NextResponse.json({ error: "削除できません" }, { status: 403 });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message DELETE failed:", error); // ← যোগ
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
