/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { seniorId, status } = await req.json();
    const lastSummary = await prisma.aiSummary.findFirst({
      where: { seniorId, type: "care-notes" },
      orderBy: { createdAt: "desc" },
    });
    if (!lastSummary) {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 });
    }
    const updated = await prisma.aiSummary.update({
      where: { id: lastSummary.id },
      data: {
        status: status,
        reviewBy: status === "reviewed" ? session.user.id : null,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
