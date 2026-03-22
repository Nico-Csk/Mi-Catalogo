var CACHE_NAME = "mi-tienda-v2";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(
        nombres
          .filter(function (nombre) {
            return nombre !== CACHE_NAME;
          })
          .map(function (nombre) {
            return caches.delete(nombre);
          })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("firebasestorage.googleapis.com")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (respuesta) {
          if (respuesta) {
            return respuesta;
          }
          return fetch(event.request).then(function (respuestaRed) {
            cache.put(event.request, respuestaRed.clone());
            return respuestaRed;
          });
        });
      })
    );
  }
});
