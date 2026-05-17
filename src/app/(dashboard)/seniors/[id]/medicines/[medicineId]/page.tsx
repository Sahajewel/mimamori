"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Reminder = { id: string; time: string };
type Log = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  user: { name: string };
  reminder: { time: string };
};
type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  ongoing: boolean;
  startDate: string;
  endDate: string | null;
  duration: number | null;
  notes: string | null;
  reminders: Reminder[];
};

export default function MedicineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const medicineId = params.medicineId as string;

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

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

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">読み込み中...</p>
      </div>
    );
  }

  const startDate = new Date(medicine.startDate).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const endDate = medicine.endDate
    ? new Date(medicine.endDate).toLocaleDateString("ja-JP", {
        timeZone: "Asia/Tokyo",
      })
    : null;

  const takenCount = logs.filter((l) => l.status === "TAKEN").length;
  const missedCount = logs.filter((l) => l.status === "MISSED").length;
  const totalCount = logs.length;

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
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
              💊
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                {medicine.name}
              </h1>
              {medicine.dosage && (
                <p className="text-sm text-gray-400">{medicine.dosage}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-50 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">服用頻度</span>
              <span className="text-sm font-medium text-gray-700">
                {medicine.frequency}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-400">服用タイミング</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {medicine.reminders.map((r) => (
                  <span
                    key={r.id}
                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                  >
                    {r.time}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">服用期間</span>
              <span className="text-sm font-medium text-gray-700">
                {medicine.ongoing
                  ? "継続中"
                  : medicine.duration
                    ? `${medicine.duration}日間`
                    : "期間指定"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">開始日</span>
              <span className="text-sm text-gray-700">{startDate}</span>
            </div>

            {endDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">終了日</span>
                <span className="text-sm text-gray-700">{endDate}</span>
              </div>
            )}

            {medicine.notes && (
              <div className="pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1">医師からの指示</p>
                <p className="text-sm text-gray-600 bg-amber-50 rounded-lg p-3">
                  {medicine.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
              <p className="text-xl font-medium text-green-500">{takenCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">飲んだ</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
              <p className="text-xl font-medium text-red-400">{missedCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">飲めなかった</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
              <p className="text-xl font-medium text-gray-500">{totalCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">合計</p>
            </div>
          </div>
        )}

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
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        log.status === "TAKEN"
                          ? "text-green-500"
                          : log.status === "MISSED"
                            ? "text-red-400"
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
                      <p className="text-xs text-gray-400 mt-0.5">{log.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
                      {log.reminder.time}
                    </p>
                    <p className="text-xs text-gray-300">
                      {log.user.name} ·{" "}
                      {new Date(log.createdAt).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                      })}
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
