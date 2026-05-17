"use client";

export function NotificationButton() {
  async function handleClick() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Permission denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      alert(`SW ready: ${registration.active?.state}`);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      });

      alert(`Subscribed: ${subscription.endpoint.slice(0, 50)}`);

      const key = subscription.getKey("p256dh");
      const auth = subscription.getKey("auth");

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
          auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
        }),
      });

      alert(`Server response: ${res.status}`);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200"
    >
      🔔 通知を許可する
    </button>
  );
}
