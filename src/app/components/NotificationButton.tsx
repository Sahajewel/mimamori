"use client";

import { useEffect } from "react";

export function NotificationButton() {
  useEffect(() => {
    async function subscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const existing = await registration.pushManager.getSubscription();
        const subscription =
          existing ||
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            ),
          }));

        const key = subscription.getKey("p256dh");
        const auth = subscription.getKey("auth");

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            p256dh: key
              ? btoa(String.fromCharCode(...new Uint8Array(key)))
              : "",
            auth: auth
              ? btoa(String.fromCharCode(...new Uint8Array(auth)))
              : "",
          }),
        });
      } catch (error) {
        console.error("Push subscription failed:", error);
      }
    }

    subscribe();
  }, []);

  return (
    <button
      onClick={async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          window.location.reload();
        }
      }}
      className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
    >
      🔔 通知を許可する
    </button>
  );
}

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
