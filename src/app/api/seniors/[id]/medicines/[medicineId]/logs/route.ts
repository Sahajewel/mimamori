import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { japanDayStart, startOfJapanToday } from "@/lib/japanTime";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; medicineId: string }> },
) {
  try {
    const { id, medicineId } = await params;

    // ── ফাঁক বন্ধ ৩: GET-এ আগে কোনো auth/member চেকই ছিল না! ──
    // যে কেউ medicineId জানলেই পুরো history দেখে ফেলতে পারত।
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

    // ── medicine এই senior-এর কিনা যাচাই (findUnique → findFirst) ──
    const medicine = await prisma.medicine.findFirst({
      where: { id: medicineId, seniorId: id },
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

    // Start date থেকে আজ পর্যন্ত প্রতিদিন generate করো

    // ... medicine আনার পর:

    const todayStart = startOfJapanToday(); // আজকের Japan 00:00 (UTC instant)
    const startDay = japanDayStart(new Date(medicine.startDate));
    const endRaw = medicine.endDate
      ? japanDayStart(new Date(medicine.endDate))
      : todayStart;
    const finalEnd =
      endRaw.getTime() > todayStart.getTime() ? todayStart : endRaw;

    const allRecords = [];

    // instant দিয়ে দিন গুনি — প্রতিদিন ঠিক 24h যোগ (নিরাপদ)
    const DAY_MS = 24 * 60 * 60 * 1000;
    for (let t = startDay.getTime(); t <= finalEnd.getTime(); t += DAY_MS) {
      const dayStart = new Date(t); // এই দিনের Japan 00:00 (UTC instant)

      for (const reminder of medicine.reminders) {
        const log = medicine.logs.find((l) => {
          const logDay = japanDayStart(new Date(l.createdAt));
          return (
            logDay.getTime() === dayStart.getTime() &&
            l.reminderId === reminder.id
          );
        });

        allRecords.push({
          id: log?.id || `${dayStart.toISOString()}-${reminder.id}`,
          date: dayStart,
          reminderId: reminder.id,
          reminderTime: reminder.time,
          status: log?.status || "NONE",
          note: log?.note || null,
          createdAt: log?.createdAt || dayStart.toISOString(),
          userName: log?.authorName || log?.user?.name || null,
        });
      }
    }

    allRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(allRecords);
  } catch (error) {
    console.error("MedicineLog GET failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
