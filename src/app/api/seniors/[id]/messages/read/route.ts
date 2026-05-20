import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // LastRead time save করো
    await prisma.seniorMember.update({
      where: {
        userId_seniorId: {
          userId: session.user.id,
          seniorId: id,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
