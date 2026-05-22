import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/app/components/LogoutButton";
import { SideNav } from "@/app/components/SideNav";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-base">♡</span>
            </div>
            <p className="font-semibold text-gray-900">Mimamori</p>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">設定</h1>

        {/* Profile */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              プロフィール
            </p>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-2xl">
                {session.user.name?.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-sm text-gray-400">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              アカウント
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <Link
              href="/forgot-password"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔑</span>
                <p className="text-sm font-medium text-gray-700">
                  パスワードを変更する
                </p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              通知
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    プッシュ通知
                  </p>
                  <p className="text-xs text-gray-400">
                    緊急・お薬・チェックインの通知
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              法的情報
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <Link
              href="/privacy"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <p className="text-sm font-medium text-gray-700">
                  プライバシーポリシー
                </p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
            <Link
              href="/terms"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <p className="text-sm font-medium text-gray-700">利用規約</p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          </div>
        </div>

        {/* App info */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              アプリ情報
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">ℹ️</span>
                <p className="text-sm font-medium text-gray-700">バージョン</p>
              </div>
              <span className="text-sm text-gray-400">1.0.0</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">👨‍💻</span>
                <p className="text-sm font-medium text-gray-700">開発者</p>
              </div>
              <span className="text-sm text-gray-400">Saha Jewel Kumar</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚪</span>
              <LogoutButton />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          © 2026 Mimamori — ご家族をつなぐ
        </p>
      </div>

      {/* Bottom Nav */}
      <SideNav />
    </div>
  );
}
