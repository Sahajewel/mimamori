// app/components/DashboardClient.tsx (Client Component)
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserPlus,
  Heart,
  AlertTriangle,
  Clock,
  CheckCircle,
  Pill,
} from "lucide-react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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
  const isOwner = seniorMembers.some((m) => m.role === "OWNER");

  return (
    <>
      {/* Header with modern accent */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-indigo-500 fill-indigo-100" />
          <h2 className="text-xl font-semibold text-gray-800">
            見守り中のご家族
          </h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {seniorMembers.length}
          </span>
        </div>
        {isOwner && (
          <Link
            href="/seniors/new"
            onClick={() => setClickedHref("/seniors/new")}
            className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            {clickedHref === "/seniors/new" ? (
              <Spinner />
            ) : (
              <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            )}
            家族を追加
          </Link>
        )}
      </div>

      {/* Empty State - modernized */}
      {seniorMembers.length === 0 && (
        <div className="bg-white/50 backdrop-blur-sm border border-indigo-100 rounded-2xl p-12 text-center shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-5 text-5xl shadow-inner">
            🏠
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            まだご家族を登録していません
          </p>
          <p className="text-gray-500 mb-8">
            見守りたいご家族を追加して、安心を始めましょう
          </p>
          <Link
            href="/seniors/new"
            onClick={() => setClickedHref("/seniors/new")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            {clickedHref === "/seniors/new" ? (
              <Spinner />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            最初のご家族を追加
          </Link>
        </div>
      )}

      {/* Senior Cards Grid - Modern Glassmorphism Cards */}
      {seniorMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            // Dynamic card styles based on status
            const cardBorder = isEmergency
              ? "border-red-200 shadow-red-100/20"
              : isConcern
                ? "border-amber-200 shadow-amber-100/20"
                : "border-indigo-100 shadow-indigo-50/30";

            const statusBadge =
              lastCheckIn?.status === "OK"
                ? {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    label: "✓ 良好",
                    icon: CheckCircle,
                  }
                : lastCheckIn?.status === "CONCERN"
                  ? {
                      bg: "bg-amber-100",
                      text: "text-amber-700",
                      label: "⚠ 要確認",
                      icon: AlertTriangle,
                    }
                  : lastCheckIn?.status === "EMERGENCY"
                    ? {
                        bg: "bg-red-100",
                        text: "text-red-700",
                        label: "🚨 緊急",
                        icon: AlertTriangle,
                      }
                    : {
                        bg: "bg-gray-100",
                        text: "text-gray-500",
                        label: "未確認",
                        icon: Clock,
                      };

            const medicineStatus =
              totalReminders === 0
                ? { label: "お薬未登録", color: "text-gray-400" }
                : takenToday === totalReminders
                  ? { label: "✓ すべて服用済み", color: "text-green-600" }
                  : takenToday > 0
                    ? {
                        label: `${takenToday}/${totalReminders} 服用済み`,
                        color: "text-amber-600",
                      }
                    : { label: "まだ未服用", color: "text-gray-400" };

            return (
              <Link
                key={senior.id}
                href={href}
                onClick={() => setClickedHref(href)}
                prefetch={true}
                className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border ${cardBorder} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-98 cursor-pointer overflow-hidden ${
                  isClicked ? "opacity-70" : ""
                }`}
              >
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-100/0 to-indigo-50/0 group-hover:from-indigo-50/30 group-hover:via-indigo-100/20 group-hover:to-indigo-50/30 transition-all duration-500 pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar with status ring */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md overflow-hidden transition-transform group-hover:scale-105 ${
                          isEmergency
                            ? "bg-red-100 text-red-600 ring-2 ring-red-300"
                            : isConcern
                              ? "bg-amber-100 text-amber-600 ring-2 ring-amber-300"
                              : "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 ring-2 ring-indigo-200"
                        }`}
                      >
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
                      {lastCheckIn && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {lastCheckIn.status === "OK" && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {lastCheckIn.status === "CONCERN" && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                          {lastCheckIn.status === "EMERGENCY" && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {senior.name}
                      </h3>
                      {senior.age && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {senior.age}歳
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {role === "OWNER" && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-medium border border-indigo-100">
                        管理者
                      </span>
                    )}
                    <span className="text-indigo-400 text-xl font-bold group-hover:translate-x-1 transition-transform">
                      {isClicked ? <Spinner /> : "→"}
                    </span>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="relative space-y-3 mt-4">
                  {/* Today's Health */}
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        今日の体調
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lastCheckIn ? (
                        <>
                          <div
                            className={`px-2 py-0.5 rounded-full ${statusBadge.bg}`}
                          >
                            <span
                              className={`text-xs font-semibold ${statusBadge.text}`}
                            >
                              {statusBadge.label}
                            </span>
                          </div>
                          {lastCheckInTime && (
                            <span className="text-xs text-gray-400">
                              {lastCheckInTime}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">未記入</span>
                      )}
                    </div>
                  </div>

                  {/* Medicine Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        今日のお薬
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalReminders > 0 ? (
                        <span
                          className={`text-xs font-semibold ${medicineStatus.color}`}
                        >
                          {medicineStatus.label}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">登録なし</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency / Concern Alerts */}
                {isEmergency && (
                  <div className="relative mt-4 bg-red-50 border-l-4 border-red-500 rounded-xl px-4 py-3 animate-pulse">
                    <p className="text-sm text-red-700 font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      🚨 緊急状態です。すぐに確認してください！
                    </p>
                  </div>
                )}
                {isConcern && (
                  <div className="relative mt-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl px-4 py-3">
                    <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />⚠
                      体調に変化あり。様子を確認してください
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
