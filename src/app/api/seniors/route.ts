import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const seniorSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(50),
  age: z.number().min(1).max(120).optional(),
  notes: z.string().max(500).optional(),
});

// GET → Senior list আনো
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const seniors = await prisma.seniorMember.findMany({
      where: { userId: session.user.id },
      include: {
        senior: {
          include: {
            checkIns: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
            medicines: {
              where: { active: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(seniors);
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}

// POST → নতুন Senior বানাও
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = seniorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, age, notes } = parsed.data;

    // Senior বানাও + OWNER হিসেবে SeniorMember বানাও
    const senior = await prisma.senior.create({
      data: {
        name,
        age,
        notes,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(senior, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
