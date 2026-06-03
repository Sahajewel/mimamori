"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "ダッシュボード" },
  { href: "/settings", icon: "⚙️", label: "設定" },
];

export function SideNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [clickedHref, setClickedHref] = useState<string | null>(null);
  // session fetch দিয়ে আনছি (অ্যাপে SessionProvider নাই)
  const [user, setUser] = useState<{
    name: string | null;
    image: string | null;
  } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClickedHref(null);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setUser({ name: d.user.name, image: d.user.image });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 transition-all duration-300 shadow-xl flex flex-col w-64 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* উপরে — logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-lg">♡</span>
          </div>
          <p className="font-semibold text-gray-900 text-base">Mimamori</p>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* মাঝে — nav link (home, settings) */}
        <div className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isClicked = clickedHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  setClickedHref(item.href);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">
                  {isClicked ? <Spinner /> : item.icon}
                </span>
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* নিচে — user (image/নাম) + logout */}
        <div className="border-t border-gray-100 p-3">
          {/* image থাকলে image, নাহলে নাম */}
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold overflow-hidden shrink-0">
              {user?.image ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={user.image}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                (user?.name?.charAt(0) ?? "♡")
              )}
            </div>
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.name ?? "..."}
            </p>
          </div>

          {/* logout */}
          <button
            onClick={() => {
              setLoggingOut(true);
              signOut({ callbackUrl: "/" });
            }}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <span className="text-xl">{loggingOut ? <Spinner /> : "🚪"}</span>
            <span className="text-base font-medium">ログアウト</span>
          </button>
        </div>
      </aside>
    </>
  );
}
