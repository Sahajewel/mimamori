"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardButton() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <Link
      href={isDashboard ? "/" : "/dashboard"}
      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {isDashboard ? "ホーム" : "ダッシュボード →"}
    </Link>
  );
}
