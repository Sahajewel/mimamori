"use client";

import Link from "next/link";
import { useState } from "react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

type Senior = {
  id: string;
  name: string;
  age: number | null;
  photoUrl: string | null;
  checkIns: { status: string; createdAt: string }[];
  medicines: {
    reminders: { id: string }[];
    logs: { status: string }[];
  }[];
};

type SeniorMember = {
  role: string;
  senior: Senior;
};

type Props = {
  seniorMembers: SeniorMember[];
  now: string;
};

export function DashboardClient({ seniorMembers, now }: Props) {
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  const nowDate = new Date(now);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          見守り中のご家族
        </h2>
        <Link
          href="/seniors/new"
          onClick={() => setClickedHref("/seniors/new")}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {clickedHref === "/seniors/new" ? <Spinner /> : "＋"}
          追加
        </Link>
      </div>

      {/* Empty state */}
      {seniorMembers.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            ♡
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            まだご家族を登録していません
          </p>
          <p className="text-base text-gray-400 mb-6">
            見守りたい家族を追加してください
          </p>
          <Link
            href="/seniors/new"
            onClick={() => setClickedHref("/seniors/new")}
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {clickedHref === "/seniors/new" ? <Spinner /> : "＋"}
            家族を追加する
          </Link>
        </div>
      )}

      {/* Senior cards */}
      {seniorMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seniorMembers.map((member) => {
            const senior = member.senior;
            const role = member.role;
            const lastCheckIn = senior.checkIns[0];
            const href = `/seniors/${senior.id}`;

            const totalReminders = senior.medicines.flatMap(
              (m) => m.reminders,
            ).length;
            const takenToday = senior.medicines.flatMap((m) =>
              m.logs.filter((l) => l.status === "TAKEN"),
            ).length;

            const lastCheckInTime = lastCheckIn
              ? (() => {
                  const diff = Math.floor(
                    (nowDate.getTime() -
                      new Date(lastCheckIn.createdAt).getTime()) /
                      1000 /
                      60,
                  );
                  if (diff < 60) return `${diff}分前`;
                  if (diff < 1440) return `${Math.floor(diff / 60)}時間前`;
                  return `${Math.floor(diff / 1440)}日前`;
                })()
              : null;

            const isEmergency = lastCheckIn?.status === "EMERGENCY";
            const isConcern = lastCheckIn?.status === "CONCERN";
            const isClicked = clickedHref === href;

            return (
              <Link
                key={senior.id}
                href={href}
                onClick={() => setClickedHref(href)}
                prefetch={true}
                className={`group bg-white rounded-2xl p-6 shadow-sm border-2 transition-all active:scale-95 cursor-pointer ${
                  isEmergency
                    ? "border-red-200 hover:border-red-400 hover:shadow-red-100"
                    : isConcern
                      ? "border-amber-200 hover:border-amber-400 hover:shadow-amber-100"
                      : "border-gray-100 hover:border-indigo-200 hover:shadow-indigo-100"
                } hover:shadow-lg ${isClicked ? "opacity-70" : ""}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xl overflow-hidden flex-shrink-0 shadow-sm">
                      {senior.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={senior.photoUrl}
                          alt={senior.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        senior.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {senior.name}
                      </p>
                      {senior.age && (
                        <p className="text-sm text-gray-400">{senior.age}歳</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {role === "OWNER" && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                        管理者
                      </span>
                    )}
                    <span className="text-indigo-400 text-lg">
                      {isClicked ? (
                        <Spinner />
                      ) : (
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          →
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">今日の体調</span>
                    <div className="flex items-center gap-2">
                      {lastCheckIn ? (
                        <>
                          <span
                            className={`text-sm font-semibold ${
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
                          {lastCheckInTime && (
                            <span className="text-xs text-gray-300">
                              {lastCheckInTime}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-300">未確認</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">今日のお薬</span>
                    {totalReminders > 0 ? (
                      <span
                        className={`text-sm font-semibold ${
                          takenToday === totalReminders
                            ? "text-green-500"
                            : takenToday > 0
                              ? "text-amber-500"
                              : "text-gray-400"
                        }`}
                      >
                        {takenToday === totalReminders
                          ? "✓ 完了"
                          : `${takenToday}/${totalReminders} 服用済み`}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {senior.medicines.length > 0
                          ? `${senior.medicines.length}種類`
                          : "登録なし"}
                      </span>
                    )}
                  </div>
                </div>

                {isEmergency && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <p className="text-sm text-red-600 font-semibold">
                      🚨 緊急状態です。すぐに確認してください！
                    </p>
                  </div>
                )}
                {isConcern && (
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-sm text-amber-600 font-medium">
                      ⚠ 様子を確認してください
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
