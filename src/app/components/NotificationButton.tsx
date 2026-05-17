"use client";

import { useState, useEffect } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendToServer(subscription: PushSubscription) {
  const key = subscription.getKey("p256dh");
  const auth = subscription.getKey("auth");

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
      auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
    }),
  });
}

export function NotificationButton() {
  const [status, setStatus] = useState<
    "idle" | "granted" | "denied" | "loading"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkExisting() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("idle");
        return;
      }

      const permission = Notification.permission;
      if (permission === "denied") {
        setStatus("denied");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          await sendToServer(existing);
          setStatus("granted");
        } else {
          setStatus("idle");
        }
      } catch {
        setStatus("idle");
      }
    }

    checkExisting();
  }, []);

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("denied");
        setMessage("通知が拒否されました");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      await sendToServer(subscription);
      setStatus("granted");
      setMessage("通知の設定が完了しました ✓");
    } catch (error) {
      console.error(error);
      setMessage("エラーが発生しました");
    }
  }

  if (status === "loading") return null;

  if (status === "granted") {
    return (
      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 text-center">
        <p className="text-sm text-green-600">✓ 通知が設定済みです</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-center">
        <p className="text-sm text-red-500">
          通知が拒否されています。設定から許可してください
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={requestPermission}
        className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
      >
        🔔 通知を許可する
      </button>
      {message && (
        <p className="text-xs text-red-500 mt-1 text-center">{message}</p>
      )}
    </div>
  );
}
