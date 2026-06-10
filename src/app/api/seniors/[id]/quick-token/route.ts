import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
      where: {
        seniorId: id,
        userId: session.user.id,
        role: "OWNER",
      },
    });
    if (!member) {
      return NextResponse.json(
        { error: "オーナーのみ操作できます" },
        { status: 403 },
      );
    }
    // senior-এর এখনকার token দেখো
    const senior = await prisma.senior.findUnique({
      where: { id },
      select: { quickToken: true },
    });
    let quickToken = senior?.quickToken;

    if (!quickToken) {
      quickToken = crypto.randomBytes(16).toString("hex");
      await prisma.senior.update({
        where: { id },
        data: { quickToken },
      });
    }

    return NextResponse.json({
      quickToken,
      quickUrl: `${process.env.NEXTAUTH_URL}/quick/${quickToken}`,
    });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
