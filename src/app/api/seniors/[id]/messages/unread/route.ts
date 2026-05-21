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

    const member = await prisma.seniorMember.findFirst({
      where: { seniorId: id, userId: session.user.id },
      select: { lastReadAt: true },
    });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const count = await prisma.message.count({
      where: {
        seniorId: id,
        createdAt: {
          gte: member?.lastReadAt || oneDayAgo,
        },
        userId: { not: session.user.id },
      },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false });
    }

    await prisma.seniorMember.update({
      where: {
        seniorId_userId: {
          seniorId: id,
          userId: session.user.id,
        },
      },
      data: { lastReadAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
