import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { setDefaultHandler } from "workbox-routing";
import { NetworkOnly, CacheFirst } from "workbox-strategies";

import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

if (process.env.NODE_ENV !== "production") {
  setDefaultHandler(new NetworkOnly());
} else {
  setDefaultHandler(
    new CacheFirst({
      cacheName: "app-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 63072e3,
          purgeOnQuotaError: true,
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ]

    })
  );
}
