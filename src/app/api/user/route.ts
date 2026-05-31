// user profile edit api route
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ── input validation: name আর image যাচাই ──
const updateSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(50).optional(),
  image: z.url().nullable().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, image } = parsed.data;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({
      success: true,
      name: updated.name,
      image: updated.image,
    });
  } catch (error) {
    console.error("User PATCH failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
