import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
  newPassword: z
    .string()
    .min(8, "新しいパスワードは8文字以上で入力してください"),
});

export async function PATCH(req: Request) {
  try {
    // ১. auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    // ২. user আনো
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: "パスワードが設定されていません" },
        { status: 400 },
      );
    }

    // ৩. পুরনো password যাচাই (security — নিজের পুরনো password জানতে হবে)
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "現在のパスワードが正しくありません" },
        { status: 400 },
      );
    }

    // ৪. নতুন = পুরনো হলে আটকাও (ঐচ্ছিক, ভালো UX)
    const same = await bcrypt.compare(newPassword, user.passwordHash);
    if (same) {
      return NextResponse.json(
        { error: "新しいパスワードは現在のパスワードと異なる必要があります" },
        { status: 400 },
      );
    }

    // ৫. নতুন password hash করে save (register-এর মতো 12 rounds)
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
