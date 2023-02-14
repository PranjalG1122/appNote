const CACHE_NAME = "cool-cache";

const PRECACHE_ASSETS = [];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {})());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {});
