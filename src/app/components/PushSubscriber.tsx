/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export function PushSubscriber({ isLoggedIn }: { isLoggedIn: boolean }) {
  // "idle" = এখনো জানি না, "prompt" = banner দেখাও, "granted" = হয়ে গেছে,
  // "blocked" = user block করেছে, "hidden" = কিছু দেখাব না
  const [state, setState] = useState<
    "idle" | "prompt" | "granted" | "blocked" | "hidden"
  >("idle");

  // sound listener — সবসময় (login হোক বা না হোক)
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    function onMessage(event: MessageEvent) {
      if (event.data?.type === "PLAY_SOUND") {
        const audio = new Audio(
          event.data.sound === "emergency"
            ? "/sounds/emergency.mp3"
            : "/sounds/notification.mp3",
        );
        audio.play().catch(() => {});
      }
    }
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  // permission অবস্থা যাচাই — login করা থাকলেই
  useEffect(() => {
    if (!isLoggedIn) {
      setState("hidden");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("hidden");
      return;
    }

    // sw register (একবার)
    navigator.serviceWorker.register("/sw.js").catch(() => {});

    const perm = Notification.permission;
    if (perm === "granted") {
      // অলরেডি granted — চুপচাপ subscribe (inline)
      (async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          const existing = await registration.pushManager.getSubscription();
          const subscription =
            existing ||
            (await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
              ),
            }));
          await sendToServer(subscription);
        } catch (error) {
          console.error("Push subscription failed:", error);
        }
      })();
      setState("granted");
    } else if (perm === "denied") {
      setState("blocked");
    } else {
      // "default" — এখনো চাওয়া হয়নি → banner দেখাও
      setState("prompt");
    }
  }, [isLoggedIn]);

  async function ensureSubscribed() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          ),
        }));
      await sendToServer(subscription);
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

  // user "許可する" চাপল → তবেই browser permission চাও
  async function handleAllow() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await ensureSubscribed();
        setState("granted");
      } else {
        setState("blocked");
      }
    } catch {
      setState("blocked");
    }
  }

  // granted / hidden / idle → কিছু দেখাব না
  if (state === "granted" || state === "hidden" || state === "idle") {
    return null;
  }

  // prompt → সুন্দর banner ("許可する" বাটন সহ)
  if (state === "prompt") {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">🔔</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              緊急時の通知を受け取る
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              ご家族の緊急連絡やお薬の記録をお知らせします。通知を許可してください。
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAllow}
                className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:opacity-60 transition-all"
              >
                許可する
              </button>
              <button
                onClick={() => setState("hidden")}
                className="px-4 py-2 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 active:opacity-60 transition-all"
              >
                あとで
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // blocked → নরম reminder (browser settings-এ allow করতে বলা)
  if (state === "blocked") {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-lg p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">🔕</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              通知がブロックされています
            </p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              緊急時の通知を受け取るには、ブラウザの設定（アドレスバーの🔒）から通知を「許可」に変更してください。
            </p>
            <button
              onClick={() => setState("hidden")}
              className="mt-2 text-xs text-amber-600 font-medium hover:underline"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

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
