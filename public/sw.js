self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title || "Mimamori";
  const options = {
    body: data.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction ?? false,
    silent: false,
    vibrate: data.tag === "emergency" ? [300, 100, 300, 100, 300] : [100],
    data: {
      sound: data.tag === "emergency" ? "emergency" : "normal",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        client.postMessage({
          type: "PLAY_SOUND",
          sound: event.notification.data?.sound,
        });
        if ("focus" in client) client.focus();
        return;
      }
      clients.openWindow("/dashboard");
    }),
  );
});
