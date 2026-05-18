"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PER_PAGE = 10;

type Reminder = { id: string; time: string };
type Log = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  takenAt: string | null;
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
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
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

        {/* Log history - Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-medium text-gray-900">
              服薬履歴
              {totalCount > 0 && (
                <span className="text-xs text-gray-400 ml-2">
                  全{totalCount}件
                </span>
              )}
            </h2>
          </div>

          {logs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              まだ記録がありません
            </p>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-gray-50 text-xs text-gray-400 font-medium">
                <span>日付・時間</span>
                <span>タイミング</span>
                <span>状態</span>
                <span>記録者</span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-gray-50">
                {paginatedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-4 gap-2 px-4 py-3 items-center"
                  >
                    {/* 日付・時間 */}
                    <div>
                      <p className="text-xs text-gray-700">
                        {new Date(log.createdAt).toLocaleDateString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleTimeString("ja-JP", {
                          timeZone: "Asia/Tokyo",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* タイミング */}
                    <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full text-center">
                      {log.reminder.time}
                    </span>

                    {/* 状態 */}
                    <span
                      className={`text-xs font-medium ${
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

                    {/* 記録者 */}
                    <span className="text-xs text-gray-500">
                      {log.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← 前へ
              </button>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    p === currentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                次へ →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
