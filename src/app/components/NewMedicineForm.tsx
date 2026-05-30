"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { SeniorBackLink } from "@/app/components/SeniorBackLink";

const frequencyOptions = [
  { value: "1日1回", label: "1日1回" },
  { value: "1日2回", label: "1日2回" },
  { value: "1日3回", label: "1日3回" },
  { value: "週1回", label: "週1回" },
  { value: "必要時", label: "必要時" },
];

const timeOptions = [
  { value: "朝食前", label: "朝食前" },
  { value: "朝食後", label: "朝食後" },
  { value: "昼食前", label: "昼食前" },
  { value: "食間", label: "食間" },
  { value: "昼食後", label: "昼食後" },
  { value: "夕食前", label: "夕食前" },
  { value: "夕食後", label: "夕食後" },
  { value: "就寝前", label: "就寝前" },
];

function getFrequencyCount(freq: string): number {
  if (freq === "1日1回") return 1;
  if (freq === "1日2回") return 2;
  if (freq === "1日3回") return 3;
  if (freq === "週1回") return 1;
  if (freq === "必要時") return 0;
  const match = freq.match(/1日(\d+)回/);
  if (match) return parseInt(match[1]);
  const weekMatch = freq.match(/週(\d+)回/);
  if (weekMatch) return parseInt(weekMatch[1]);
  const numMatch = freq.match(/^(\d+)$/);
  if (numMatch) return parseInt(numMatch[1]);
  return 0;
}

export function NewMedicineForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [customFrequency, setCustomFrequency] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [ongoing, setOngoing] = useState(true);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleTime(time: string) {
    setTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  }

  function getPreview() {
    if (!name) return "";
    const freq = frequency === "カスタム" ? customFrequency : frequency;
    const timeStr = times.length > 0 ? times.join("・") : "";
    const durationStr = ongoing ? "継続中" : duration ? `${duration}日間` : "";
    return `${name}を${freq}${timeStr ? `、${timeStr}` : ""}に服用${durationStr ? `（${durationStr}）` : ""}`;
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("お薬の名前を入力してください");
      return;
    }
    if (!frequency) {
      setError("服用頻度を選択してください");
      return;
    }
    if (times.length === 0) {
      setError("服用タイミングを選択してください");
      return;
    }

    const freqCount = getFrequencyCount(
      frequency === "カスタム" ? customFrequency : frequency,
    );
    if (freqCount > 0 && times.length !== freqCount) {
      setError(
        `服用頻度が${freqCount}回のため、タイミングも${freqCount}つ選択してください`,
      );
      return;
    }

    if (!ongoing && !duration) {
      setError("服用期間を入力してください");
      return;
    }

    setLoading(true);
    setError("");

    const endDate =
      !ongoing && duration
        ? new Date(
            new Date(startDate).getTime() +
              Number(duration) * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null;

    const res = await fetch(`/api/seniors/${id}/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        dosage: dosage || undefined,
        frequency: frequency === "カスタム" ? customFrequency : frequency,
        times,
        ongoing,
        startDate,
        endDate,
        duration: duration ? Number(duration) : undefined,
        notes: notes || undefined,
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <SeniorBackLink seniorId={id}></SeniorBackLink>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
            <p className="font-semibold text-gray-900">お薬を追加</p>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            お薬を追加
          </h1>
          <p className="text-base text-gray-400 mb-6">
            服用しているお薬の情報を入力してください
          </p>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                お薬の名前 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：アスピリン、降圧剤"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                用量
                <span className="text-sm text-gray-400 ml-2">任意</span>
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="例：100mg、1錠"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                服用頻度 <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {frequencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFrequency(opt.value)}
                    className={`py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                      frequency === opt.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => setFrequency("カスタム")}
                  className={`py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                    frequency === "カスタム"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  カスタム
                </button>
              </div>
              {frequency === "カスタム" && (
                <input
                  type="text"
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(e.target.value)}
                  placeholder="例：1日5回、隔日"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
            </div>

            {/* Timing */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                服用タイミング <span className="text-red-400">*</span>
                <span className="text-sm text-gray-400 ml-2">複数選択可</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleTime(opt.value)}
                    className={`py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                      times.includes(opt.value)
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                  >
                    {times.includes(opt.value) ? "✓ " : ""}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                服用期間 <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setOngoing(true)}
                  className={`py-4 text-sm rounded-xl border-2 transition-all text-left px-4 ${
                    ongoing
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <p className="font-semibold text-base">継続中</p>
                  <p className="text-sm opacity-70 mt-0.5">終わりなし</p>
                </button>
                <button
                  onClick={() => setOngoing(false)}
                  className={`py-4 text-sm rounded-xl border-2 transition-all text-left px-4 ${
                    !ongoing
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <p className="font-semibold text-base">期間を指定</p>
                  <p className="text-sm opacity-70 mt-0.5">日数を入力</p>
                </button>
              </div>

              {!ongoing && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1.5">
                      開始日
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1.5">
                      服用日数
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="例：15"
                        min={1}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <span className="text-base text-gray-500">日間</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[7, 14, 15, 30].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(String(d))}
                          className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                            duration === String(d)
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-gray-200 text-gray-500 hover:border-indigo-300"
                          }`}
                        >
                          {d}日
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor notes */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                医師からの指示・メモ
                <span className="text-sm text-gray-400 ml-2">任意</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="例：食後30分以内に服用、副作用に注意"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            {/* Preview */}
            {getPreview() && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <p className="text-sm text-indigo-400 mb-1">プレビュー</p>
                <p className="text-base text-indigo-700 font-medium">
                  {getPreview()}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-base text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-base font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
