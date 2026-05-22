import { LogoutButton } from "@/app/components/LogoutButton";
import { NotificationButton } from "@/app/components/NotificationButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seniorMembers = await prisma.seniorMember.findMany({
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
            include: {
              reminders: true,
              logs: {
                where: {
                  createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  const japanTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const hour = japanTime.getHours();

  function getGreeting() {
    if (hour >= 5 && hour < 11) return "おはようございます";
    if (hour >= 11 && hour < 17) return "こんにちは";
    return "こんばんは";
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-base">♡</span>
            </div>
            <p className="font-semibold text-gray-900 text-base">Mimamori</p>
          </Link>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">{session.user.name}さん</p>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {getGreeting()}、{session.user.name}さん 👋
          </h1>
          <p className="text-base text-gray-400 mt-1">
            {now.toLocaleDateString("ja-JP", {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            見守り中のご家族
          </h2>
          <Link
            href="/seniors/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ＋ 追加
          </Link>
        </div>

        {/* Empty state */}
        {seniorMembers.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              ♡
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              まだご家族を登録していません
            </p>
            <p className="text-base text-gray-400 mb-6">
              見守りたい家族を追加してください
            </p>
            <Link
              href="/seniors/new"
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              ＋ 家族を追加する
            </Link>
          </div>
        )}

        {/* Senior cards */}
        {seniorMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seniorMembers.map((member) => {
              const senior = member.senior;
              const role = member.role;
              const lastCheckIn = senior.checkIns[0];

              const totalReminders = senior.medicines.flatMap(
                (m) => m.reminders,
              ).length;
              const takenToday = senior.medicines.flatMap((m) =>
                m.logs.filter((l) => l.status === "TAKEN"),
              ).length;

              const lastCheckInTime = lastCheckIn
                ? (() => {
                    const diff = Math.floor(
                      (now.getTime() -
                        new Date(lastCheckIn.createdAt).getTime()) /
                        1000 /
                        60,
                    );
                    if (diff < 60) return `${diff}分前`;
                    if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
                    return `${Math.floor(diff / 1440)}日前`;
                  })()
                : null;

              const isEmergency = lastCheckIn?.status === "EMERGENCY";
              const isConcern = lastCheckIn?.status === "CONCERN";

              return (
                <Link
                  key={senior.id}
                  href={`/seniors/${senior.id}`}
                  className={`group bg-white rounded-2xl p-6 shadow-sm border-2 transition-all active:scale-95 cursor-pointer ${
                    isEmergency
                      ? "border-red-200 hover:border-red-400 hover:shadow-red-100"
                      : isConcern
                        ? "border-amber-200 hover:border-amber-400 hover:shadow-amber-100"
                        : "border-gray-100 hover:border-indigo-200 hover:shadow-indigo-100"
                  } hover:shadow-lg`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xl overflow-hidden flex-shrink-0 shadow-sm">
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
                      <div>
                        <p className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {senior.name}
                        </p>
                        {senior.age && (
                          <p className="text-sm text-gray-400">
                            {senior.age}歳
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {role === "OWNER" && (
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                          管理者
                        </span>
                      )}
                      <span className="text-indigo-400 text-lg group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    {/* CheckIn */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">今日の体調</span>
                      <div className="flex items-center gap-2">
                        {lastCheckIn ? (
                          <>
                            <span
                              className={`text-sm font-semibold ${
                                lastCheckIn.status === "OK"
                                  ? "text-green-500"
                                  : lastCheckIn.status === "CONCERN"
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            >
                              {lastCheckIn.status === "OK"
                                ? "✓ 良好"
                                : lastCheckIn.status === "CONCERN"
                                  ? "⚠ 要確認"
                                  : "🚨 緊急"}
                            </span>
                            {lastCheckInTime && (
                              <span className="text-xs text-gray-300">
                                {lastCheckInTime}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-300">未確認</span>
                        )}
                      </div>
                    </div>

                    {/* Medicine */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">今日のお薬</span>
                      {totalReminders > 0 ? (
                        <span
                          className={`text-sm font-semibold ${
                            takenToday === totalReminders
                              ? "text-green-500"
                              : takenToday > 0
                                ? "text-amber-500"
                                : "text-gray-400"
                          }`}
                        >
                          {takenToday === totalReminders
                            ? "✓ 完了"
                            : `${takenToday}/${totalReminders} 服用済み`}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {senior.medicines.length > 0
                            ? `${senior.medicines.length}種類`
                            : "登録なし"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emergency alert */}
                  {isEmergency && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-red-600 font-semibold">
                        🚨 緊急状態です。すぐに確認してください！
                      </p>
                    </div>
                  )}

                  {/* Concern alert */}
                  {isConcern && (
                    <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-amber-600 font-medium">
                        ⚠ 様子を確認してください
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
