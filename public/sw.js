self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title || "Mimamori";
  const options = {
    body: data.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction ?? false,
    silent: data.silent ?? false,
    vibrate: data.tag === "emergency" ? [200, 100, 200, 100, 200] : [100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/dashboard"));
});
