import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function MedicineHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  today.setHours(0, 0, 0, 0);

  // শুধু expired medicine
  const medicines = await prisma.medicine.findMany({
    where: {
      seniorId: id,
      ongoing: false,
      endDate: { lte: today },
    },
    orderBy: { endDate: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <Link
          href={`/seniors/${id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 戻る
        </Link>
        <p className="font-medium text-gray-900">Mimamori</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900">服薬履歴</h1>
          <p className="text-sm text-gray-400 mt-1">
            {senior?.name}さんの過去のお薬一覧
          </p>
        </div>

        {medicines.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">💊</p>
            <p className="text-sm text-gray-400">
              過去のお薬の記録はありません
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-gray-50 text-xs text-gray-400 font-medium border-b border-gray-100">
              <span>薬名</span>
              <span>開始日</span>
              <span>終了日</span>
              <span>服用日数</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-50">
              {medicines.map((medicine) => {
                const start = new Date(medicine.startDate).toLocaleDateString(
                  "ja-JP",
                  { timeZone: "Asia/Tokyo" },
                );
                const end = medicine.endDate
                  ? new Date(medicine.endDate).toLocaleDateString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                    })
                  : "-";
                const days = medicine.duration
                  ? `${medicine.duration}日間`
                  : "-";

                return (
                  <Link
                    key={medicine.id}
                    href={`/seniors/${id}/medicines/${medicine.id}`}
                    className="grid grid-cols-4 gap-2 px-4 py-3 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.name}
                      </p>
                      {medicine.dosage && (
                        <p className="text-xs text-gray-400">
                          {medicine.dosage}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">{start}</span>
                    <span className="text-xs text-gray-600">{end}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-center">
                      {days}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
