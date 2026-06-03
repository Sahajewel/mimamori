"use client";

import Link from "next/link";

// প্রতিটা ধাপ — label আর (শেষেরটা ছাড়া) একটা href
export type Crumb = {
  label: string;
  href?: string; // শেষ ধাপে href দেওয়ার দরকার নাই (ওটাই current পেজ)
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="パンくず"
      className="flex items-center flex-wrap gap-1 text-sm text-gray-400 mb-4"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-indigo-600 hover:underline transition-colors max-w-35 truncate"
              >
                {item.label}
              </Link>
            ) : (
              // শেষ ধাপ — current পেজ, clickable না
              <span className="text-gray-700 font-medium max-w-35 truncate">
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-gray-300">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
