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
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-sm">♡</span>
          </div>
          <p className="font-medium text-gray-900">Mimamori</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 hidden sm:block">
            {session.user.name}さん
          </p>
          <LogoutButton></LogoutButton>
        </div>
      </nav>

      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              ご家族一覧
            </h1>
            <p className="text-sm text-gray-400 mt-1">見守り中のご家族の状況</p>
          </div>
          <Link
            href="/seniors/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ＋ 家族を追加
          </Link>
        </div>

        {/* Empty state */}
        {seniorMembers.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ♡
            </div>
            <p className="text-base font-medium text-gray-900 mb-2">
              まだご家族を登録していません
            </p>
            <p className="text-sm text-gray-400 mb-6">
              見守りたい家族を追加してください
            </p>
            <Link
              href="/seniors/new"
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ＋ 家族を追加する
            </Link>
          </div>
        )}

        {/* Senior cards */}
        {seniorMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seniorMembers.map(({ senior, role }) => {
              const lastCheckIn = senior.checkIns[0];
              const medicineCount = senior.medicines.length;

              return (
                <Link
                  key={senior.id}
                  href={`/seniors/${senior.id}`}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-base">
                        {senior.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {senior.name}
                        </p>
                        {senior.age && (
                          <p className="text-xs text-gray-400">
                            {senior.age}歳
                          </p>
                        )}
                      </div>
                    </div>
                    {role === "OWNER" && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                        管理者
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">今日のチェックイン</span>
                      {lastCheckIn ? (
                        <span
                          className={`font-medium ${
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
                      ) : (
                        <span className="text-gray-300">未確認</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">お薬</span>
                      <span className="text-gray-600">{medicineCount}種類</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
