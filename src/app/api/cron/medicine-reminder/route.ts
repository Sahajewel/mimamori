import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToSeniorMembers } from "@/lib/push";

const TIMING_MAP: Record<string, { start: number; end: number }> = {
  朝食後: { start: 7, end: 12 },
  朝食前: { start: 6, end: 9 },
  昼食後: { start: 11, end: 16 },
  昼食前: { start: 10, end: 13 },
  夕食後: { start: 17, end: 22 },
  夕食前: { start: 16, end: 19 },
  就寝前: { start: 20, end: 24 },
  食間: { start: 10, end: 14 },
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const japanTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const hour = japanTime.getHours();
  const today = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  today.setHours(0, 0, 0, 0);

  const activeTimings = Object.entries(TIMING_MAP)
    .filter(([, { start, end }]) => hour >= start + 1 && hour <= end)
    .map(([time]) => time);

  if (activeTimings.length === 0) {
    return NextResponse.json({ message: "No active timings" });
  }

  const reminders = await prisma.medicineReminder.findMany({
    where: {
      time: { in: activeTimings },
      medicine: { active: true },
    },
    include: {
      medicine: {
        include: {
          senior: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  let notificationCount = 0;

  for (const reminder of reminders) {
    const log = await prisma.medicineLog.findFirst({
      where: {
        reminderId: reminder.id,
        createdAt: { gte: today },
      },
    });

    if (!log) {
      const senior = reminder.medicine.senior;
      const ownerMember = senior.members.find((m) => m.role === "OWNER");

      if (ownerMember) {
        await sendPushToSeniorMembers(senior.id, ownerMember.userId, {
          title: `💊 ${senior.name}さんのお薬を確認してください`,
          body: `${reminder.time}の${reminder.medicine.name}がまだ記録されていません`,
          tag: "medicine-reminder",
          requireInteraction: false,
          silent: false,
          url: `/seniors/${senior.id}`,
        });
        notificationCount++;
      }
    }
  }

  // Medicine refill check
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const expiringMedicines = await prisma.medicine.findMany({
    where: {
      active: true,
      ongoing: false,
      endDate: {
        gte: today,
        lte: threeDaysLater,
      },
    },
    include: {
      senior: {
        include: {
          members: true,
        },
      },
    },
  });

  for (const medicine of expiringMedicines) {
    const senior = medicine.senior;
    const ownerMember = senior.members.find((m) => m.role === "OWNER");

    if (ownerMember) {
      const daysLeft = Math.ceil(
        (new Date(medicine.endDate!).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      await sendPushToSeniorMembers(senior.id, ownerMember.userId, {
        title: `💊 ${senior.name}さんの薬が残り${daysLeft}日です`,
        body: `${medicine.name}をそろそろ薬局で購入してください`,
        tag: "medicine-refill",
        requireInteraction: false,
        silent: false,
        url: `/seniors/${senior.id}`,
      });
    }
  }

  return NextResponse.json({
    success: true,
    notificationCount,
    activeTimings,
  });
}
