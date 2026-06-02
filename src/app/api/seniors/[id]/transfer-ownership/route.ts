import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// কাকে OWNER বানানো হবে, তার userId
const transferSchema = z.object({
  newOwnerId: z.string().min(1),
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

    // ── শুধু বর্তমান OWNER transfer করতে পারবে ──
    const me = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: session.user.id, role: "OWNER" },
    });
    if (!me) {
      return NextResponse.json(
        { error: "オーナーのみ譲渡できます" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const parsed = transferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { newOwnerId } = parsed.data;

    // ── নিজেকে নিজে দেওয়া যাবে না ──
    if (newOwnerId === session.user.id) {
      return NextResponse.json(
        { error: "すでにオーナーです" },
        { status: 400 },
      );
    }

    // ── যাকে দিচ্ছি, সে কি সত্যিই এই senior-এর member? (IDOR যাচাই) ──
    // অন্য senior-এর কাউকে, বা যে member না — তাকে OWNER বানানো যাবে না।
    const newOwnerMember = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: newOwnerId },
    });
    if (!newOwnerMember) {
      return NextResponse.json(
        { error: "対象のメンバーが見つかりません" },
        { status: 404 },
      );
    }

    // ── transfer: নতুন জন OWNER, আমি EDITOR — একসাথে (transaction) ──
    // দুটোই হবে, নয় কোনোটাই না। একজনই OWNER থাকবে সবসময়।
    await prisma.$transaction([
      prisma.seniorMember.update({
        where: { id: newOwnerMember.id },
        data: { role: "OWNER" },
      }),
      prisma.seniorMember.update({
        where: { id: me.id },
        data: { role: "EDITOR" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "オーナー権限を譲渡しました",
    });
  } catch (error) {
    console.error("Ownership transfer failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
