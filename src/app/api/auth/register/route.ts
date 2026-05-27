import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import crypto from "crypto";
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
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスはすでに登録されています" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: false,
        verifyToken,
        verifyExpires,
      },
    });

    // Verification email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verifyToken}`;

    await transporter.sendMail({
      from: `"Mimamori" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "【Mimamori】メールアドレスの確認",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #4F46E5; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">♡ Mimamori</h1>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">${name}さん、こんにちは！</p>
            <p style="font-size: 16px; color: #374151;">Mimamoriにご登録いただきありがとうございます。</p>
            <p style="font-size: 16px; color: #374151;">以下のボタンをクリックしてメールアドレスを確認してください。</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}" 
                style="background: #4F46E5; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: bold;">
                メールアドレスを確認する
              </a>
            </div>
            <p style="font-size: 14px; color: #9CA3AF;">このリンクは24時間有効です。</p>
            <p style="font-size: 14px; color: #9CA3AF;">心当たりがない場合は、このメールを無視してください。</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
