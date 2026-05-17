"use client";

import { useState } from "react";

export function NotificationButton() {
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    setStatus(permission === "granted" ? "granted" : "denied");
  }

  if (status === "granted") {
    return (
      <p className="text-xs text-green-500 text-center py-2">
        ✓ 通知が許可されました
      </p>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
    >
      🔔 通知を許可する
    </button>
  );
}
