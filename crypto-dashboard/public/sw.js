self.addEventListener("push", (event) => {
  let data = { title: "Vaultline", body: "Er is een nieuwe melding." };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // val terug op standaardtekst als de payload geen JSON is
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
