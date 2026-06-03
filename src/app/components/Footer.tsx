"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // dashboard এলাকায় (SideNav আছে) footer দেখাব না — navbar-এর মতোই
  const hideOn = ["/dashboard", "/settings", "/seniors"];
  if (hideOn.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <footer className="border-t border-gray-100 px-4 py-8 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs">♡</span>
          </div>
          <p className="text-base font-semibold text-gray-900">Mimamori</p>
        </div>
        <p className="text-sm text-gray-400">Developed by Saha Jewel Kumar</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/guide"
            className="text-sm text-gray-400 hover:underline transition-colors"
          >
            使い方
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-400 hover:underline transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-400 hover:underline transition-colors"
          >
            利用規約
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-400 hover:underline transition-colors"
          >
            Mimamoriについて
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-400 hover:underline transition-colors"
          >
            お問い合わせ
          </Link>
          <p className="text-sm text-gray-400">© 2026 Mimamori</p>
        </div>
      </div>
    </footer>
  );
}
