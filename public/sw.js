self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Already open window আছে?
        for (const client of clientList) {
          if (client.url.includes("mimamori") && "focus" in client) {
            client.postMessage({
              type: "PLAY_SOUND",
              sound: event.notification.data?.sound,
            });
            return client.focus();
          }
        }
        // না থাকলে নতুন window খোলো
        return clients.openWindow("/dashboard");
      }),
  );
});
