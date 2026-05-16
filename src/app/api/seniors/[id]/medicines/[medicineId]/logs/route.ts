import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const logSchema = z.object({
  reminderId: z.string(),
  status: z.enum(["TAKEN", "MISSED", "SKIPPED"]),
  note: z.string().max(200).optional(),
});

export async function POST(
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

    const body = await req.json();
    const parsed = logSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const log = await prisma.medicineLog.create({
      data: {
        medicineId,
        reminderId: parsed.data.reminderId,
        userId: session.user.id,
        status: parsed.data.status,
        note: parsed.data.note,
        takenAt: parsed.data.status === "TAKEN" ? new Date() : null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

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

    const logs = await prisma.medicineLog.findMany({
      where: { medicineId },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        user: { select: { name: true } },
        reminder: { select: { time: true } },
      },
    });

    return NextResponse.json(logs);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
