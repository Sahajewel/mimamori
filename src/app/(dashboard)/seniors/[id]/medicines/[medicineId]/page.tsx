"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BackButton } from "@/app/components/BackButton";

type Reminder = { id: string; time: string };
type Log = {
  id: string;
  date: string;
  reminderId: string;
  reminderTime: string;
  status: string;
  note: string | null;
  createdAt: string;
  userName: string | null;
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
  active: boolean;
  reminders: Reminder[];
};

export default function MedicineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const medicineId = params.medicineId as string;

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [showStop, setShowStop] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [stopping, setStopping] = useState(false);

  // Edit state
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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
        setEditName(medData.name || "");
        setEditDosage(medData.dosage || "");
        setEditNotes(medData.notes || "");
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id, medicineId]);

  async function handleStop() {
    setStopping(true);
    await fetch(`/api/seniors/${id}/medicines/${medicineId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    router.push(`/seniors/${id}`);
    router.refresh();
  }

  async function handleEdit() {
    if (!editName.trim()) return;
    setEditLoading(true);
    await fetch(`/api/seniors/${id}/medicines/${medicineId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        dosage: editDosage || null,
        notes: editNotes || null,
      }),
    });
    setEditLoading(false);
    setShowEdit(false);
    // Reload
    const res = await fetch(`/api/seniors/${id}/medicines/${medicineId}`);
    const data = await res.json();
    setMedicine(data);
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-base text-gray-400">読み込み中...</p>
        </div>
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
  const recordedCount = logs.filter(
    (l) => l.status === "TAKEN" || l.status === "MISSED",
  ).length;
  const adherenceRate =
    recordedCount > 0 ? Math.round((takenCount / recordedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-5">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              お薬を編集
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  お薬の名前 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  用量
                </label>
                <input
                  type="text"
                  value={editDosage}
                  onChange={(e) => setEditDosage(e.target.value)}
                  placeholder="例：100mg、1錠"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  医師からの指示
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setShowEdit(false)}
                className="py-3 border border-gray-200 rounded-xl text-base font-medium text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleEdit}
                disabled={editLoading || !editName.trim()}
                className="py-3 bg-indigo-600 text-white rounded-xl text-base font-semibold disabled:opacity-50"
              >
                {editLoading ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Modal */}
      {showStop && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm mb-4 p-5">
            <p className="text-lg font-semibold text-gray-900 mb-2 text-center">
              使用中止にしますか？
            </p>
            <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
              服薬履歴は保存されます
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowStop(false)}
                className="py-3 border border-gray-200 rounded-xl text-base font-medium text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleStop}
                disabled={stopping}
                className="py-3 bg-red-500 text-white rounded-xl text-base font-semibold disabled:opacity-50"
              >
                {stopping ? "処理中..." : "中止する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 pl-16">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm">♡</span>
              </div>
              <p className="font-semibold text-gray-900 hidden sm:block">
                お薬詳細
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="text-sm text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            ✏️ 編集
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Medicine info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl">
              💊
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {medicine.name}
              </h1>
              {medicine.dosage && (
                <p className="text-base text-gray-400">{medicine.dosage}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-50 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">服用頻度</span>
              <span className="text-base font-semibold text-gray-700">
                {medicine.frequency}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-base text-gray-400">服用タイミング</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {medicine.reminders.map((r) => (
                  <span
                    key={r.id}
                    className="text-sm bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium"
                  >
                    {r.time}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">服用期間</span>
              <span className="text-base font-semibold text-gray-700">
                {medicine.ongoing
                  ? "継続中"
                  : medicine.duration
                    ? `${medicine.duration}日間`
                    : "期間指定"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">開始日</span>
              <span className="text-base text-gray-700">{startDate}</span>
            </div>
            {endDate && (
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-400">終了日</span>
                <span className="text-base text-gray-700">{endDate}</span>
              </div>
            )}
            {medicine.notes && (
              <div className="pt-2 border-t border-gray-50">
                <p className="text-sm text-gray-400 mb-2">医師からの指示</p>
                <p className="text-base text-gray-600 bg-amber-50 rounded-xl p-4 leading-relaxed">
                  {medicine.notes}
                </p>
              </div>
            )}
          </div>

          {/* Stop button */}
          {medicine.active && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowStop(true)}
                className="text-sm text-red-400 hover:text-red-600 transition-colors"
              >
                🚫 この薬を使用中止にする
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-green-500">
                {takenCount}
              </p>
              <p className="text-sm text-gray-400 mt-1">飲んだ</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-red-400">
                {missedCount}
              </p>
              <p className="text-sm text-gray-400 mt-1">飲めなかった</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-semibold text-gray-500">
                {totalCount}
              </p>
              <p className="text-sm text-gray-400 mt-1">合計</p>
            </div>
            <div
              className={`border rounded-xl p-3 text-center shadow-sm ${
                adherenceRate >= 80
                  ? "bg-green-50 border-green-100"
                  : adherenceRate >= 60
                    ? "bg-amber-50 border-amber-100"
                    : "bg-red-50 border-red-100"
              }`}
            >
              <p
                className={`text-2xl font-semibold ${
                  adherenceRate >= 80
                    ? "text-green-500"
                    : adherenceRate >= 60
                      ? "text-amber-500"
                      : "text-red-400"
                }`}
              >
                {adherenceRate}%
              </p>
              <p className="text-sm text-gray-400 mt-1">服薬率</p>
            </div>
          </div>
        )}

        {/* Log history */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              服薬履歴
              {totalCount > 0 && (
                <span className="text-sm text-gray-400 ml-2 font-normal">
                  全{totalCount}件
                </span>
              )}
            </h2>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">💊</p>
              <p className="text-base text-gray-400">まだ記録がありません</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-gray-50 text-sm text-gray-400 font-medium">
                <span>日付</span>
                <span>タイミング</span>
                <span>状態</span>
                <span>記録者</span>
              </div>

              <div className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-4 gap-2 px-5 py-3 items-center"
                  >
                    <p className="text-sm text-gray-700">
                      {new Date(log.date).toLocaleDateString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    <span className="text-sm bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full text-center">
                      {log.reminderTime}
                    </span>

                    <span
                      className={`text-sm font-medium ${
                        log.status === "TAKEN"
                          ? "text-green-500"
                          : log.status === "MISSED"
                            ? "text-red-400"
                            : log.status === "SKIPPED"
                              ? "text-gray-400"
                              : "text-gray-300"
                      }`}
                    >
                      {log.status === "TAKEN"
                        ? "✓ 飲んだ"
                        : log.status === "MISSED"
                          ? "✗ 飲めなかった"
                          : log.status === "SKIPPED"
                            ? "− スキップ"
                            : "− 記録なし"}
                    </span>

                    <span className="text-sm text-gray-500">
                      {log.userName || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
