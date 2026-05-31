"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  checkInId: string;
  seniorId: string;
};

export function DeleteCheckInButton({ checkInId, seniorId }: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/seniors/${seniorId}/checkins/${checkInId}`, {
      method: "DELETE",
    });
    setLoading(false);
    setConfirm(false);
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2 ml-3 shrink-0">
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg border border-gray-200"
        >
          取消
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "削除"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="ml-3 shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
    >
      🗑️
    </button>
  );
}
