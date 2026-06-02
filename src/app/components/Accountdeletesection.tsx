"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function AccountDeleteSection() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/user", { method: "DELETE" });

    if (res.ok) {
      // account মুছে গেছে — logout করে login পেজে
      await signOut({ callbackUrl: "/login" });
      return;
    }

    // আটকেছে (OWNER ইত্যাদি) বা অন্য error — message দেখাও
    const data = await res.json();
    setError(data.error || "エラーが発生しました");
    setLoading(false);
    setConfirming(false);
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="text-base font-semibold text-red-600 mb-1">
        アカウントの削除
      </h3>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
        アカウントを削除すると元に戻せません。あなたが記録したチェックインやノートは残りますが、お名前は表示されなくなります。
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {!confirming ? (
        // ── ধাপ ১: প্রথম বাটন ──
        <button
          onClick={() => {
            setError("");
            setConfirming(true);
          }}
          className="px-5 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
        >
          アカウントを削除する
        </button>
      ) : (
        // ── ধাপ ২: নিশ্চিত করা ──
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm font-medium text-red-700 mb-3">
            本当にアカウントを削除しますか？この操作は取り消せません。
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "削除中..." : "削除する"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
