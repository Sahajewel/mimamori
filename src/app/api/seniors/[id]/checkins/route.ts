import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendPushToSeniorMembers } from "@/lib/push";

const checkInSchema = z.object({
  status: z.enum(["OK", "CONCERN", "EMERGENCY"]),
  note: z.string().max(500).optional(),
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
        { error: "閲覧者はチェックインを追加できません" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const parsed = checkInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const senior = await prisma.senior.findUnique({
      where: { id },
      select: { name: true },
    });

    const checkIn = await prisma.checkIn.create({
      data: {
        seniorId: id,
        userId: session.user.id,
        status: parsed.data.status,
        note: parsed.data.note,
      },
    });

    // Push notification
    if (parsed.data.status === "EMERGENCY") {
      await sendPushToSeniorMembers(id, session.user.id, {
        title: `🚨 緊急！${senior?.name}さんの状態を確認してください`,
        body: parsed.data.note || "今すぐ確認が必要です！",
        tag: "emergency",
        requireInteraction: true,
        silent: false,
        url: `/seniors/${id}`,
      });
    } else if (parsed.data.status === "CONCERN") {
      await sendPushToSeniorMembers(id, session.user.id, {
        title: `⚠️ ${senior?.name}さんの様子を確認してください`,
        body: parsed.data.note || "少し気になることがあります",
        tag: "concern",
        requireInteraction: false,
        silent: false,
      });
    }

    return NextResponse.json(checkIn, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
