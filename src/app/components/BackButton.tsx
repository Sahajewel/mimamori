"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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

export function BackButton() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => {
        setClicked(true);
        router.back();
      }}
      className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
      // justify-center gap-1.5 w-full text-sm   mt-3
    >
      {clicked ? <Spinner /> : <span className="text-lg">←</span>}
      <span>戻る</span>
    </button>
  );
}
