import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { QuickLinkButton } from "@/app/components/QuickLinkButton";
import { ChatButton } from "@/app/components/ChatButton";
import { SeniorTabs } from "@/app/components/SeniorTabs";
import { BackButton } from "@/app/components/BackButton";

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
                    gt: new Date(
                      new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Tokyo",
                      }),
                    ),
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

  await prisma.seniorMember.update({
    where: {
      seniorId_userId: { seniorId: id, userId: session.user.id },
    },
    data: { lastReadAt: new Date() },
  });

  const todayJapan = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  todayJapan.setHours(0, 0, 0, 0);

  const todayCheckIn = senior.checkIns.find((c) => {
    const d = new Date(
      new Date(c.createdAt).toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayJapan.getTime();
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
            <BackButton />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm">♡</span>
              </div>
              <p className="font-semibold text-gray-900 hidden sm:block">
                Mimamori
              </p>
            </div>
          </div>
          {role === "OWNER" && (
            <div className="flex gap-2">
              <Link
                href={`/seniors/${id}/invite`}
                className="text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                招待する
              </Link>
              <Link
                href={`/seniors/${id}/edit`}
                className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                編集
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Senior header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-2xl overflow-hidden flex-shrink-0">
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
              <h1 className="text-xl font-semibold text-gray-900">
                {senior.name}
              </h1>
              {senior.age && (
                <p className="text-sm text-gray-400">{senior.age}歳</p>
              )}
            </div>
            {/* Chat button */}
            <ChatButton seniorId={id} />
          </div>

          {senior.notes && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 mb-4">
              {senior.notes}
            </p>
          )}

          {/* Today status */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">今日の体調</span>
              {todayCheckIn ? (
                <span
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
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
                <span className="text-sm text-gray-300">未確認</span>
              )}
            </div>
            {lastSeenText && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">最終確認</span>
                <span className="text-sm text-gray-500">{lastSeenText}</span>
              </div>
            )}
          </div>

          {/* Quick link */}
          {role === "OWNER" && (
            <QuickLinkButton seniorId={id} seniorName={senior.name} />
          )}
        </div>

        {/* Tabs */}
        <SeniorTabs
          seniorId={id}
          checkIns={senior.checkIns}
          medicines={senior.medicines}
          careNotes={senior.careNotes}
          role={role}
          careNotesTotal={senior.careNotes.length}
        />
      </div>
    </div>
  );
}
