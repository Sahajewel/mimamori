import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushToSeniorMembers } from "@/lib/push";
export async function GET(
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

    const messages = await prisma.message.findMany({
      where: { seniorId: id },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: {
        user: { select: { name: true, id: true } },
      },
    });
    const processedMessages = messages.map((msg) => ({
      ...msg,
      content: msg.deletedAt ? "" : msg.content,
      imageUrl: msg.deletedAt ? null : msg.imageUrl,
      deleted: !!msg.deletedAt,
    }));

    return NextResponse.json(processedMessages);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

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

    const { content, imageUrl } = await req.json();

    if (!content?.trim() && !imageUrl) {
      return NextResponse.json(
        { error: "メッセージを入力してください" },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        seniorId: id,
        userId: session.user.id,
        content: content?.trim() || "",
        imageUrl: imageUrl || null,
      },
      include: {
        user: { select: { name: true, id: true } },
        senior: { select: { name: true } },
      },
    });

    // Notification পাঠাও
    await sendPushToSeniorMembers(id, session.user.id, {
      title: `💬 ${message.user.name}さんからメッセージ`,
      body: message.imageUrl
        ? "📷 写真を送りました"
        : message.content.slice(0, 50),
      tag: "chat-message",
      requireInteraction: false,
      silent: false,
      url: `/seniors/${id}/chat`,
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

// message create-এর পরে:
