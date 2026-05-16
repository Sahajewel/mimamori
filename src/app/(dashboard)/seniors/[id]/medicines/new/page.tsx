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
  { value: "食間", label: "食間" },
];

export default function NewMedicinePage() {
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

  // Preview text
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 block transition-colors"
        >
          ← 戻る
        </button>

        <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-1">
          お薬を追加
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          服用しているお薬の情報を入力してください
        </p>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              お薬の名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：アスピリン、降圧剤"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              用量
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="例：100mg、1錠"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              服用頻度 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {frequencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`py-2.5 text-sm rounded-lg border-2 transition-all font-medium ${
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
                className={`py-2.5 text-sm rounded-lg border-2 transition-all font-medium ${
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
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}
          </div>

          {/* Timing — multiple select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              服用タイミング <span className="text-red-400">*</span>
              <span className="text-xs text-gray-400 ml-2">複数選択可</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleTime(opt.value)}
                  className={`py-2.5 text-sm rounded-lg border-2 transition-all font-medium ${
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              服用期間 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => setOngoing(true)}
                className={`py-3 text-sm rounded-xl border-2 transition-all text-left px-4 ${
                  ongoing
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <p className="font-medium">継続中</p>
                <p className="text-xs opacity-70">終わりなし</p>
              </button>
              <button
                onClick={() => setOngoing(false)}
                className={`py-3 text-sm rounded-xl border-2 transition-all text-left px-4 ${
                  !ongoing
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <p className="font-medium">期間を指定</p>
                <p className="text-xs opacity-70">日数を入力</p>
              </button>
            </div>

            {!ongoing && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    開始日
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    服用日数
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="例：15"
                      min={1}
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-gray-500">日間</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[7, 14, 15, 30].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(String(d))}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              医師からの指示・メモ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="例：食後30分以内に服用、副作用に注意"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Preview */}
          {getPreview() && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <p className="text-xs text-indigo-400 mb-1">プレビュー</p>
              <p className="text-sm text-indigo-700 font-medium">
                {getPreview()}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
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
