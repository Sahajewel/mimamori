import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const PER_PAGE = 10;

export default async function MedicinesPage({
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

  const total = await prisma.medicine.count({
    where: { seniorId: id, active: true },
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  const medicines = await prisma.medicine.findMany({
    where: { seniorId: id, active: true },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
    include: { reminders: true },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-3">
        <Link
          href={`/seniors/${id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 戻る
        </Link>
        <p className="font-medium text-gray-900">Mimamori</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              お薬一覧
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {senior?.name}さん · 全{total}件
            </p>
          </div>
          <Link
            href={`/seniors/${id}/medicines/new`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ＋ 追加
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          {medicines.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだお薬が登録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {medicines.map((medicine, index) => (
                <Link
                  key={medicine.id}
                  href={`/seniors/${id}/medicines/${medicine.id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 w-6">
                      {(currentPage - 1) * PER_PAGE + index + 1}
                    </span>
                    <div className="text-lg">💊</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {medicine.dosage && `${medicine.dosage} · `}
                        {medicine.frequency}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {medicine.reminders.map((r) => (
                          <span
                            key={r.id}
                            className="text-xs bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full"
                          >
                            {r.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      服用中
                    </span>
                    {!medicine.ongoing && medicine.endDate && (
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(medicine.endDate).toLocaleDateString("ja-JP")}
                        まで
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/seniors/${id}/medicines?page=${currentPage - 1}`}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← 前へ
              </Link>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/seniors/${id}/medicines?page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    p === currentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link
                href={`/seniors/${id}/medicines?page=${currentPage + 1}`}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                次へ →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
