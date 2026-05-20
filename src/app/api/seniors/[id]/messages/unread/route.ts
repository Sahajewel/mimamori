import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    // Last 24 hours-এ নতুন message count
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await prisma.message.count({
      where: {
        seniorId: id,
        createdAt: { gte: since },
        userId: { not: session.user.id },
      },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
