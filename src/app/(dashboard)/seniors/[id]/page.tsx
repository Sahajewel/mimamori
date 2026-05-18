import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { QuickLinkButton } from "@/app/components/QuickLinkButton";

export default async function SeniorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seniorMember = await prisma.seniorMember.findFirst({
    where: {
      seniorId: id,
      userId: session.user.id,
    },
    include: {
      senior: {
        include: {
          checkIns: {
            orderBy: { createdAt: "desc" },
            take: 2,
            include: { user: { select: { name: true } } },
          },
          medicines: {
            where: { active: true },
            include: { reminders: true },
          },
          careNotes: {
            orderBy: { createdAt: "desc" },
            take: 3,
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!seniorMember) notFound();

  const { senior, role } = seniorMember;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 戻る
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-sm">♡</span>
            </div>
            <p className="font-medium text-gray-900">Mimamori</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ログアウト
        </Link>
      </nav>

      <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
        {/* Senior header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-xl">
                {senior.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900">
                  {senior.name}
                </h1>
                {senior.age && (
                  <span className="text-sm text-gray-400">{senior.age}歳</span>
                )}
              </div>
            </div>
            {role === "OWNER" && (
              <div className="flex gap-2">
                <Link
                  href={`/seniors/${id}/invite`}
                  className="text-sm text-indigo-600 hover:underline border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  招待する
                </Link>
                <Link
                  href={`/seniors/${id}/edit`}
                  className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  編集
                </Link>
              </div>
            )}
          </div>
          {senior.notes && (
            <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              {senior.notes}
            </p>
          )}
          {/* Today CheckIn status */}
          {(() => {
            const todayJapan = new Date(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
            );
            todayJapan.setHours(0, 0, 0, 0);

            const todayCheckIn = senior.checkIns.find((c) => {
              const checkInDate = new Date(
                new Date(c.createdAt).toLocaleString("en-US", {
                  timeZone: "Asia/Tokyo",
                }),
              );
              checkInDate.setHours(0, 0, 0, 0);
              return checkInDate.getTime() === todayJapan.getTime();
            });

            const lastCheckIn = senior.checkIns[0];
            const lastSeenText = lastCheckIn
              ? (() => {
                  const diff = Math.floor(
                    (new Date().getTime() -
                      new Date(lastCheckIn.createdAt).getTime()) /
                      1000 /
                      60,
                  );
                  if (diff < 60) return `${diff}分前`;
                  if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
                  return `${Math.floor(diff / 1440)}日前`;
                })()
              : null;

            return (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-2">
                {/* Today CheckIn */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">今日の体調</span>
                  {todayCheckIn ? (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        todayCheckIn.status === "OK"
                          ? "bg-green-50 text-green-600"
                          : todayCheckIn.status === "CONCERN"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {todayCheckIn.status === "OK"
                        ? "✓ 良好"
                        : todayCheckIn.status === "CONCERN"
                          ? "⚠ 要確認"
                          : "🚨 緊急"}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">未確認</span>
                  )}
                </div>

                {/* Last seen */}
                {lastSeenText && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">最終確認</span>
                    <span className="text-xs text-gray-500">
                      {lastSeenText}
                    </span>
                  </div>
                )}

                {/* Today CheckIn update button */}
                {todayCheckIn && (
                  <div className="pt-1">
                    <Link
                      href={`/seniors/${id}/checkin`}
                      className="text-xs text-indigo-500 hover:underline"
                    >
                      体調を更新する →
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}
          {role === "OWNER" && (
            <div className="mt-4">
              <QuickLinkButton seniorId={id} seniorName={senior.name} />
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href={`/seniors/${id}/checkin`}
            className="bg-indigo-600 text-white rounded-xl p-4 text-center hover:bg-indigo-700 transition-colors"
          >
            <p className="text-lg mb-1">✓</p>
            <p className="text-sm font-medium">チェックイン</p>
          </Link>
          <Link
            href={`/seniors/${id}/notes/new`}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-indigo-200 transition-colors"
          >
            <p className="text-lg mb-1">📝</p>
            <p className="text-sm font-medium text-gray-700">ケアノート</p>
          </Link>
        </div>

        {/* CheckIn history */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">
              チェックイン履歴
            </h2>
            <Link
              href={`/seniors/${id}/checkins`}
              className="text-sm text-indigo-600 hover:underline"
            >
              もっと見る →
            </Link>
          </div>
          {senior.checkIns.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだチェックインがありません
            </p>
          ) : (
            <div className="space-y-3">
              {senior.checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
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
                      <p className="text-sm text-gray-500">{checkIn.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{checkIn.user.name}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(checkIn.createdAt).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
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

        {/* Medicine list */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">お薬一覧</h2>
            <Link
              href={`/seniors/${id}/medicines/new`}
              className="text-sm text-indigo-600 hover:underline"
            >
              ＋ 追加
            </Link>
          </div>
          {senior.medicines.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだお薬が登録されていません
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {senior.medicines.slice(0, 3).map((medicine) => (
                  <Link
                    key={medicine.id}
                    href={`/seniors/${id}/medicines/${medicine.id}`}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {medicine.dosage && `${medicine.dosage} · `}
                        {medicine.frequency}
                      </p>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      服用中
                    </span>
                  </Link>
                ))}
              </div>
              {senior.medicines.length > 3 && (
                <Link
                  href={`/seniors/${id}/medicines`}
                  className="block text-center text-sm text-indigo-600 hover:underline mt-3"
                >
                  もっと見る ({senior.medicines.length - 3}件) →
                </Link>
              )}
            </>
          )}
        </div>

        {/* Care notes */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">ケアノート</h2>
            <Link
              href={`/seniors/${id}/notes/new`}
              className="text-sm text-indigo-600 hover:underline"
            >
              ＋ 追加
            </Link>
          </div>
          {senior.careNotes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだノートがありません
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {senior.careNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="py-3 border-b border-gray-50 last:border-0"
                  >
                    <p className="text-sm text-gray-700 mb-1">{note.content}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">{note.user.name}</p>
                      <p className="text-xs text-gray-300">·</p>
                      <p className="text-xs text-gray-300">
                        {new Date(note.createdAt).toLocaleDateString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                        })}{" "}
                        {new Date(note.createdAt).toLocaleTimeString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {senior.careNotes.length > 3 && (
                <Link
                  href={`/seniors/${id}/notes`}
                  className="block text-center text-sm text-indigo-600 hover:underline mt-3"
                >
                  もっと見る ({senior.careNotes.length - 3}件) →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
