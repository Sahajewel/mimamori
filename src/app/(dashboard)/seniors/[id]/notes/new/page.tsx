"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/app/components/BackButton";
import Link from "next/link";
import { SeniorBackLink } from "@/app/components/SeniorBackLink";

export default function NewCareNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!content.trim()) {
      setError("内容を入力してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/seniors/${id}/carenotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }

    router.push(`/seniors/${id}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id}></SeniorBackLink>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">ケアノート</p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              ケアノート
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              気になることをメモしておきましょう
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="例：今日は食欲がなさそうだった。明日また確認する。"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-300 mt-1 text-right">
              {content.length} / 1000
            </p>
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
              disabled={loading || !content.trim()}
              className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
