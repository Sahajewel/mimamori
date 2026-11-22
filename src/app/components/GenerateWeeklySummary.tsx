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

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Failed");
      }

      // 👇 স্ট্রিম পড়ার লজিক
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullText += decoder.decode(value, { stream: true });
          setSummary(fullText); // লাইভ টেক্সট স্ক্রিনে দেখাবে
        }
      }
    } catch (e: any) {
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
