/* eslint-disable no-undef */
import * as googleAnalytics from "workbox-google-analytics";

if (workbox) {
  console.log(`Yay! Workbox is loaded!`);
} else {
  console.log(`Boo! Workbox didn't load!`);
}

let cacheSuffixVersion = "-20220615"; // 缓存版本号

workbox.core.setCacheNameDetails({
  prefix: "mc-cfd",
  suffix: cacheSuffixVersion,
});

// have our sw update and control a web page as soon as possible.
workbox.core.skipWaiting(); // 强制等待中的 Service Worker 被激活
workbox.core.clientsClaim(); // Service Worker 被激活后使其立即获得页面控制权

// vue-cli3.0 supports pwa with the help of workbox-webpack-plugin, we need to get the precacheing list through this sentence.
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// Google Analytics
googleAnalytics.initialize();

// 腾讯云前端性能监控
workbox.routing.registerRoute(
  new RegExp("^https://(?:cdn-go\\.cn|aegis\\.qq\\.com)"),
  new workbox.strategies.NetworkOnly()
);

// Other
workbox.routing.registerRoute(
  new RegExp(".*.(?:png|jpg|jpeg|svg|gif|webp)"),
  new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
  new RegExp(".*.(css|js)"),
  new workbox.strategies.StaleWhileRevalidate()
);

// API POST
workbox.routing.registerRoute(
  new RegExp("^https://(.*)api\\.mc\\.cfd"),
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.Plugin("apiQueue", {
        maxRetentionTime: 1 * 60,
      }),
    ],
  }),
  "POST"
);

// API GET
// workbox.routing.registerRoute(
//   new RegExp("^https://(.*)api\\.mc\\.cfd"),
//   workbox.strategies.networkFirst({
//     cacheName: "api",
//   })
// );

// 其他
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 3,
  })
);
