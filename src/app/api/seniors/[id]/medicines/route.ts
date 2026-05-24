import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const medicineSchema = z.object({
  name: z.string().min(1, "お薬の名前を入力してください").max(100),
  dosage: z.string().max(50).optional(),
  frequency: z.string().min(1, "服用頻度を入力してください").max(100),
  times: z.array(z.string()).min(1, "服用タイミングを選択してください"),
  ongoing: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  duration: z.number().optional(),
  notes: z.string().max(500).optional(),
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
        { error: "閲覧者はお薬を追加できません" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const parsed = medicineSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      name,
      dosage,
      frequency,
      times,
      ongoing,
      startDate,
      endDate,
      duration,
      notes,
    } = parsed.data;

    const medicine = await prisma.medicine.create({
      data: {
        seniorId: id,
        name,
        dosage,
        frequency,
        ongoing,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        duration,
        notes,
        active: true,
        reminders: {
          create: times.map((time) => ({ time })),
        },
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
