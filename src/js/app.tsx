import ReactDOM from "react-dom";

import { AppComponent } from "components/AppComponent";

ReactDOM.render(<AppComponent />, document.body);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

if ("wakeLock" in navigator) {
  let wakelock = null;

  const requestWakeLock = async () => {
    wakelock = await navigator.wakeLock.request("screen");
  };

  requestWakeLock();

  document.addEventListener("visibilitychange", () => {
    if (wakelock !== null && document.visibilityState === "visible") {
      requestWakeLock();
    }
  });
}

if ("Notification" in window) {
  if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}
