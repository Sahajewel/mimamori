"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  seniorId: string;
  seniorName: string;
};

export function DeleteSeniorButton({ seniorId, seniorName }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/seniors/${seniorId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "削除できませんでした");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm text-red-400 hover:text-red-600 transition-colors"
      >
        🗑️ {seniorName}さんを削除する
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-6">
            <p className="text-lg font-semibold text-gray-900 mb-2 text-center">
              本当に削除しますか？
            </p>
            <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
              {seniorName}
              さんのすべてのデータ（チェックイン・お薬・ノート）が削除されます。この操作は取り消せません。
            </p>
            {error && (
              <p className="text-sm text-red-500 text-center mb-4 bg-red-50 rounded-xl p-3">
                {error}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
