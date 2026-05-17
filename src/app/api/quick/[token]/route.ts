import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPushToSeniorMembers } from "@/lib/push";
import { z } from "zod";
const quickSchema = z.object({
  type: z.enum(["checkin", "medicine"]),
  status: z.string(),
  medicineId: z.string().optional(),
  reminderId: z.string().optional(),
  note: z.string().optional(),
});
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const senior = await prisma.senior.findUnique({
      where: { quickToken: token },
      include: {
        members: {
          where: { role: "OWNER" },
          take: 1,
        },
      },
    });

    if (!senior) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }

    const ownerId = senior.members[0]?.userId;
    if (!ownerId) {
      return NextResponse.json(
        { error: "エラーが発生しました" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const parsed = quickSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (parsed.data.type === "checkin") {
      await prisma.checkIn.create({
        data: {
          seniorId: senior.id,
          userId: ownerId,
          status: parsed.data.status as "OK" | "CONCERN" | "EMERGENCY",
          note: parsed.data.note,
        },
      });

      // Notification
      if (parsed.data.status === "EMERGENCY") {
        await sendPushToSeniorMembers(senior.id, ownerId, {
          title: `🚨 緊急！${senior.name}さんが助けを求めています！`,
          body: "今すぐ確認してください！",
          tag: "emergency",
          requireInteraction: true,
          silent: false,
        });
      } else if (parsed.data.status === "CONCERN") {
        await sendPushToSeniorMembers(senior.id, ownerId, {
          title: `⚠️ ${senior.name}さんの様子を確認してください`,
          body: "少し気になることがあるようです",
          tag: "concern",
          requireInteraction: false,
          silent: false,
        });
      }
    } else if (parsed.data.type === "medicine") {
      await prisma.medicineLog.create({
        data: {
          medicineId: parsed.data.medicineId!,
          reminderId: parsed.data.reminderId!,
          userId: ownerId,
          status: parsed.data.status as "TAKEN" | "MISSED" | "SKIPPED",
          takenAt: parsed.data.status === "TAKEN" ? new Date() : null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
