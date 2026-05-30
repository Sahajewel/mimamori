import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; medicineId: string }> },
) {
  try {
    const { id, medicineId } = await params;
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

    // ── ফাঁক বন্ধ: ওষুধটা সত্যিই এই senior-এর কিনা যাচাই ──
    // আগে শুধু medicineId দিয়ে খুঁজত — অন্য senior-এর ওষুধও আসতে পারত।
    // এখন seniorId: id-ও মেলানো হচ্ছে, তাই এই senior-এর না হলে আসবেই না।
    const medicine = await prisma.medicine.findFirst({
      where: { id: medicineId, seniorId: id },
      include: { reminders: true },
    });

    if (!medicine) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    return NextResponse.json(medicine);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; medicineId: string }> },
) {
  try {
    const { id, medicineId } = await params;
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

    // VIEWER role বদলাতে পারবে না — create route-এর সাথে মিল রেখে যোগ করলাম
    if (member.role === "VIEWER") {
      return NextResponse.json(
        { error: "閲覧者はお薬を編集できません" },
        { status: 403 },
      );
    }

    // ── ফাঁক বন্ধ: update করার আগে ওষুধটা এই senior-এর কিনা যাচাই ──
    // আগে সরাসরি medicineId দিয়ে update করত, কোনো senior-চেক ছাড়াই।
    const existing = await prisma.medicine.findFirst({
      where: { id: medicineId, seniorId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    const body = await req.json();

    const medicine = await prisma.medicine.update({
      where: { id: medicineId },
      data: {
        ...(body.active !== undefined && { active: body.active }),
        ...(body.name && { name: body.name }),
        ...(body.dosage !== undefined && { dosage: body.dosage }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Medicine PATCH failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
