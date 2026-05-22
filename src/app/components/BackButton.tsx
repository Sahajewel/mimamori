"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
    >
      <span className="text-lg">←</span>
      <span>戻る</span>
    </button>
  );
}
