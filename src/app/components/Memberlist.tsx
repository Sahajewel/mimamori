"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  userId: string;
  name: string;
  role: string;
};

type Props = {
  seniorId: string;
  members: Member[];
  currentUserId: string;
  currentUserRole: string;
};

// role-এর জন্য ছোট badge-এর রং আর লেখা
function roleBadge(role: string) {
  if (role === "OWNER")
    return { label: "オーナー", cls: "bg-indigo-50 text-indigo-600" };
  if (role === "EDITOR")
    return { label: "編集者", cls: "bg-green-50 text-green-600" };
  return { label: "閲覧者", cls: "bg-gray-100 text-gray-500" };
}

export function MemberList({
  seniorId,
  members,
  currentUserId,
  currentUserRole,
}: Props) {
  const router = useRouter();
  // কোন member-কে transfer করার confirm খোলা আছে (তার userId), নাকি কিছুই না
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleTransfer(newOwnerId: string) {
    setLoadingId(newOwnerId);
    setError("");

    const res = await fetch(`/api/seniors/${seniorId}/transfer-ownership`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOwnerId }),
    });

    if (res.ok) {
      setConfirmId(null);
      setLoadingId(null);
      router.refresh(); // list নতুন role নিয়ে রিফ্রেশ হবে
      return;
    }

    const data = await res.json();
    setError(data.error || "エラーが発生しました");
    setLoadingId(null);
    setConfirmId(null);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        家族メンバー
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {/* অনেক member হলে box ছোট থাকবে, ভেতরে scroll হবে */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {members.map((m) => {
          const badge = roleBadge(m.role);
          // transfer বাটন দেখাবে: শুধু আমি OWNER হলে, আর এই member আমি নিজে না,
          // আর এই member এখনো OWNER না
          const showTransfer =
            currentUserRole === "OWNER" &&
            m.userId !== currentUserId &&
            m.role !== "OWNER";

          return (
            <div
              key={m.userId}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-gray-50 last:border-0"
            >
              {/* নাম + role badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {m.name}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}
                >
                  {badge.label}
                </span>
                {m.userId === currentUserId && (
                  <span className="text-xs text-gray-300">（あなた）</span>
                )}
              </div>

              {/* transfer অংশ — শুধু OWNER দেখবে */}
              {showTransfer &&
                (confirmId === m.userId ? (
                  // confirm খোলা
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      オーナーにしますか？
                    </span>
                    <button
                      onClick={() => setConfirmId(null)}
                      disabled={loadingId === m.userId}
                      className="text-xs text-gray-500 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      いいえ
                    </button>
                    <button
                      onClick={() => handleTransfer(m.userId)}
                      disabled={loadingId === m.userId}
                      className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded-lg disabled:opacity-50"
                    >
                      {loadingId === m.userId ? "..." : "はい"}
                    </button>
                  </div>
                ) : (
                  // প্রথম বাটন
                  <button
                    onClick={() => {
                      setError("");
                      setConfirmId(m.userId);
                    }}
                    className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors self-start sm:self-auto"
                  >
                    オーナーにする
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
