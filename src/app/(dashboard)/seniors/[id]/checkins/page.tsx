import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";

const PER_PAGE = 10;

export default async function CheckInsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const member = await prisma.seniorMember.findFirst({
    where: { seniorId: id, userId: session.user.id },
  });
  if (!member) notFound();

  const senior = await prisma.senior.findUnique({
    where: { id },
    select: { name: true },
  });

  const total = await prisma.checkIn.count({
    where: { seniorId: id },
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const checkIns = await prisma.checkIn.findMany({
    where: { seniorId: id },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: {
      user: { select: { name: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">チェックイン履歴</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              チェックイン履歴
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {senior?.name}さん · 全{total}件
            </p>
          </div>
          <Link
            href={`/seniors/${id}/checkin`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ＋ 追加
          </Link>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
          {checkIns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">✓</p>
              <p className="text-sm text-gray-400">
                まだチェックインがありません
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {checkIns.map((checkIn, index) => (
                <div
                  key={checkIn.id}
                  className="flex items-start justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-300 w-5 mt-0.5">
                      {(currentPage - 1) * PER_PAGE + index + 1}
                    </span>
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          checkIn.status === "OK"
                            ? "text-green-500"
                            : checkIn.status === "CONCERN"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {checkIn.status === "OK"
                          ? "✓ 良好"
                          : checkIn.status === "CONCERN"
                            ? "⚠ 要確認"
                            : "🚨 緊急"}
                      </span>
                      {checkIn.note && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {checkIn.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-400 font-medium">
                      {checkIn.user.name}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(checkIn.createdAt).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(checkIn.createdAt).toLocaleTimeString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination — smart */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2">
            {/* Prev */}
            {currentPage > 1 ? (
              <Link
                href={`/seniors/${id}/checkins?page=${currentPage - 1}`}
                className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← 前へ
              </Link>
            ) : (
              <div />
            )}

            {/* Page indicator */}
            <p className="text-sm text-gray-400">
              {currentPage} / {totalPages} ページ
            </p>

            {/* Next */}
            {currentPage < totalPages ? (
              <Link
                href={`/seniors/${id}/checkins?page=${currentPage + 1}`}
                className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                次へ →
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
