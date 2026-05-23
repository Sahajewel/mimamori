"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BackButton() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => {
        setClicked(true);
        router.back();
      }}
      className={`flex items-center gap-1.5 transition-colors text-sm font-medium ${
        clicked ? "text-gray-300" : "text-indigo-600 hover:underline"
      }`}
    >
      <span className="text-lg">←</span>
      <span>戻る</span>
    </button>
  );
}
