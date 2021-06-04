import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { setDefaultHandler } from "workbox-routing";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";

if (process.env.NODE_ENV !== "production") {
  setDefaultHandler(new NetworkOnly());
} else {
  setDefaultHandler(
    new NetworkFirst({
      cacheName: "app",
      plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    })
  );
}
