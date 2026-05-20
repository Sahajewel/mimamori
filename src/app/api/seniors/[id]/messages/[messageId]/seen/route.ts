/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; messageId: string } },
) {
  // Update message as seen in database
  // await prisma.message.update({
  //   where: { id: params.messageId },
  //   data: { seen: true }
  // });

  return NextResponse.json({ success: true });
}
