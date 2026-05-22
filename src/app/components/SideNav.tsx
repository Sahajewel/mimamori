"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "ホーム" },
  { href: "/seniors", icon: "👨‍👩‍👧", label: "家族一覧" },
  { href: "/settings", icon: "⚙️", label: "設定" },
];

export function SideNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 transition-all duration-300 shadow-sm ${
          expanded ? "w-56" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-lg">♡</span>
          </div>
          {expanded && (
            <p className="font-semibold text-gray-900 text-base whitespace-nowrap">
              Mimamori
            </p>
          )}
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {expanded && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-2 px-3 py-4 border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="text-lg">{expanded ? "←" : "→"}</span>
          {expanded && <span className="text-xs text-gray-400">閉じる</span>}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span
                  className={`text-xs font-medium ${isActive ? "text-indigo-600" : "text-gray-400"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
