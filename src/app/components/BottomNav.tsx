"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/dashboard",
      icon: "🏠",
      label: "ホーム",
      active: pathname === "/dashboard",
    },
    {
      href: "/notifications",
      icon: "🔔",
      label: "通知",
      active: pathname === "/notifications",
    },
    {
      href: "/settings",
      icon: "⚙️",
      label: "設定",
      active: pathname === "/settings",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around px-4 py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              item.active
                ? "text-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span
              className={`text-xs font-medium ${item.active ? "text-indigo-600" : "text-gray-400"}`}
            >
              {item.label}
            </span>
            {item.active && (
              <span className="absolute bottom-0 w-1 h-1 bg-indigo-600 rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
