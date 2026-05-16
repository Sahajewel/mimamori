import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const medicineSchema = z.object({
  name: z.string().min(1, "お薬の名前を入力してください").max(100),
  dosage: z.string().max(50).optional(),
  frequency: z.string().min(1, "服用頻度を入力してください").max(100),
  time: z.string().min(1, "服用時間を入力してください"),
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

    const body = await req.json();
    const parsed = medicineSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        seniorId: id,
        name: parsed.data.name,
        dosage: parsed.data.dosage,
        frequency: parsed.data.frequency,
        active: true,
        reminders: {
          create: {
            time: parsed.data.time,
          },
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
