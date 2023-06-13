const sendNotification = (msg: string) => {
  if (!("Notification" in window)) {
    console.log("Notification is not supported");
  } else if (Notification.permission === "granted") {
    new Notification("Exercise Timer", {
      body: msg,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        sendNotification(msg);
      }
    });
  }
};

export { sendNotification };
