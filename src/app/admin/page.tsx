import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { startOfJapanToday } from "@/lib/japanTime";
import Link from "next/link";
import {
  Users,
  UserCog,
  HeartPulse,
  Pill,
  AlertTriangle,
  MessageSquare,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");

  // শুধু ADMIN ঢুকতে পারবে
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (me?.role !== "ADMIN") redirect("/dashboard");

  const today = startOfJapanToday();

  // সব সংখ্যা একসাথে আনি (parallel, দ্রুত)
  const [
    totalUsers,
    familyCount,
    caregiverCount,
    adminCount,
    totalSeniors,
    totalCheckIns,
    todayCheckIns,
    emergencyCount,
    totalMedicines,
    activeMedicines,
    totalMessages,
    totalCareNotes,
    recentUsers,
    recentCheckIns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "FAMILY" } }),
    prisma.user.count({ where: { role: "CAREGIVER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.senior.count(),
    prisma.checkIn.count(),
    prisma.checkIn.count({ where: { createdAt: { gte: today } } }),
    prisma.checkIn.count({ where: { status: "EMERGENCY" } }),
    prisma.medicine.count(),
    prisma.medicine.count({ where: { active: true } }),
    prisma.message.count(),
    prisma.careNote.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.checkIn.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        status: true,
        authorName: true,
        createdAt: true,
        senior: { select: { name: true } },
      },
    }),
  ]);

  const fmt = (d: Date) =>
    new Date(d).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const roleBadge = (role: string) => {
    if (role === "ADMIN") return "bg-indigo-100 text-indigo-700";
    if (role === "CAREGIVER") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-600";
  };

  const statusBadge = (s: string) => {
    if (s === "EMERGENCY") return "bg-red-100 text-red-700";
    if (s === "CONCERN") return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  };
  const statusLabel = (s: string) =>
    s === "EMERGENCY" ? "🚨 緊急" : s === "CONCERN" ? "⚠ 要確認" : "✓ 良好";

  const stats = [
    {
      icon: Users,
      label: "総ユーザー",
      value: totalUsers,
      sub: `家族 ${familyCount}・介護 ${caregiverCount}・管理 ${adminCount}`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: HeartPulse,
      label: "見守り対象",
      value: totalSeniors,
      sub: "登録された高齢者",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: ClipboardList,
      label: "チェックイン",
      value: totalCheckIns,
      sub: `今日 ${todayCheckIns} 件`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: AlertTriangle,
      label: "緊急通報",
      value: emergencyCount,
      sub: "これまでの合計",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: Pill,
      label: "お薬",
      value: totalMedicines,
      sub: `使用中 ${activeMedicines}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: MessageSquare,
      label: "メッセージ",
      value: totalMessages,
      sub: `ケアノート ${totalCareNotes}`,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">戻る</span>
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <UserCog className="w-4 h-4 text-white" />
              </div>
              <p className="font-semibold text-gray-900">管理ダッシュボード</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">
            {session.user.name} · ADMIN
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div
                className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {s.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent users */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-gray-900">新規ユーザー</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  まだいません
                </p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="px-5 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {u.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}
                      >
                        {u.role}
                      </span>
                      <span className="text-xs text-gray-300 hidden sm:block">
                        {fmt(u.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent check-ins */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              <h2 className="font-semibold text-gray-900">
                最近のチェックイン
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentCheckIns.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  まだありません
                </p>
              ) : (
                recentCheckIns.map((c) => (
                  <div
                    key={c.id}
                    className="px-5 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {c.senior?.name ?? "—"}さん
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {c.authorName || "—"} · {fmt(c.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusBadge(c.status)}`}
                    >
                      {statusLabel(c.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          Mimamori 管理パネル · データは Asia/Tokyo 基準
        </p>
      </div>
    </div>
  );
}
