import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"Mimamori" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "パスワードのリセット — Mimamori",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 48px; height: 48px; background: #EEF2FF; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">
            ♡
          </div>
          <h1 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 12px;">
            Mimamori
          </h1>
        </div>

        <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px;">
          パスワードのリセット
        </h2>
        <p style="font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 24px;">
          パスワードのリセットをリクエストしました。<br>
          下のボタンをクリックして新しいパスワードを設定してください。
        </p>

        <a href="${resetUrl}" 
           style="display: block; background: #4F46E5; color: white; text-align: center; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; margin-bottom: 24px;">
          パスワードをリセットする
        </a>

        <p style="font-size: 12px; color: #9CA3AF; line-height: 1.6;">
          このリンクは1時間後に期限切れになります。<br>
          リクエストしていない場合は、このメールを無視してください。
        </p>

        <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;">
        <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
          © 2026 Mimamori — ご家族をつなぐ
        </p>
      </div>
    `,
  });
}
