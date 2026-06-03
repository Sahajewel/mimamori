"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

type Props = {
  isLoggedIn: boolean;
  userName?: string | null;
  userImage?: string | null;
};

export function LandingNav({ isLoggedIn, userName, userImage }: Props) {
  // দুটো আলাদা menu — hamburger (link গুলো) আর user (নাম/dashboard/logout)
  const [menuOpen, setMenuOpen] = useState(false); // hamburger
  const [userOpen, setUserOpen] = useState(false); // user dropdown

  const menuRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // বাইরে ক্লিক করলে menu বন্ধ
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // hamburger menu-র link গুলো
  const menuLinks = [
    { href: "/guide", label: "使い方" },
    { href: "/privacy", label: "プライバシーポリシー" },
    { href: "/terms", label: "利用規約" },
    { href: "/about", label: "Mimamoriについて" },
    { href: "/contact", label: "お問い合わせ" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
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

        {/* ডান দিক */}
        <div className="flex items-center gap-2">
          {/* login অবস্থা */}
          {isLoggedIn ? (
            // ── image / নাম → চাপলে dropdown (dashboard, logout) ──
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
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
                  // image নাই → নাম দেখাও
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {userName || "ユーザー"}
                  </span>
                )}
                <span className="text-gray-400 text-xs">▼</span>
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  {/* নাম (image থাকলেও নাম দেখাই dropdown-এ) */}
                  <p className="px-4 py-2 text-sm font-medium text-gray-800 border-b border-gray-50 truncate">
                    {userName || "ユーザー"}
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    📊 ダッシュボード
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                  >
                    🚪 ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ── login করা নাই → ログイン বাটন ──
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setMenuOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                ログイン
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/login"
                    onClick={() => setUserOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
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
                      className="block text-sm text-indigo-600 font-medium hover:underline"
                    >
                      新規登録はこちら →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Hamburger (☰) — link গুলো ── */}
          {/* বড় screen (lg+) → link সরাসরি, hamburger নাই */}
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
          </div>

          {/* মোবাইল + ট্যাবলেট (lg-এর নিচে) → hamburger ☰ */}
          <div className="relative lg:hidden" ref={menuRef}>
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
      </div>
    </nav>
  );
}
