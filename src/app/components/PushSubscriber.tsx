"use client";

import { useEffect } from "react";

export function PushSubscriber() {
  useEffect(() => {
    async function subscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          await sendToServer(existing);
        } else {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            ),
          });
          await sendToServer(subscription);
        }
      } catch (error) {
        console.error("Push subscription failed:", error);
      }
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

    // Sound listener
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "PLAY_SOUND") {
        const audio = new Audio(
          event.data.sound === "emergency"
            ? "/sounds/emergency.mp3"
            : "/sounds/notification.mp3",
        );
        audio.play().catch(console.error);
      }
    });

    subscribe();
  }, []);

  return null;
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
