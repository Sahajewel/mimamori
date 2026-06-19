self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Mimamori";
  const options = {
    body: data.body || "通知があります",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction ?? false,
    vibrate: data.tag === "emergency" ? [300, 100, 300, 100, 300] : [100],
    data: {
      sound: data.tag === "emergency" ? "emergency" : "normal",
      url: data.url || "/dashboard",
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const tag = event.notification.tag;
  const url = event.notification.data?.url || "/dashboard";
  const fullUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (tag === "emergency") {
            client.postMessage({ type: "PLAY_SOUND", sound: "emergency" });
          }
          // postMessage দিয়ে app-কে navigate করতে বলি (PWA-তে এটা কাজ করে)
          client.postMessage({ type: "NAVIGATE", url: fullUrl });
          if ("focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      }),
  );
});
