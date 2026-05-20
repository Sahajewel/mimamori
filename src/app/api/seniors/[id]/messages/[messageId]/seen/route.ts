/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }, // ✅ Promise ব্যবহার করা হয়েছে
) {
  // params-কে ব্যবহার করার আগে অবশ্যই await করতে হবে
  const resolvedParams = await params;

  // Update message as seen in database
  // await prisma.message.update({
  //   where: { id: resolvedParams.messageId }, // 👈 এখানে params.messageId এর জায়গায় resolvedParams হবে
  //   data: { seen: true }
  // });

  return NextResponse.json({ success: true });
}
