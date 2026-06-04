import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { japanDayStart, japanNow } from "@/lib/japanTime";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 先週の日付
  const jpNow = japanNow();
  const dayOfWeek = jpNow.getUTCDay();
  // আজকের Japan day-start (UTC instant)
  const DAY_MS = 24 * 60 * 60 * 1000;
  const todayStart = japanDayStart(new Date());

  const startOfLastWeek = new Date(
    todayStart.getTime() - (dayOfWeek + 6) * DAY_MS,
  );
  const endOfLastWeek = new Date(todayStart.getTime() - dayOfWeek * DAY_MS - 1);
  // すべてのSeniorを取得
  const seniors = await prisma.senior.findMany({
    include: {
      members: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      checkIns: {
        where: {
          createdAt: {
            gte: startOfLastWeek,
            lte: endOfLastWeek,
          },
        },
      },
      medicines: {
        where: { active: true },
        include: {
          reminders: true,
          logs: {
            where: {
              createdAt: {
                gte: startOfLastWeek,
                lte: endOfLastWeek,
              },
            },
          },
        },
      },
    },
  });

  let emailCount = 0;

  for (const senior of seniors) {
    // CheckIn stats
    const totalCheckIns = senior.checkIns.length;
    const emergencyCount = senior.checkIns.filter(
      (c) => c.status === "EMERGENCY",
    ).length;
    const concernCount = senior.checkIns.filter(
      (c) => c.status === "CONCERN",
    ).length;

    // Medicine stats
    const totalReminders = senior.medicines.reduce(
      (acc, m) => acc + m.reminders.length * 7,
      0,
    );
    const takenCount = senior.medicines.reduce(
      (acc, m) => acc + m.logs.filter((l) => l.status === "TAKEN").length,
      0,
    );
    const adherenceRate =
      totalReminders > 0
        ? Math.round((takenCount / totalReminders) * 100)
        : null;

    // Date format
    const startStr = startOfLastWeek.toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "long",
      day: "numeric",
    });
    const endStr = endOfLastWeek.toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "long",
      day: "numeric",
    });

    // Medicine details
    const medicineRows = senior.medicines
      .map((m) => {
        const taken = m.logs.filter((l) => l.status === "TAKEN").length;
        const total = m.reminders.length * 7;
        const rate = total > 0 ? Math.round((taken / total) * 100) : 0;
        return `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151;">
              💊 ${m.name}
            </td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: ${rate >= 80 ? "#10B981" : rate >= 60 ? "#F59E0B" : "#EF4444"}; text-align: center;">
              ${taken}/${total}回 (${rate}%)
            </td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #F9FAFB;">
        
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: #EEF2FF; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px;">
              ♡
            </div>
            <h1 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 4px;">
              ${senior.name}さんの週間レポート
            </h1>
            <p style="font-size: 13px; color: #9CA3AF; margin: 0;">
              ${startStr} 〜 ${endStr}
            </p>
          </div>

          <!-- Stats -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #4F46E5; margin: 0 0 4px;">${totalCheckIns}/7</p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">チェックイン</p>
            </div>
            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: ${adherenceRate !== null ? (adherenceRate >= 80 ? "#10B981" : adherenceRate >= 60 ? "#F59E0B" : "#EF4444") : "#9CA3AF"}; margin: 0 0 4px;">
                ${adherenceRate !== null ? `${adherenceRate}%` : "-"}
              </p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">服薬率</p>
            </div>
            <div style="background: ${emergencyCount > 0 ? "#FEF2F2" : "#F9FAFB"}; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: ${emergencyCount > 0 ? "#EF4444" : "#9CA3AF"}; margin: 0 0 4px;">
                ${emergencyCount}回
              </p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">緊急</p>
            </div>
          </div>

          ${
            concernCount > 0
              ? `
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #92400E; margin: 0;">
              ⚠ 先週${concernCount}回「要確認」がありました
            </p>
          </div>
          `
              : ""
          }

          <!-- Medicine table -->
          ${
            senior.medicines.length > 0
              ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 12px;">お薬の服用状況</h3>
            <table style="width: 100%; border-collapse: collapse; background: #F9FAFB; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr>
                  <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #9CA3AF; font-weight: 500;">薬名</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #9CA3AF; font-weight: 500;">服用状況</th>
                </tr>
              </thead>
              <tbody>
                ${medicineRows}
              </tbody>
            </table>
          </div>
          `
              : ""
          }

          <!-- CTA -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.NEXTAUTH_URL}/seniors/${senior.id}" 
               style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;">
              ${senior.name}さんのページを見る →
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
          <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">
            Mimamori — ご家族をつなぐ
          </p>
        </div>
      </div>
    `;

    // OWNER-এর email-এ পাঠাও
    const ownerMembers = senior.members.filter(
      (m) => m.role === "OWNER" && m.user.email,
    );

    for (const member of ownerMembers) {
      await transporter.sendMail({
        from: `"Mimamori" <${process.env.GMAIL_USER}>`,
        to: member.user.email!,
        subject: `📊 ${senior.name}さんの週間レポート (${startStr}〜${endStr})`,
        html,
      });
      emailCount++;
    }
  }

  return NextResponse.json({ success: true, emailCount });
}
