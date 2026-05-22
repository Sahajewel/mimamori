"use client";

import { useState } from "react";
import Link from "next/link";

type CheckIn = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  user: { name: string };
};

type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  logs: { status: string }[];
};

type CareNote = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string };
};

type Props = {
  seniorId: string;
  checkIns: CheckIn[];
  medicines: Medicine[];
  careNotes: CareNote[];
  role: string;
  careNotesTotal: number;
};

export function SeniorTabs({
  seniorId,
  checkIns,
  medicines,
  careNotes,
  role,
  careNotesTotal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"checkin" | "medicine" | "note">(
    "checkin",
  );

  const tabs = [
    { key: "checkin", label: "チェックイン", icon: "✓" },
    { key: "medicine", label: "お薬", icon: "💊" },
    { key: "note", label: "ケアノート", icon: "📝" },
  ] as const;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex bg-white border border-gray-100 rounded-2xl p-1 mb-4 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}

      {/* CheckIn tab */}
      {activeTab === "checkin" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              チェックイン履歴
            </h2>
            <div className="flex gap-2">
              <Link
                href={`/seniors/${seniorId}/checkin`}
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                ＋ 追加
              </Link>
              <Link
                href={`/seniors/${seniorId}/checkins`}
                className="text-sm text-indigo-600 hover:underline px-3 py-1.5"
              >
                もっと見る →
              </Link>
            </div>
          </div>
          {checkIns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✓</p>
              <p className="text-sm text-gray-400">
                まだチェックインがありません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
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
      )}

      {/* Medicine tab */}
      {activeTab === "medicine" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">お薬一覧</h2>
            <Link
              href={`/seniors/${seniorId}/medicines/new`}
              className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              ＋ 追加
            </Link>
          </div>
          {medicines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">💊</p>
              <p className="text-sm text-gray-400">
                まだお薬が登録されていません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map((medicine) => {
                const taken = medicine.logs.filter(
                  (l) => l.status === "TAKEN",
                ).length;
                const recorded = medicine.logs.length;
                const rate =
                  recorded > 0 ? Math.round((taken / recorded) * 100) : null;

                return (
                  <Link
                    key={medicine.id}
                    href={`/seniors/${seniorId}/medicines/${medicine.id}`}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl px-3 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {medicine.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {medicine.dosage && `${medicine.dosage} · `}
                        {medicine.frequency}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {rate !== null && recorded > 0 && (
                        <span
                          className={`text-xs font-semibold ${
                            rate >= 80
                              ? "text-green-500"
                              : rate >= 60
                                ? "text-amber-500"
                                : "text-red-400"
                          }`}
                        >
                          {rate}%
                        </span>
                      )}
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
                        服用中
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <Link
            href={`/seniors/${seniorId}/medicines`}
            className="block text-center text-sm text-indigo-600 hover:underline mt-4"
          >
            服薬履歴を見る →
          </Link>
        </div>
      )}

      {/* CareNote tab */}
      {activeTab === "note" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              ケアノート
            </h2>
            <Link
              href={`/seniors/${seniorId}/notes/new`}
              className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              ＋ 追加
            </Link>
          </div>
          {careNotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400">まだノートがありません</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {careNotes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="py-3 border-b border-gray-50 last:border-0"
                  >
                    <p className="text-sm text-gray-700 mb-2">{note.content}</p>
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
              {careNotesTotal >= 3 && (
                <Link
                  href={`/seniors/${seniorId}/notes`}
                  className="block text-center text-sm text-indigo-600 hover:underline mt-3"
                >
                  もっと見る →
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
