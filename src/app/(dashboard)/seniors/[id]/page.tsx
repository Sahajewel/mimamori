import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { QuickLinkButton } from "@/app/components/QuickLinkButton";
import { SeniorTabs } from "@/app/components/SeniorTabs";

import { DeleteSeniorButton } from "@/app/components/DeleteSeniorButton";
import { NavActions } from "@/app/components/NavActions";
import { ChatButton } from "@/app/components/ChatButton";
import Link from "next/link";
import { MemberList } from "@/app/components/Memberlist";
import { japanDayStart, startOfJapanToday } from "@/lib/japanTime";

export default async function SeniorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seniorMember = await prisma.seniorMember.findFirst({
    where: { seniorId: id, userId: session.user.id },
    include: {
      senior: {
        include: {
          members: {
            include: { user: { select: { name: true } } },
          },
          checkIns: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: { select: { name: true } } },
          },
          medicines: {
            where: {
              active: true,
              OR: [
                { ongoing: true },
                {
                  ongoing: false,
                  endDate: {
                    gt: startOfJapanToday(),
                  },
                },
              ],
            },
            include: {
              reminders: true,
              logs: {
                where: {
                  createdAt: {
                    gte: new Date(
                      new Date().setDate(new Date().getDate() - 30),
                    ),
                  },
                  status: { in: ["TAKEN", "MISSED"] },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          careNotes: {
            orderBy: { createdAt: "desc" },
            take: 4,
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!seniorMember) notFound();

  // 🟢 প্রথমে ডাটা ডেস্ট্রাকচার করে নিলাম, যাতে নিচের সব জায়গায় ভেরিয়েবলগুলো পাওয়া যায়
  const { senior, role } = seniorMember;

  // 🟢 ১. checkIns এর ডেটকে string বানিয়ে নিলাম
  const formattedCheckIns = senior.checkIns.map((checkIn) => ({
    ...checkIn,
    createdAt: checkIn.createdAt.toISOString(),
  }));

  // 🟢 ২. careNotes এর ডেটকেও string বানিয়ে নিলাম (যা টাইপস্ক্রিপ্ট চাচ্ছিল)
  const formattedCareNotes = senior.careNotes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
  }));

  const todayStart = startOfJapanToday();

  const todayCheckIn = senior.checkIns.find((c) => {
    return (
      japanDayStart(new Date(c.createdAt)).getTime() === todayStart.getTime()
    );
  });

  const lastCheckIn = senior.checkIns[0];
  const lastSeenText = lastCheckIn
    ? (() => {
        const diff = Math.floor(
          (new Date().getTime() - new Date(lastCheckIn.createdAt).getTime()) /
            1000 /
            60,
        );
        if (diff < 60) return `${diff}分前`;
        if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
        return `${Math.floor(diff / 1440)}日前`;
      })()
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard`}
              className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
            >
              <span className="text-lg">←</span>
              <span>戻る</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm">♡</span>
              </div>
              <p className="font-semibold text-gray-900 hidden sm:block">
                Mimamori
              </p>
            </div>
          </div>
          {role === "OWNER" && <NavActions seniorId={id} role={role} />}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Senior header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-3xl overflow-hidden shrink-0">
              {senior.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={senior.photoUrl}
                  alt={senior.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                senior.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {senior.name}
              </h1>
              {senior.age && (
                <p className="text-base text-gray-400">{senior.age}歳</p>
              )}
            </div>
            <ChatButton seniorId={id} />
          </div>

          {senior.notes && (
            <p className="text-base text-gray-500 bg-gray-50 rounded-xl p-4 mb-4">
              {senior.notes}
            </p>
          )}

          {/* Today status */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">今日の体調</span>
              {todayCheckIn ? (
                <span
                  className={`text-base font-semibold px-3 py-1 rounded-full ${
                    todayCheckIn.status === "OK"
                      ? "bg-green-50 text-green-600"
                      : todayCheckIn.status === "CONCERN"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  {todayCheckIn.status === "OK"
                    ? "✓ 良好"
                    : todayCheckIn.status === "CONCERN"
                      ? "⚠ 要確認"
                      : "🚨 緊急"}
                </span>
              ) : (
                <span className="text-base text-gray-300">未確認</span>
              )}
            </div>
            {lastSeenText && (
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-400">最終確認</span>
                <span className="text-base text-gray-500">{lastSeenText}</span>
              </div>
            )}
          </div>

          {/* Quick link */}
          {role === "OWNER" && (
            <QuickLinkButton seniorId={id} seniorName={senior.name} />
          )}

          {/* Delete Senior */}
          {role === "OWNER" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <DeleteSeniorButton seniorId={id} seniorName={senior.name} />
            </div>
          )}
        </div>
        <MemberList
          seniorId={id}
          members={senior.members.map((m) => ({
            userId: m.userId,
            name: m.user.name,
            role: m.role,
          }))}
          currentUserId={session.user.id}
          currentUserRole={role}
        />
        {/* Tabs */}
        <SeniorTabs
          seniorId={id}
          checkIns={formattedCheckIns} // 🟢 ফিক্সড ডাটা
          medicines={senior.medicines}
          careNotes={formattedCareNotes} // 🟢 ফিক্সড ডাটা
          role={role}
          careNotesTotal={senior.careNotes.length}
        />
      </div>
    </div>
  );
}
