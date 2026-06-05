import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";
import { TIMING_MAP } from "@/lib/timingMap";
import { startOfJapanToday, japanHour } from "@/lib/japanTime";

export default async function MissedMedicinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/seniors/${id}/medicines/missed`)}`,
    );
  }

  // member check (security)
  const member = await prisma.seniorMember.findFirst({
    where: { seniorId: id, userId: session.user.id },
    include: { senior: { select: { name: true } } },
  });
  if (!member) notFound();

  const today = startOfJapanToday();
  const hour = japanHour();

  // আজকের active medicine + reminder + আজকের log
  const medicines = await prisma.medicine.findMany({
    where: {
      seniorId: id,
      active: true,
      OR: [{ ongoing: true }, { ongoing: false, endDate: { gte: today } }],
    },
    include: {
      reminders: true,
      logs: {
        where: { createdAt: { gte: today } },
        select: { reminderId: true, status: true },
      },
    },
  });

  // প্রতিটা reminder যাচাই — record নাই এমন গুলো বের করো
  type MissedItem = {
    medicineName: string;
    dosage: string | null;
    time: string;
    timeLabel: string;
    endHour: number;
  };

  const stillTime: MissedItem[] = []; // 間に合う — সময় চলছে
  const expired: MissedItem[] = []; // 時間切れ — সময় শেষ

  for (const medicine of medicines) {
    for (const reminder of medicine.reminders) {
      // আজ এই reminder-এর log আছে কিনা
      const hasLog = medicine.logs.some((l) => l.reminderId === reminder.id);
      if (hasLog) continue; // record আছে — মিস না, skip

      const timing = TIMING_MAP[reminder.time];
      if (!timing) continue; // অজানা timing — skip

      // এখনো শুরু হয়নি (upcoming) — মিস না, skip
      if (hour < timing.start) continue;

      const item: MissedItem = {
        medicineName: medicine.name,
        dosage: medicine.dosage,
        time: reminder.time,
        timeLabel: `${timing.start}:00〜${timing.end}:00`,
        endHour: timing.end,
      };

      // সময় পেরিয়ে গেছে (end পার) → 時間切れ, নাহলে এখনো সময় আছে → 間に合う
      if (hour >= timing.end) {
        expired.push(item);
      } else {
        stillTime.push(item);
      }
    }
  }

  const seniorName = member.senior.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">お薬の確認</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {seniorName}さんのお薬
          </h1>
          <p className="text-base text-gray-400 mt-1">
            まだ記録されていないお薬
          </p>
        </div>

        {/* সব record আছে — কিছু মিস নাই */}
        {stillTime.length === 0 && expired.length === 0 && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-2">🌸</p>
            <p className="text-base font-medium text-green-700">
              未記録のお薬はありません
            </p>
            <p className="text-sm text-green-500 mt-1">
              すべて記録されています
            </p>
          </div>
        )}

        {/* まだ間に合う — সময় চলছে */}
        {stillTime.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⏰</span>
              <h2 className="text-base font-semibold text-amber-600">
                まだ間に合います
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              今すぐ{seniorName}さんにお声がけください
            </p>
            <div className="space-y-2">
              {stillTime.map((item, i) => (
                <div
                  key={`still-${i}`}
                  className="bg-white border border-amber-100 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💊</span>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {item.medicineName}
                        {item.dosage && (
                          <span className="text-sm text-gray-400 ml-1">
                            {item.dosage}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.time}（{item.timeLabel}）
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full shrink-0">
                    {item.endHour}:00まで
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 時間切れ — সময় শেষ */}
        {expired.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⌛</span>
              <h2 className="text-base font-semibold text-gray-500">
                時間切れ
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-3">服用時間が過ぎました</p>
            <div className="space-y-2">
              {expired.map((item, i) => (
                <div
                  key={`exp-${i}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl grayscale">💊</span>
                    <div>
                      <p className="text-base font-semibold text-gray-700">
                        {item.medicineName}
                        {item.dosage && (
                          <span className="text-sm text-gray-400 ml-1">
                            {item.dosage}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.time}（{item.timeLabel}）
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full shrink-0">
                    時間切れ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* senior পেজে যাওয়ার link */}
        <Link
          href={`/seniors/${id}`}
          className="block text-center text-sm text-indigo-600 hover:underline mt-6"
        >
          {seniorName}さんのページを見る →
        </Link>
      </div>
    </div>
  );
}
