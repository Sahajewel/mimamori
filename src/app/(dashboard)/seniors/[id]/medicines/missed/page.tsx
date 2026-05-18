import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function MissedMedicinesPage({
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

  // 今日のJapan time
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  today.setHours(0, 0, 0, 0);

  // Active medicines
  const medicines = await prisma.medicine.findMany({
    where: {
      seniorId: id,
      active: true,
      OR: [{ ongoing: true }, { ongoing: false, endDate: { gte: today } }],
    },
    include: {
      reminders: true,
      logs: {
        where: {
          createdAt: { gte: today },
        },
      },
    },
  });

  // Miss した medicine を探す
  const missedMedicines = medicines.flatMap((medicine) =>
    medicine.reminders
      .filter((reminder) => {
        const log = medicine.logs.find((l) => l.reminderId === reminder.id);
        return !log;
      })
      .map((reminder) => ({
        medicineId: medicine.id,
        medicineName: medicine.name,
        dosage: medicine.dosage,
        reminderTime: reminder.time,
      })),
  );

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

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-900">
            今日の未記録のお薬
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {senior?.name}さん ·{" "}
            {new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        </div>

        {missedMedicines.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">🌸</p>
            <p className="text-base font-medium text-green-700 mb-1">
              今日のお薬はすべて記録済みです！
            </p>
            <p className="text-sm text-gray-400">
              {senior?.name}さん、お疲れ様でした
            </p>
          </div>
        ) : (
          <>
            {/* Alert */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-700">
                  {senior?.name}さんがまだ飲んでいないお薬があります
                </p>
                <p className="text-xs text-amber-500 mt-0.5">
                  確認してご連絡ください
                </p>
              </div>
            </div>

            {/* Missed medicines list */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
              <div className="px-6 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-700">
                  未記録のお薬 — {missedMedicines.length}件
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {missedMedicines.map((m, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💊</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {m.medicineName}
                        </p>
                        {m.dosage && (
                          <p className="text-xs text-gray-400">{m.dosage}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">
                        {m.reminderTime} 未記録
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/seniors/${id}`}
              className="block w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl text-center hover:bg-indigo-700 transition-colors"
            >
              {senior?.name}さんのページを見る →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
