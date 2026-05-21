import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { rating, comment, featureRequest, name, email } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "評価を選択してください" },
        { status: 400 },
      );
    }

    // Neon-এ save
    await prisma.feedback.create({
      data: {
        rating,
        comment: comment || null,
        featureRequest: featureRequest || null,
        name: name || null,
        email: email || null,
        showOnLanding: rating >= 4 && !!comment,
      },
    });

    // Gmail-এ পাঠাও
    await transporter.sendMail({
      from: `"Mimamori Feedback" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `⭐ 新しいフィードバック (${rating}/5)`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #4F46E5;">新しいフィードバック</h2>
          <p><strong>評価:</strong> ${"⭐".repeat(rating)} (${rating}/5)</p>
          ${name ? `<p><strong>名前:</strong> ${name}</p>` : ""}
          ${email ? `<p><strong>メール:</strong> ${email}</p>` : ""}
          ${comment ? `<p><strong>感想:</strong> ${comment}</p>` : ""}
          ${featureRequest ? `<p><strong>ほしい機能:</strong> ${featureRequest}</p>` : ""}
          <hr>
          <p style="color: #9CA3AF; font-size: 12px;">
            ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
