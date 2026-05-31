"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteCheckInButton } from "@/app/components/DeleteCheckInButton";

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

type CheckIn = {
  id: string;
  status: string;
  note: string | null;
  createdAt: Date;
  user: { name: string; id: string };
};

type Props = {
  checkIns: CheckIn[];
  seniorId: string;
  seniorName: string;
  total: number;
  currentPage: number;
  totalPages: number;
  currentUserRole: string;
};

export function CheckInsClient({
  checkIns,
  seniorId,
  seniorName,
  total,
  currentPage,
  totalPages,
  currentUserRole,
}: Props) {
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  const prevHref = `/seniors/${seniorId}/checkins?page=${currentPage - 1}`;
  const nextHref = `/seniors/${seniorId}/checkins?page=${currentPage + 1}`;
  const addHref = `/seniors/${seniorId}/checkin`;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            チェックイン履歴
          </h1>
          <p className="text-base text-gray-400 mt-1">
            {seniorName}さん · 全{total}件
          </p>
        </div>
        {currentUserRole !== "VIEWER" && (
          <Link
            href={addHref}
            onClick={() => setClickedHref(addHref)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {clickedHref === addHref ? <Spinner /> : "＋"}
            追加
          </Link>
        )}
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
        {checkIns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">✓</p>
            <p className="text-base text-gray-400">
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
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-sm text-gray-300 w-6 mt-0.5">
                    {(currentPage - 1) * 10 + index + 1}
                  </span>
                  <div className="flex-1">
                    <span
                      className={`text-base font-semibold ${
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
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {checkIn.note}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-sm text-gray-400 font-medium">
                        {checkIn.user.name}
                      </p>
                      <p className="text-xs text-gray-300">·</p>
                      <p className="text-sm text-gray-300">
                        {new Date(checkIn.createdAt).toLocaleDateString(
                          "ja-JP",
                          {
                            timeZone: "Asia/Tokyo",
                            month: "short",
                            day: "numeric",
                          },
                        )}{" "}
                        {new Date(checkIn.createdAt).toLocaleTimeString(
                          "ja-JP",
                          {
                            timeZone: "Asia/Tokyo",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {currentUserRole !== "VIEWER" && (
                  <DeleteCheckInButton
                    checkInId={checkIn.id}
                    seniorId={seniorId}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          {currentPage > 1 ? (
            <Link
              href={prevHref}
              onClick={() => setClickedHref(prevHref)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {clickedHref === prevHref ? <Spinner /> : "←"}
              前へ
            </Link>
          ) : (
            <div />
          )}

          <p className="text-sm text-gray-400">
            {currentPage} / {totalPages} ページ
          </p>

          {currentPage < totalPages ? (
            <Link
              href={nextHref}
              onClick={() => setClickedHref(nextHref)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              次へ
              {clickedHref === nextHref ? <Spinner /> : "→"}
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </>
  );
}
