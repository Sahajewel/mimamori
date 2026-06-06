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
  const DAY_MS = 24 * 60 * 60 * 1000;
  const todayStart = japanDayStart(new Date());

  const startOfLastWeek = new Date(
    todayStart.getTime() - (dayOfWeek + 6) * DAY_MS,
  );
  const endOfLastWeek = new Date(todayStart.getTime() - dayOfWeek * DAY_MS - 1);

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

    // Medicine stats — percentage বাদ, count দেখাই (記録なし বিভ্রান্তিকর তাই)
    const takenCount = senior.medicines.reduce(
      (acc, m) => acc + m.logs.filter((l) => l.status === "TAKEN").length,
      0,
    );

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

    // Medicine details — percentage বাদ, 飲んだ/飲めなかった count
    const medicineRows = senior.medicines
      .map((m) => {
        const taken = m.logs.filter((l) => l.status === "TAKEN").length;
        const missed = m.logs.filter((l) => l.status === "MISSED").length;
        return `
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151;">
              💊 ${m.name}
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #10B981; text-align: center;">
              ✓ ${taken}回
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: ${missed > 0 ? "#EF4444" : "#9CA3AF"}; text-align: center;">
              ✗ ${missed}回
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
            <div style="width: 56px; height: 56px; background: #4F46E5; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; color: #ffffff; line-height: 56px;">
              ♡
            </div>
            <h1 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 4px;">
              ${senior.name}さんの週間レポート
            </h1>
            <p style="font-size: 13px; color: #9CA3AF; margin: 0;">
              ${startStr} 〜 ${endStr}
            </p>
          </div>

          <!-- Stats: チェックイン / 飲んだ / 緊急 -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #4F46E5; margin: 0 0 4px;">${totalCheckIns}/7</p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">チェックイン</p>
            </div>
            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="font-size: 24px; font-weight: 700; color: #10B981; margin: 0 0 4px;">${takenCount}回</p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">お薬を飲んだ</p>
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
                  <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #9CA3AF; font-weight: 500;">薬名</th>
                  <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #9CA3AF; font-weight: 500;">飲んだ</th>
                  <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #9CA3AF; font-weight: 500;">飲めなかった</th>
                </tr>
              </thead>
              <tbody>
                ${medicineRows}
              </tbody>
            </table>
            <p style="font-size: 11px; color: #9CA3AF; margin: 8px 2px 0;">
              ※ ご本人が記録した回数です。記録がない場合は含まれません。
            </p>
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
