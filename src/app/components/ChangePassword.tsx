"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SideNav } from "@/app/components/SideNav";

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit() {
    setError(null);

    // frontend যাচাই (backend-ও যাচাই করে, এটা শুধু UX)
    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上で入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // ২ সেকেন্ড পর settings-এ ফেরত
      setTimeout(() => router.push("/settings"), 2000);
    } catch {
      setError("エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 text-indigo-600 hover:underline transition-colors text-sm font-medium"
          >
            <span className="text-lg">←</span>
            <span>戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900 hidden sm:block">
              パスワード変更
            </p>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            パスワードを変更
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            安全のため、現在のパスワードを入力してください
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">✓</p>
              <p className="text-sm font-medium text-green-700">
                パスワードを変更しました
              </p>
              <p className="text-xs text-green-500 mt-1">
                設定ページに戻ります...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 現在のパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  現在のパスワード
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    {showCurrent ? "非表示" : "表示"}
                  </button>
                </div>
              </div>

              {/* 新しいパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  新しいパスワード
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8文字以上"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    {showNew ? "非表示" : "表示"}
                  </button>
                </div>
              </div>

              {/* 新しいパスワード（確認） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  新しいパスワード（確認）
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                  >
                    {showConfirm ? "非表示" : "表示"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-700 active:opacity-60 disabled:opacity-50 transition-all"
              >
                {loading ? "変更中..." : "パスワードを変更する"}
              </button>

              {/* password ভুলে গেলে — forgot password-এ পাঠাও */}
              <div className="text-center pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-400 hover:underline"
                >
                  現在のパスワードを忘れた場合
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <SideNav />
    </div>
  );
}
