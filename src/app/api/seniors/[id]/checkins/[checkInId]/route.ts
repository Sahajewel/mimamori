import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> },
) {
  try {
    const { id, checkInId } = await params;
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

    // ── ফাঁক বন্ধ ১: VIEWER মুছতে পারবে না ──
    // POST-এ VIEWER আটকানো ছিল, কিন্তু DELETE-এ ছিল না।
    if (member.role === "VIEWER") {
      return NextResponse.json(
        { error: "閲覧者は削除できません" },
        { status: 403 },
      );
    }

    // ── ফাঁক বন্ধ ২: checkin সত্যিই এই senior-এর কিনা যাচাই (IDOR) ──
    // আগে সরাসরি checkInId দিয়ে delete করত — অন্য senior-এর checkin-ও
    // মুছে ফেলা যেত। এখন seniorId-ও মেলাচ্ছি।
    const existing = await prisma.checkIn.findFirst({
      where: { id: checkInId, seniorId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    await prisma.checkIn.delete({
      where: { id: checkInId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CheckIn DELETE failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
