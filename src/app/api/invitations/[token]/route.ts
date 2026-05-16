import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { senior: { select: { name: true } } },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "招待リンクが見つかりません" },
        { status: 404 },
      );
    }

    if (invitation.accepted) {
      return NextResponse.json(
        { error: "この招待はすでに使用されています" },
        { status: 409 },
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "招待リンクの有効期限が切れています" },
        { status: 410 },
      );
    }

    // already member check
    const existingMember = await prisma.seniorMember.findFirst({
      where: {
        seniorId: invitation.seniorId,
        userId: session.user.id,
      },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "すでにメンバーです" },
        { status: 409 },
      );
    }

    // SeniorMember + invitation update
    await prisma.$transaction([
      prisma.seniorMember.create({
        data: {
          seniorId: invitation.seniorId,
          userId: session.user.id,
          role: invitation.role,
        },
      }),
      prisma.invitation.update({
        where: { token },
        data: { accepted: true },
      }),
    ]);

    return NextResponse.json({
      message: "参加しました",
      seniorId: invitation.seniorId,
      seniorName: invitation.senior.name,
    });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
