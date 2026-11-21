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
import { Heart, CalendarClock } from "lucide-react";
import GenerateWeeklySummary from "@/app/components/GenerateWeeklySummary";

export default async function SeniorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/seniors/${id}`);

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

  const { senior, role } = seniorMember;

  const formattedCheckIns = senior.checkIns.map((checkIn) => ({
    ...checkIn,
    createdAt: checkIn.createdAt.toISOString(),
  }));

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
      {/* Modern Glass Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-4xl  mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:underline text-sm"
            >
              <span className="text-lg">←</span>
              <span>戻る</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm hidden sm:block">♡</span>
              </div>
              <p className="font-semibold text-gray-900 hidden sm:block">
                Mimamori
              </p>
            </div>
          </div>
          {role === "OWNER" && <NavActions seniorId={id} role={role} />}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Senior Header Card - Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-3xl overflow-hidden shadow-md ring-2 ring-indigo-100">
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

              {todayCheckIn && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {todayCheckIn.status === "OK" && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                  {todayCheckIn.status === "CONCERN" && (
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  )}
                  {todayCheckIn.status === "EMERGENCY" && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
                    {senior.name}
                  </h1>
                  {senior.age && (
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <CalendarClock className="w-4 h-4" /> {senior.age}歳
                    </p>
                  )}
                </div>
                <ChatButton seniorId={id} />
              </div>
            </div>
          </div>

          {senior.notes && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-5">
              <p className="text-indigo-800 text-sm leading-relaxed">
                {senior.notes}
              </p>
            </div>
          )}

          {/* Today's Status Card */}
          <div className="bg-linear-to-r from-gray-50 to-indigo-50/30 rounded-xl p-4 space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-gray-600">
                  今日の体調
                </span>
              </div>
              {todayCheckIn ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    todayCheckIn.status === "OK"
                      ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                      : todayCheckIn.status === "CONCERN"
                        ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                        : "bg-red-100 text-red-700 ring-1 ring-red-200 animate-pulse"
                  }`}
                >
                  {todayCheckIn.status === "OK" && "✓ 良好"}
                  {todayCheckIn.status === "CONCERN" && "⚠ 要確認"}
                  {todayCheckIn.status === "EMERGENCY" && "🚨 緊急"}
                </span>
              ) : (
                <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  未確認
                </span>
              )}
            </div>
            {lastSeenText && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-sm text-gray-500">最終確認</span>
                <span className="text-sm font-medium text-gray-700">
                  {lastSeenText}
                </span>
              </div>
            )}
          </div>

          {/* Quick Link + Delete */}
          {role === "OWNER" && (
            <div className="space-y-3">
              <QuickLinkButton seniorId={id} seniorName={senior.name} />
              <div className="pt-3 border-t border-gray-100">
                <DeleteSeniorButton seniorId={id} seniorName={senior.name} />
              </div>
            </div>
          )}
        </div>

        {/* Member List Section */}
        <div className="mb-8">
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
        </div>

        {/* Tabs */}
        <SeniorTabs
          seniorId={id}
          checkIns={formattedCheckIns}
          medicines={senior.medicines}
          careNotes={formattedCareNotes}
          role={role}
          careNotesTotal={senior.careNotes.length}
        />
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-2">週間ケアノート要約</h2>
        <GenerateWeeklySummary seniorId={senior.id} />
      </section>
    </div>
  );
}
