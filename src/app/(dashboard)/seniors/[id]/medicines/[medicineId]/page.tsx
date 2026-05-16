"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

type Reminder = { id: string; time: string };
type Log = {
  id: string;
  status: string;
  note: string | null;
  takenAt: string | null;
  createdAt: string;
  user: { name: string };
  reminder: { time: string };
};
type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  reminders: Reminder[];
};

const statusOptions = [
  {
    value: "TAKEN",
    label: "飲んだ",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: "✓",
  },
  {
    value: "MISSED",
    label: "飲めなかった",
    color: "border-red-400 bg-red-50 text-red-600",
    icon: "✗",
  },
  {
    value: "SKIPPED",
    label: "スキップ",
    color: "border-gray-300 bg-gray-50 text-gray-500",
    icon: "−",
  },
];

export default function MedicineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const medicineId = params.medicineId as string;

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedReminder, setSelectedReminder] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    const [medRes, logRes] = await Promise.all([
      fetch(`/api/seniors/${id}/medicines/${medicineId}`),
      fetch(`/api/seniors/${id}/medicines/${medicineId}/logs`),
    ]);
    const medData = await medRes.json();
    const logData = await logRes.json();
    setMedicine(medData);
    setLogs(logData);
  }, [id, medicineId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const [medRes, logRes] = await Promise.all([
        fetch(`/api/seniors/${id}/medicines/${medicineId}`),
        fetch(`/api/seniors/${id}/medicines/${medicineId}/logs`),
      ]);
      const medData = await medRes.json();
      const logData = await logRes.json();

      if (!ignore) {
        setMedicine(medData);
        setLogs(logData);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [id, medicineId]);

  async function handleSubmit() {
    if (!selectedReminder || !selectedStatus) {
      setError("服用タイミングと状態を選択してください");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/seniors/${id}/medicines/${medicineId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reminderId: selectedReminder,
        status: selectedStatus,
        note: note || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "エラーが発生しました");
      setLoading(false);
      return;
    }

    setSelectedReminder("");
    setSelectedStatus("");
    setNote("");
    setLoading(false);
    const [medRes, logRes] = await Promise.all([
      fetch(`/api/seniors/${id}/medicines/${medicineId}`),
      fetch(`/api/seniors/${id}/medicines/${medicineId}/logs`),
    ]);
    const medData = await medRes.json();
    const logData = await logRes.json();
    setMedicine(medData);
    setLogs(logData);
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 block transition-colors"
        >
          ← 戻る
        </button>

        {/* Medicine info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-lg">
              💊
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                {medicine.name}
              </h1>
              <p className="text-xs text-gray-400">
                {medicine.dosage && `${medicine.dosage} · `}
                {medicine.frequency}
              </p>
            </div>
          </div>
        </div>

        {/* Log form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            服薬を記録する
          </h2>

          {/* Reminder select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              服用タイミング
            </label>
            <div className="grid grid-cols-2 gap-2">
              {medicine.reminders.map((reminder) => (
                <button
                  key={reminder.id}
                  onClick={() => setSelectedReminder(reminder.id)}
                  className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                    selectedReminder === reminder.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {reminder.time}
                </button>
              ))}
            </div>
          </div>

          {/* Status select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状態
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                    selectedStatus === opt.value
                      ? opt.color
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <span className="block text-lg">{opt.icon}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              メモ（任意）
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="気になることがあれば"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedReminder || !selectedStatus}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "記録中..." : "記録する"}
          </button>
        </div>

        {/* Log history */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">服薬履歴</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              まだ記録がありません
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        log.status === "TAKEN"
                          ? "text-green-500"
                          : log.status === "MISSED"
                            ? "text-red-500"
                            : "text-gray-400"
                      }`}
                    >
                      {log.status === "TAKEN"
                        ? "✓ 飲んだ"
                        : log.status === "MISSED"
                          ? "✗ 飲めなかった"
                          : "− スキップ"}
                    </span>
                    {log.note && (
                      <span className="text-xs text-gray-400">{log.note}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{log.reminder.time}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(log.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
