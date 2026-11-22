/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function GenerateWeeklySummary({
  seniorId,
}: {
  seniorId: string;
}) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function generate() {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seniorId, type: "care-notes" }),
      });

      // 👇 আগে টেক্সট হিসেবে রেসপন্সটা পড়ি
      const textResponse = await res.text();

      if (!res.ok) {
        let errorMessage = "Failed to generate summary";
        try {
          // চেষ্টা করি এটা JSON কি না
          const data = JSON.parse(textResponse);
          errorMessage = data.error || errorMessage;
        } catch {
          // যদি JSON না হয়, তবে পুরো টেক্সটটাই এরর মেসেজ হিসেবে দেখাই
          errorMessage = textResponse;
        }
        throw new Error(errorMessage);
      }

      // সফল হলে টেক্সটটাই সামারি হিসেবে সেট করি
      setSummary(textResponse);
    } catch (e: any) {
      // এবার আসল এররটা UI-তে দেখাবে
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-3">
      <button
        onClick={generate}
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "生成中…" : "週間ケアノート要約を生成"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {summary && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="whitespace-pre-wrap text-sm">{summary}</p>
          <p className="mt-2 text-xs text-gray-500">
            ※ AI生成の下書きです。内容を確認してから家族と共有してください。
          </p>
          <div className="mt-3 flex gap-2">
            <button className="text-sm px-3 py-1 border rounded">
              下書き保存
            </button>
            <button className="text-sm px-3 bg-emerald-600 text-white rounded">
              確認済みにする
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
