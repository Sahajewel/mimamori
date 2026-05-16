"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 block transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-xl md:text-2xl font-medium text-gray-900">
            家族を招待する
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            招待リンクをメールで送ってください
          </p>
        </div>

        {!inviteUrl ? (
          <>
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例：hanako@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  権限
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRole("EDITOR")}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      role === "EDITOR"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">編集者</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      チェックイン・ノート・お薬を追加できる
                    </p>
                  </button>
                  <button
                    onClick={() => setRole("VIEWER")}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      role === "VIEWER"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">閲覧者</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      情報を見るだけ
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "作成中..." : "招待リンクを作成"}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-green-700 mb-1">
                招待リンクを作成しました！
              </p>
              <p className="text-xs text-green-600">
                このリンクは7日間有効です
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-2">招待リンク</p>
              <p className="text-sm text-gray-700 break-all">{inviteUrl}</p>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-3"
            >
              リンクをコピー
            </button>

            <button
              onClick={() => router.push(`/seniors/${id}`)}
              className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
