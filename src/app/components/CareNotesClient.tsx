"use client";

import { useState } from "react";
import Link from "next/link";
import { CareNoteActions } from "@/app/components/CareNoteActions";

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

type Note = {
  id: string;
  content: string;
  createdAt: Date;
  authorName: string | null;
  user: { name: string; id: string } | null;
};

type Props = {
  notes: Note[];
  seniorId: string;
  seniorName: string;
  total: number;
  currentPage: number;
  totalPages: number;
  currentUserId: string;
  currentUserRole: string;
};

export function CareNotesClient({
  notes,
  seniorId,
  seniorName,
  total,
  currentPage,
  totalPages,
  currentUserId,
  currentUserRole,
}: Props) {
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  const prevHref = `/seniors/${seniorId}/notes?page=${currentPage - 1}`;
  const nextHref = `/seniors/${seniorId}/notes?page=${currentPage + 1}`;
  const addHref = `/seniors/${seniorId}/notes/new`;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">ケアノート</h1>
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

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-base text-gray-400">まだノートがありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="px-4 sm:px-6 py-5 hover:bg-gray-50/70 transition-all duration-200"
              >
                <div className="flex items-start gap-2.5 sm:gap-4">
                  {/* সিরিয়াল নাম্বার */}
                  <span className="text-xs font-semibold text-gray-300 bg-gray-100/80 w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 mt-1">
                    {(currentPage - 1) * 10 + index + 1}
                  </span>

                  {/* মূল কন্টেন্ট এরিয়া */}
                  <div className="flex-1 min-w-0">
                    {/* উপররের অংশ: ইউজার অবতার, নাম, তারিখ এবং অ্যাকশন বাটন */}
                    <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-gray-50">
                      <div className="flex items-center gap-2.5">
                        {/* স্মার্ট ইউজার অবতার (নামের প্রথম অক্ষর দিয়ে) */}
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100/50 shrink-0">
                          {note.authorName
                            ? note.authorName[0].toUpperCase()
                            : "退"}
                        </div>

                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-gray-800">
                            {note.authorName || "退会したユーザー"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(note.createdAt).toLocaleDateString(
                              "ja-JP",
                              {
                                timeZone: "Asia/Tokyo",
                                month: "short",
                                day: "numeric",
                              },
                            )}{" "}
                            {new Date(note.createdAt).toLocaleTimeString(
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

                      {/* অ্যাকশন বাটন সেকশন (Edit/Delete) - ডানদিকের কোণায় নিয়ে যাওয়া হলো */}
                      <div className="shrink-0">
                        <CareNoteActions
                          noteId={note.id}
                          seniorId={seniorId}
                          content={note.content}
                          isOwner={note.user?.id === currentUserId}
                        />
                      </div>
                    </div>

                    {/* মাঝের অংশ: মূল নোটের টেক্সট */}
                    <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap ">
                      {note.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
  );
}
