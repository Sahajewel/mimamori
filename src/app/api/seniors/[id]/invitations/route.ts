// invite korar route
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const inviteSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  role: z.enum(["EDITOR", "VIEWER"]).default("EDITOR"),
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

    // OWNER check — শুধু OWNER invite করতে পারবে
    const member = await prisma.seniorMember.findFirst({
      where: {
        seniorId: id,
        userId: session.user.id,
        role: "OWNER",
      },
    });
    if (!member) {
      return NextResponse.json(
        { error: "招待できるのはオーナーのみです" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const parsed = inviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, role } = parsed.data;

    // ── নিয়ম ১: email-টা database-এ থাকতে হবে (existing, verified user) ──
    // অজানা email-এ invite করা যাবে না।
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスのアカウントが見つかりません" },
        { status: 404 },
      );
    }

    // already member check
    const existingMember = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: existingUser.id },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "すでにメンバーです" },
        { status: 409 },
      );
    }

    // token generate
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7日後

    // আগের একই senior+email-এর invitation মুছে, তারপর নতুন তৈরি (transaction)
    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: { seniorId: id, email },
      }),
      prisma.invitation.create({
        data: {
          seniorId: id,
          invitedBy: session.user.id,
          email,
          token,
          role,
          expiresAt,
        },
      }),
    ]);

    const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${token}`;

    return NextResponse.json(
      {
        message: "招待リンクを作成しました",
        inviteUrl,
        expiresAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Invite POST failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
