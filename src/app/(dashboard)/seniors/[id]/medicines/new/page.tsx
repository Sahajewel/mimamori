"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

const frequencyOptions = [
  { value: "1日1回", label: "1日1回" },
  { value: "1日2回", label: "1日2回" },
  { value: "1日3回", label: "1日3回" },
  { value: "週1回", label: "週1回" },
  { value: "必要時", label: "必要時" },
];

const timeOptions = [
  { value: "朝食後", label: "朝食後" },
  { value: "昼食後", label: "昼食後" },
  { value: "夕食後", label: "夕食後" },
  { value: "就寝前", label: "就寝前" },
  { value: "朝食前", label: "朝食前" },
];

export default function NewMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !frequency || !time) {
      setError("必須項目を入力してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/seniors/${id}/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        dosage: dosage || undefined,
        frequency,
        time,
      }),
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
            お薬を追加
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            服用しているお薬の情報を入力してください
          </p>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              お薬の名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：アスピリン"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              用量
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="例：100mg"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              服用頻度 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {frequencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`py-2 text-sm rounded-lg border transition-all ${
                    frequency === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              服用タイミング <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTime(opt.value)}
                  className={`py-2 text-sm rounded-lg border transition-all ${
                    time === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
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
            disabled={loading || !name.trim() || !frequency || !time}
            className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
