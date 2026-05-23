import { DashboardClient } from "@/app/components/DashboardClient ";
import { LogoutButton } from "@/app/components/LogoutButton";
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
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between pl-12">
          <Link href="/" className="flex items-center gap-2.5">
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
                  prefetch={true}
                  className={`group bg-white rounded-2xl p-6 shadow-sm border-2 transition-all active:scale-95 cursor-pointer ${
                    isEmergency
                      ? "border-red-200 hover:border-red-400 hover:shadow-red-100"
                      : isConcern
                        ? "border-amber-200 hover:border-amber-400 hover:shadow-amber-100"
                        : "border-gray-100 hover:border-indigo-200 hover:shadow-indigo-100"
                  } hover:shadow-lg`}
                >
                  <DashboardClient
                    seniorMembers={seniorMembers.map((m) => ({
                      role: m.role,
                      senior: {
                        id: m.senior.id,
                        name: m.senior.name,
                        age: m.senior.age,
                        photoUrl: m.senior.photoUrl,
                        checkIns: m.senior.checkIns.map((c) => ({
                          status: c.status,
                          createdAt: c.createdAt.toISOString(),
                        })),
                        medicines: m.senior.medicines.map((med) => ({
                          reminders: med.reminders.map((r) => ({ id: r.id })),
                          logs: med.logs.map((l) => ({ status: l.status })),
                        })),
                      },
                    }))}
                    now={now.toISOString()}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
