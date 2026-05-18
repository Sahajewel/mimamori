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
    data: { sound: data.tag === "emergency" ? "emergency" : "normal" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.postMessage({
              type: "PLAY_SOUND",
              sound: event.notification.data?.sound,
            });
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});
