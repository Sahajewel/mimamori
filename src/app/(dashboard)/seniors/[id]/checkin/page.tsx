"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/app/components/BackButton";

const statusOptions = [
  {
    value: "OK",
    label: "良好",
    desc: "今日は元気です",
    color: "border-green-200 bg-green-50 text-green-700",
    activeColor: "border-green-500 bg-green-100 text-green-800",
    icon: "✓",
  },
  {
    value: "CONCERN",
    label: "要確認",
    desc: "少し気になることがある",
    color: "border-amber-200 bg-amber-50 text-amber-700",
    activeColor: "border-amber-500 bg-amber-100 text-amber-800",
    icon: "⚠",
  },
  {
    value: "EMERGENCY",
    label: "緊急",
    desc: "すぐに確認が必要",
    color: "border-red-200 bg-red-50 text-red-700",
    activeColor: "border-red-500 bg-red-100 text-red-800",
    icon: "🚨",
  },
];

export default function CheckInPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [selected, setSelected] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!selected) {
      setError("状態を選択してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/seniors/${id}/checkins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selected, note: note || undefined }),
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
          <BackButton />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">チェックイン</p>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">
              チェックイン
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              今日の状態を教えてください
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelected(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  selected === option.value
                    ? option.activeColor + " border-2"
                    : option.color + " border"
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs opacity-70">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              メモ（任意）
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="気になることがあれば書いてください"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
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
              disabled={loading || !selected}
              className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "送信中..." : "送信する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
