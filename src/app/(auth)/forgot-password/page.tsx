"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-indigo-600 text-lg">♡</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">
            パスワードをお忘れですか？
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            登録したメールアドレスを入力してください
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-6">
              <p className="text-2xl mb-2">📧</p>
              <p className="text-sm font-medium text-green-700 mb-1">
                メールを送信しました
              </p>
              <p className="text-xs text-green-500">
                {email}にリセットリンクを送りました。 メールをご確認ください。
              </p>
            </div>
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              ← ログインに戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例：tanaka@example.com"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "送信中..." : "リセットリンクを送る"}
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link href="/login" className="text-indigo-600 hover:underline">
                ← ログインに戻る
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
