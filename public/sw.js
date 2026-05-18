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

  const tag = event.notification.tag;
  const data = event.notification.data;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const url = data?.url || "/dashboard";

        for (const client of clientList) {
          if ("focus" in client) {
            client.postMessage({
              type: "PLAY_SOUND",
              sound: tag === "emergency" ? "emergency" : "normal",
            });
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});
