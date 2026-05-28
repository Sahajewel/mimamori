"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function DashboardButton() {
  const [clicked, setClicked] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <Link
      href={isDashboard ? "/" : "/dashboard"}
      onClick={() => setClicked(true)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
        clicked
          ? "bg-indigo-300 text-white"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isDashboard ? "ホーム" : "ダッシュボード →"}
    </Link>
  );
}
