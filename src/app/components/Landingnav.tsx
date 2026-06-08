"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogoutButton } from "./LogoutButton";

type Props = {
  isLoggedIn: boolean;
  userName?: string | null;
  userImage?: string | null;
};

export function LandingNav({ isLoggedIn, userName, userImage }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false); // hamburger (ছোট device)
  const [userOpen, setUserOpen] = useState(false); // user dropdown

  // dashboard এলাকায় (SideNav আছে) navbar দেখাব না
  const hideOn = ["/dashboard", "/settings", "/seniors", "/quick"];
  if (hideOn.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const menuLinks = [
    { href: "/", label: "ホーム" },
    { href: "/guide", label: "使い方" },
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/terms", label: "利用規約" },
    { href: "/about", label: "Mimamoriについて" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  // user অংশ (image/নাম → dropdown) — বড় ও ছোট, দুই জায়গায় একই
  const userArea = (
    <>
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors active:opacity-60"
          >
            {userImage ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={userImage}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-700 max-w-30 truncate">
                {userName || "ユーザー"}
              </span>
            )}
            <span className="text-gray-400 text-xs">▼</span>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <p className="px-4 py-2 text-sm font-medium text-gray-800 border-b border-gray-50 truncate">
                {userName || "ユーザー"}
              </p>
              <Link
                href="/dashboard"
                onClick={() => setUserOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors active:opacity-60"
              >
                📊 ダッシュボード
              </Link>
              <div className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors active:opacity-60">
                <LogoutButton></LogoutButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setMenuOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all shadow-sm active:opacity-60"
          >
            ログイン
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <Link
                href="/login"
                onClick={() => setUserOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors active:opacity-60"
              >
                ログインする
              </Link>
              <div className="px-4 py-2.5 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1.5">
                  アカウントをお持ちでない方
                </p>
                <Link
                  href="/register"
                  onClick={() => setUserOpen(false)}
                  className="block text-sm text-indigo-600 font-medium hover:underline active:opacity-60"
                >
                  新規登録はこちら →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* বাঁয়ে — logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-base">♡</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base leading-none">
              Mimamori
            </p>
            <p className="text-sm text-gray-400 mt-0.5 hidden sm:block">
              見守り — 家族をつなぐ
            </p>
          </div>
        </Link>

        {/* ছোট device — মাঝে user/image (বড় device-এ লুকানো) */}
        <div className="lg:hidden ml-auto mr-2">{userArea}</div>

        {/* বড় device — ডানে nav-link + user একসাথে (ছোট device-এ লুকানো) */}
        <div className="hidden lg:flex items-center gap-1">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-1">{userArea}</div>
        </div>

        {/* ছোট device — ডানে hamburger (বড় device-এ লুকানো) */}
        <div className="relative lg:hidden">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setUserOpen(false);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            aria-label="メニュー"
          >
            <span className="text-xl">☰</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
