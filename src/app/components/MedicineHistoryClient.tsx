"use client";

import { useState } from "react";
import Link from "next/link";

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

type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  startDate: Date;
  endDate: Date | null;
  duration: number | null;
};

type Props = {
  medicines: Medicine[];
  seniorId: string;
  seniorName: string;
  total: number;
  currentPage: number;
  totalPages: number;
};

export function MedicineHistoryClient({
  medicines,
  seniorId,
  seniorName,
  total,
  currentPage,
  totalPages,
}: Props) {
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  const prevHref = `/seniors/${seniorId}/medicines?page=${currentPage - 1}`;
  const nextHref = `/seniors/${seniorId}/medicines?page=${currentPage + 1}`;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">服薬履歴</h1>
        <p className="text-base text-gray-400 mt-1">
          {seniorName}さん · 全{total}件
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
        <>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
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
            <div className="divide-y divide-gray-50">
              {medicines.map((medicine) => {
                const href = `/seniors/${seniorId}/medicines/${medicine.id}`;
                const start = new Date(medicine.startDate).toLocaleDateString(
                  "ja-JP",
                  {
                    timeZone: "Asia/Tokyo",
                    month: "short",
                    day: "numeric",
                  },
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
                    href={href}
                    onClick={() => setClickedHref(href)}
                    className="grid grid-cols-4 gap-2 px-5 py-4 items-center hover:bg-gray-50 transition-colors active:scale-[0.99]"
                  >
                    <div>
                      <p
                        className={`text-base font-semibold transition-colors ${clickedHref === href ? "text-gray-300" : "text-gray-900"}`}
                      >
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
      )}
    </>
  );
}
