"use client";

import { useState } from "react";

export function QuickLinkButton({ seniorId }: { seniorId: string }) {
  const [quickUrl, setQuickUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateLink() {
    setLoading(true);
    const res = await fetch(`/api/seniors/${seniorId}/quick-token`, {
      method: "POST",
    });
    const data = await res.json();
    setQuickUrl(data.quickUrl);
    setLoading(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(quickUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
      <p className="text-sm font-medium text-indigo-700 mb-1">
        ご本人用クイックリンク
      </p>
      <p className="text-xs text-indigo-500 mb-3">
        このリンクをご本人のスマホにブックマークしてもらうと、ログインなしで体調・お薬を記録できます
      </p>
      {!quickUrl ? (
        <button
          onClick={generateLink}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "生成中..." : "リンクを生成する"}
        </button>
      ) : (
        <div>
          <p className="text-xs text-gray-500 bg-white rounded-lg p-2 mb-2 break-all">
            {quickUrl}
          </p>
          <button
            onClick={copyLink}
            className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {copied ? "コピーしました！✓" : "リンクをコピー"}
          </button>
        </div>
      )}
    </div>
  );
}
