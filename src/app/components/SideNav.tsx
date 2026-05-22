"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "ホーム" },
  { href: "/settings", icon: "⚙️", label: "設定" },
];

export function SideNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Overlay — click করলে close হবে */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 transition-all duration-300 shadow-lg flex flex-col ${
          expanded ? "w-56" : "w-16"
        }`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 px-3 py-5 border-b border-gray-100 w-full hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-lg">♡</span>
          </div>
          {expanded && (
            <p className="font-semibold text-gray-900 text-base whitespace-nowrap">
              Mimamori
            </p>
          )}
        </button>

        {/* Nav items */}
        <div className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setExpanded(false)}
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

        {/* Footer */}
        {expanded && (
          <div className="px-4 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-300 text-center">© 2026 Mimamori</p>
          </div>
        )}
      </aside>
    </>
  );
}
