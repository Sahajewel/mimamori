"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function DashboardButton() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <Link
      href={isDashboard ? "/" : "/dashboard"}
      onClick={() => setLoading(true)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 ${
        loading ? "opacity-50" : "opacity-100"
      }`}
    >
      {isDashboard ? "ホーム" : "ダッシュボード"}
    </Link>
  );
}
