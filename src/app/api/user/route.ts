import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const { name, image } = await req.json();

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
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
