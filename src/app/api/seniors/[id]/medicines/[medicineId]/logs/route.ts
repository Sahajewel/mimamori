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
    const { medicineId } = await params;

    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
      include: {
        reminders: true,
        logs: {
          include: {
            user: { select: { name: true } },
            reminder: { select: { time: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!medicine) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    // Start date থেকে আজまで প্রতিদিন generate করো
    const start = new Date(medicine.startDate);
    const end = medicine.endDate ? new Date(medicine.endDate) : new Date();

    // Japan time
    const todayJapan = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    todayJapan.setHours(0, 0, 0, 0);

    const finalEnd = end > todayJapan ? todayJapan : end;

    const allRecords = [];

    // প্রতিদিন loop
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    while (current <= finalEnd) {
      for (const reminder of medicine.reminders) {
        // এই দিনে এই reminder-এর log আছে কিনা
        const log = medicine.logs.find((l) => {
          const logDate = new Date(
            new Date(l.createdAt).toLocaleString("en-US", {
              timeZone: "Asia/Tokyo",
            }),
          );
          logDate.setHours(0, 0, 0, 0);
          return (
            logDate.getTime() === current.getTime() &&
            l.reminderId === reminder.id
          );
        });

        allRecords.push({
          id: log?.id || `${current.toISOString()}-${reminder.id}`,
          date: new Date(current),
          reminderId: reminder.id,
          reminderTime: reminder.time,
          status: log?.status || "NONE",
          note: log?.note || null,
          createdAt: log?.createdAt || current.toISOString(),
          userName: log?.user?.name || null,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    // 新しい順に並び替え
    allRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(allRecords);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
