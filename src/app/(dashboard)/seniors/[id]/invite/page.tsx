"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/app/components/BackButton";
import Link from "next/link";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  async function handleSubmit() {
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/seniors/${id}/invitations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }
    setInviteUrl(data.inviteUrl);
    setLoading(false);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(inviteUrl);
    alert("コピーしました！");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id}></SeniorBackLink>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">家族を招待する</p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!inviteUrl ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  家族を招待する
                </h1>
                <p className="text-base text-gray-400 mt-1">
                  招待リンクをメールで送ってください
                </p>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">
                    メールアドレス <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="例：hanako@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    権限
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRole("EDITOR")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === "EDITOR"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-base font-semibold text-gray-900">
                        編集者
                      </p>
                      <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                        チェックイン・ノート・お薬を追加できる
                      </p>
                    </button>
                    <button
                      onClick={() => setRole("VIEWER")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === "VIEWER"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-base font-semibold text-gray-900">
                        閲覧者
                      </p>
                      <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                        情報を見るだけ
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                  <p className="text-base text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  className="flex-1 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? "作成中..." : "招待リンクを作成"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  招待リンクを作成しました！
                </h2>
                <p className="text-base text-gray-400">
                  このリンクは7日間有効です
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <p className="text-sm text-gray-400 mb-2 font-medium">
                  招待リンク
                </p>
                <p className="text-base text-gray-700 break-all leading-relaxed">
                  {inviteUrl}
                </p>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors mb-3 shadow-sm"
              >
                📋 リンクをコピー
              </button>
              <button
                onClick={() => router.push(`/seniors/${id}`)}
                className="w-full py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← 戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
