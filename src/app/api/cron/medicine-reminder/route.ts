import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToSeniorMembers } from "@/lib/push";
import { TIMING_MAP } from "@/lib/timingMap";
import { japanHour, startOfJapanToday } from "@/lib/japanTime";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const hour = japanHour();
  const today = startOfJapanToday(); // Japan 00:00 (UTC instant)

  const activeTimings = Object.entries(TIMING_MAP)
    .filter(([, { start, end }]) => hour >= start + 1 && hour <= end)
    .map(([time]) => time);

  if (activeTimings.length === 0) {
    return NextResponse.json({ message: "No active timings" });
  }

  const reminders = await prisma.medicineReminder.findMany({
    where: {
      time: { in: activeTimings },
      medicine: {
        active: true,
        OR: [
          { ongoing: true },
          {
            ongoing: false,
            endDate: { gte: today },
          },
        ],
      },
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

  // Senior-এ group করো
  const seniorMissedMap: Record<
    string,
    {
      seniorId: string;
      seniorName: string;
      ownerId: string;
      medicines: string[];
    }
  > = {};

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
        if (!seniorMissedMap[senior.id]) {
          seniorMissedMap[senior.id] = {
            seniorId: senior.id,
            seniorName: senior.name,
            ownerId: ownerMember.userId,
            medicines: [],
          };
        }
        seniorMissedMap[senior.id].medicines.push(
          `${reminder.medicine.name}(${reminder.time})`,
        );
      }
    }
  }

  // Senior-এ একটা notification
  for (const data of Object.values(seniorMissedMap)) {
    await sendPushToSeniorMembers(data.seniorId, "", {
      title: `💊 ${data.seniorName}さんのお薬を確認してください`,
      body: data.medicines.join("、") + "がまだ記録されていません",
      tag: "medicine-reminder",
      requireInteraction: false,
      silent: false,
      url: `/seniors/${data.seniorId}/medicines/missed`,
    });
    notificationCount++;
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

      await sendPushToSeniorMembers(senior.id, "", {
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
