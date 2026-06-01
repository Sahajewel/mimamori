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

// ── নিয়ম (মনে রাখার জন্য) ──
// 1. VIEWER / EDITOR  → delete পারবে; শুধু বেরিয়ে যাবে। তার লেখা
//    checkin/note/log থেকে যাবে (userId → null, authorName-এ নাম থাকবে)।
// 2. OWNER + অন্য member আছে → আটকাও; আগে ownership transfer করতে হবে।
// 3. OWNER কিন্তু একা member → আটকাও; আগে senior delete করতে হবে।
//
// অর্থাৎ: user যেসব senior-এর OWNER, তার একটাতেও যদি "ব্যবস্থা" না নেওয়া
// হয় (transfer বা senior delete), তাহলে account delete হবে না।

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // এই user যেসব senior-এর OWNER, সব বের করি (শুধু প্রথমটা না — সব)
    const ownedMemberships = await prisma.seniorMember.findMany({
      where: { userId, role: "OWNER" },
      select: { seniorId: true },
    });

    // প্রতিটা owned senior-এ OWNER বাদে আর কেউ আছে কিনা দেখি
    for (const owned of ownedMemberships) {
      const memberCount = await prisma.seniorMember.count({
        where: { seniorId: owned.seniorId },
      });

      if (memberCount > 1) {
        // নিয়ম ২ — অন্য member আছে → transfer করতে হবে
        return NextResponse.json(
          {
            error:
              "オーナーになっているケア対象者がいます。アカウントを削除する前に、オーナー権限を他のメンバーに譲渡してください。",
          },
          { status: 400 },
        );
      } else {
        // নিয়ম ৩ — একা OWNER → আগে senior delete করতে হবে
        return NextResponse.json(
          {
            error:
              "オーナーになっているケア対象者がいます。アカウントを削除する前に、その方のプロフィールを削除してください。",
          },
          { status: 400 },
        );
      }
    }

    // এখানে এলে — user কোনো senior-এর OWNER না (নিয়ম ১)।
    // মানে VIEWER/EDITOR, বা কোনো senior-এই নাই। নিরাপদে delete করা যায়।
    //
    // user delete করার আগে যেসব relation-এ onDelete সেট নাই, সেগুলো হাতে
    // সরাতে হবে — নাহলে delete আটকাবে। এখানে invitation (invitedBy)।
    // (SeniorMember, Message, PushSubscription → Cascade; CheckIn/CareNote/
    //  MedicineLog → SetNull — এগুলো নিজে থেকেই হবে।)
    await prisma.$transaction([
      // user-এর পাঠানো invitation মুছে দাও (onDelete সেট না থাকলে আটকাত)
      prisma.invitation.deleteMany({ where: { invitedBy: userId } }),
      // তারপর user delete — cascade/setNull বাকিটা সামলাবে
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "アカウントを削除しました",
    });
  } catch (error) {
    console.error("Account delete failed:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
