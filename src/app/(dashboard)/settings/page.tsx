import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/app/components/LogoutButton";
import { SideNav } from "@/app/components/SideNav";
import { BackButton } from "@/app/components/BackButton";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900 hidden sm:block">
              Mimamori
            </p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile hero */}
        <div className="bg-indigo-600 rounded-2xl p-6 mb-6 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
            {session.user.name?.charAt(0)}
          </div>
          <div>
            <p className="text-xl font-bold text-white">{session.user.name}</p>
            <p className="text-base text-indigo-200 mt-0.5">
              {session.user.email}
            </p>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              アカウント
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">
                🔑
              </span>
              <p className="text-base font-medium text-gray-800">
                パスワードを変更する
              </p>
            </div>
            <span className="text-gray-300 text-lg">→</span>
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              通知
            </p>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-lg">
                🔔
              </span>
              <div>
                <p className="text-base font-medium text-gray-800">
                  プッシュ通知
                </p>
                <p className="text-sm text-gray-400">
                  緊急・お薬・チェックインの通知
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              法的情報
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <Link
              href="/privacy"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
                  🔒
                </span>
                <p className="text-base font-medium text-gray-800">
                  プライバシーポリシー
                </p>
              </div>
              <span className="text-gray-300 text-lg">→</span>
            </Link>
            <Link
              href="/terms"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg">
                  📄
                </span>
                <p className="text-base font-medium text-gray-800">利用規約</p>
              </div>
              <span className="text-gray-300 text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* App info */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              アプリ情報
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-lg">
                  ℹ️
                </span>
                <p className="text-base font-medium text-gray-800">
                  バージョン
                </p>
              </div>
              <span className="text-base text-gray-400">1.0.0</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-lg">
                  👨‍💻
                </span>
                <p className="text-base font-medium text-gray-800">開発者</p>
              </div>
              <span className="text-base text-gray-400">Saha Jewel Kumar</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-4 flex items-center gap-3">
            <span className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-lg">
              🚪
            </span>
            <LogoutButton />
          </div>
        </div>

        <p className="text-center text-sm text-gray-300">
          © 2026 Mimamori — ご家族をつなぐ
        </p>
      </div>

      <SideNav />
    </div>
  );
}
