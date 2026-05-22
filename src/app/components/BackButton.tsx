"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-indigo-600  text-sm hover:underline px-3 py-1.5 text-center"
    >
      <span className="text-lg">←</span>
      <span>戻る</span>
    </button>
  );
}
