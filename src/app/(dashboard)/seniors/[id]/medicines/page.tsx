import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";

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
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">服薬履歴</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">服薬履歴</h1>
          <p className="text-base text-gray-400 mt-1">
            {senior?.name}さんの過去のお薬一覧
          </p>
        </div>

        {medicines.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">💊</p>
            <p className="text-base font-medium text-gray-500 mb-1">
              過去のお薬の記録はありません
            </p>
            <p className="text-sm text-gray-400">
              服用が終わったお薬がここに表示されます
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-500">薬名</span>
              <span className="text-sm font-semibold text-gray-500">
                開始日
              </span>
              <span className="text-sm font-semibold text-gray-500">
                終了日
              </span>
              <span className="text-sm font-semibold text-gray-500">日数</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-50">
              {medicines.map((medicine) => {
                const start = new Date(medicine.startDate).toLocaleDateString(
                  "ja-JP",
                  { timeZone: "Asia/Tokyo", month: "short", day: "numeric" },
                );
                const end = medicine.endDate
                  ? new Date(medicine.endDate).toLocaleDateString("ja-JP", {
                      timeZone: "Asia/Tokyo",
                      month: "short",
                      day: "numeric",
                    })
                  : "-";
                const days = medicine.duration ? `${medicine.duration}日` : "-";

                return (
                  <Link
                    key={medicine.id}
                    href={`/seniors/${id}/medicines/${medicine.id}`}
                    className="grid grid-cols-4 gap-2 px-5 py-4 items-center hover:bg-gray-50 transition-colors active:scale-[0.99]"
                  >
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {medicine.name}
                      </p>
                      {medicine.dosage && (
                        <p className="text-sm text-gray-400">
                          {medicine.dosage}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{start}</span>
                    <span className="text-sm text-gray-600">{end}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full text-center font-medium">
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
