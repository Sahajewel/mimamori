"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function DashboardButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");

  const handleClick = () => {
    setLoading(true);
    router.push(isDashboard ? "/" : "/dashboard");
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70"
    >
      {loading ? <Spinner /> : null}
      {isDashboard ? "ホーム" : "ダッシュボード"}
    </button>
  );
}
