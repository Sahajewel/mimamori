import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const senior = await prisma.senior.findUnique({
      where: { quickToken: token },
      include: {
        medicines: {
          where: { active: true },
          include: { reminders: true },
        },
        checkIns: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!senior) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    // 今日のログ
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = await prisma.medicineLog.findMany({
      where: {
        medicine: { seniorId: senior.id },
        createdAt: { gte: today },
      },
      select: {
        reminderId: true,
        status: true,
      },
    });

    // 今日のcheckin
    const todayCheckIn = await prisma.checkIn.findFirst({
      where: {
        seniorId: senior.id,
        createdAt: { gte: today },
      },
      select: { status: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      name: senior.name,
      medicines: senior.medicines,
      lastCheckIn: senior.checkIns[0] || null,
      todayLogs,
      todayCheckIn,
    });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
