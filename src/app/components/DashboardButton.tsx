"use client";

import Link from "next/link";
import { useState } from "react";

export function DashboardButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <Link
      href="/dashboard"
      onClick={() => setClicked(true)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
        clicked
          ? "bg-indigo-300 text-white"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      <span className="hidden sm:inline">ダッシュボード →</span>
      <span className="sm:hidden">ホーム</span>
    </Link>
  );
}
