"use client";

import { TIMING_MAP } from "@/lib/timingMap";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Reminder = { id: string; time: string };
type Medicine = {
  id: string;
  name: string;
  dosage: string | null;
  reminders: Reminder[];
};
type TodayLog = {
  reminderId: string;
  status: string;
};
type Data = {
  name: string;
  medicines: Medicine[];
  todayLogs: TodayLog[];
  todayCheckIn: { status: string } | null;
};

function isReminderActive(time: string): boolean {
  const japanTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const hour = japanTime.getHours();
  const timing = TIMING_MAP[time];
  if (!timing) return true;
  return hour >= timing.start && hour < timing.end;
}

function isReminderUpcoming(time: string): boolean {
  const japanTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const hour = japanTime.getHours();
  const timing = TIMING_MAP[time];
  if (!timing) return false;
  return hour < timing.start;
}

function getTimeLabel(time: string): string {
  const timing = TIMING_MAP[time];
  if (!timing) return "";
  return `${timing.start}:00〜${timing.end}:00`;
}

function getGreeting() {
  const japanTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const hour = japanTime.getHours();
  if (hour >= 5 && hour < 11) return "おはようございます 🌅";
  if (hour >= 11 && hour < 17) return "こんにちは ☀️";
  return "こんばんは 🌙";
}

function getStatusInfo(status: string) {
  if (status === "OK")
    return {
      label: "✓ 元気です",
      light: "bg-green-50 border-green-200 text-green-700",
    };
  if (status === "CONCERN")
    return {
      label: "⚠ 少し気になります",
      light: "bg-amber-50 border-amber-200 text-amber-700",
    };
  return {
    label: "🚨 助けてください",
    light: "bg-red-50 border-red-200 text-red-700",
  };
}

export default function QuickPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<Data | null>(null);
  const [doneReminders, setDoneReminders] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [checkedInStatus, setCheckedInStatus] = useState<string | null>(null);
  const [showChangeCheckIn, setShowChangeCheckIn] = useState(false);
  const [doneStatuses, setDoneStatuses] = useState<Record<string, string>>({});
  useEffect(() => {
    // data আনার function
    function loadData() {
      fetch(`/api/quick/${token}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          setData(d);
          const done = new Set<string>(
            d.todayLogs
              .filter(
                (l: TodayLog) => l.status === "TAKEN" || l.status === "MISSED",
              )
              .map((l: TodayLog) => l.reminderId),
          );
          setDoneReminders(done);
          const statuses: Record<string, string> = {};
          d.todayLogs.forEach((l: TodayLog) => {
            if (l.status === "TAKEN" || l.status === "MISSED") {
              statuses[l.reminderId] = l.status;
            }
          });
          setDoneStatuses(statuses);
          if (d.todayCheckIn) setCheckedInStatus(d.todayCheckIn.status);
        });
    }

    loadData(); // প্রথমবার

    // পেজ আবার সামনে এলে (PWA খুললে) fresh data
    function handleVisible() {
      if (!document.hidden) loadData();
    }
    document.addEventListener("visibilitychange", handleVisible);

    return () =>
      document.removeEventListener("visibilitychange", handleVisible);
  }, [token]);

  async function handleCheckIn(status: string) {
    setLoadingId(`checkin-${status}`);
    await fetch(`/api/quick/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "checkin", status }),
    });
    setCheckedInStatus(status);
    setShowChangeCheckIn(false);
    setLoadingId(null);
  }

  async function handleMedicine(
    medicineId: string,
    reminderId: string,
    status: string,
  ) {
    // Optimistic update
    setDoneReminders((prev) => new Set([...prev, reminderId]));
    setDoneStatuses((prev) => ({ ...prev, [reminderId]: status }));
    setLoadingId(`${reminderId}-${status}`);
    await fetch(`/api/quick/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "medicine",
        medicineId,
        reminderId,
        status,
      }),
    });
    setLoadingId(null);
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  const allMedicinesDone =
    data.medicines.length === 0 ||
    data.medicines.every((m) =>
      m.reminders.every((r) => {
        // active time でない reminder は skip
        if (!isReminderActive(r.time) && isReminderUpcoming(r.time))
          return true;
        return doneReminders.has(r.id);
      }),
    );

  const allDone = checkedInStatus !== null && allMedicinesDone;
  const statusInfo = checkedInStatus ? getStatusInfo(checkedInStatus) : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white px-4 py-8">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <div className="text-center pb-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl text-white">
            ♡
          </div>
          <p className="text-lg text-indigo-400">{getGreeting()}</p>
          <h1 className="text-2xl font-medium text-gray-900 mt-1">
            {data.name}さん
          </h1>
        </div>

        {/* All done */}
        {allDone && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">🌸</p>
            <p className="text-base font-medium text-green-700">
              今日もお疲れ様でした！
            </p>
            <p className="text-xs text-green-500 mt-1">ご家族に伝わりました</p>
          </div>
        )}

        {/* CheckIn */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-400 text-center mb-3">
            今日の体調
          </p>

          {checkedInStatus && !showChangeCheckIn ? (
            <div>
              <div
                className={`rounded-xl p-4 text-center border ${statusInfo?.light}`}
              >
                <p className="text-lg font-medium">{statusInfo?.label}</p>
                <p className="text-xs mt-1 opacity-60">チェックイン済み</p>
              </div>
              <button
                onClick={() => setShowChangeCheckIn(true)}
                className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                体調が変わった場合は変更する →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {showChangeCheckIn && (
                <p className="text-sm text-center text-gray-400 mb-2">
                  体調を更新してください
                </p>
              )}
              <button
                onClick={() => handleCheckIn("OK")}
                disabled={loadingId !== null}
                className="w-full py-5 bg-green-500 text-white text-xl font-medium rounded-2xl hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
              >
                ✓ 元気です
              </button>
              <button
                onClick={() => handleCheckIn("CONCERN")}
                disabled={loadingId !== null}
                className="w-full py-5 bg-amber-400 text-white text-xl font-medium rounded-2xl hover:bg-amber-500 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
              >
                ⚠ 少し気になります
              </button>
              <button
                onClick={() => handleCheckIn("EMERGENCY")}
                disabled={loadingId !== null}
                className="w-full py-5 bg-red-500 text-white text-xl font-medium rounded-2xl hover:bg-red-600 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
              >
                🚨 助けてください
              </button>
              {showChangeCheckIn && (
                <button
                  onClick={() => setShowChangeCheckIn(false)}
                  className="w-full py-2 text-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              )}
            </div>
          )}
        </div>

        {/* Medicine */}
        {data.medicines.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600 text-center mb-4">
              お薬の記録
            </p>
            <div className="space-y-4">
              {data.medicines.map((medicine) => (
                <div key={medicine.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">💊</span>
                    <p className="text-2xl font-medium text-gray-800">
                      {medicine.name}
                      {medicine.dosage && (
                        <span className="text-sm text-gray-600 ml-1">
                          {medicine.dosage}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-2 pl-6">
                    {medicine.reminders.map((reminder) => {
                      const isDone = doneReminders.has(reminder.id);
                      const active = isReminderActive(reminder.time);
                      const upcoming = isReminderUpcoming(reminder.time);

                      const isLoading =
                        loadingId === `${reminder.id}-TAKEN` ||
                        loadingId === `${reminder.id}-MISSED`;

                      return (
                        <div key={reminder.id}>
                          <p className="text-base font-medium text-gray-600 mb-1">
                            {reminder.time}
                            <span className="text-gray-600 ml-1">
                              {getTimeLabel(reminder.time)}
                            </span>
                          </p>

                          {/* Done */}
                          {isDone ? (
                            <div
                              className={`rounded-xl py-2.5 text-center text-base font-medium ${
                                doneStatuses[reminder.id] === "MISSED"
                                  ? "bg-gray-50 text-gray-400 border border-gray-100"
                                  : "bg-green-50 text-green-600 border border-green-100"
                              }`}
                            >
                              {doneStatuses[reminder.id] === "MISSED"
                                ? "✗ 飲めませんでした"
                                : "✓ 飲みました"}
                            </div>
                          ) : /* Upcoming — not yet time */
                          upcoming ? (
                            <div className="rounded-xl py-4 text-center bg-gray-50 border border-gray-100">
                              <p className="text-base text-gray-400">
                                🔒 {getTimeLabel(reminder.time)}から
                              </p>
                            </div>
                          ) : /* Past — missed */
                          !active && !upcoming ? (
                            <div className="rounded-xl py-4 text-center bg-red-50 border border-red-100">
                              <p className="text-base text-red-400">
                                ✗ 時間が過ぎました
                              </p>
                            </div>
                          ) : (
                            /* Active — show buttons */
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() =>
                                  handleMedicine(
                                    medicine.id,
                                    reminder.id,
                                    "TAKEN",
                                  )
                                }
                                disabled={isLoading || isDone}
                                className="py-5 bg-green-500 text-white text-lg font-medium rounded-2xl hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95"
                              >
                                ✓ 飲んだ
                              </button>
                              <button
                                onClick={() =>
                                  handleMedicine(
                                    medicine.id,
                                    reminder.id,
                                    "MISSED",
                                  )
                                }
                                disabled={isLoading || isDone}
                                className="py-3.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all active:scale-95"
                              >
                                ✗ 飲めなかった
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 pb-4">
          Mimamori — ご家族をつなぐ
        </p>
      </div>
    </div>
  );
}
