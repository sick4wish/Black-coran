const CACHE_NAME = 'qilin-negro-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/screenshot_mobile.jpg',
  '/screenshot_desktop.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network-first falling back to cache for standard pages, offline-ready)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and local requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not found in cache, return index.html for SPA routes
          if (event.request.headers.get('accept').includes('html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// 4. Background Sync API
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-spells' || event.tag === 'sync-notes') {
    console.log('[Service Worker] Background Syncing spells/notes:', event.tag);
    event.waitUntil(
      // Simulate background database or server sync
      Promise.resolve()
    );
  }
});

// 5. Periodic Background Sync API
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-grimorio-lexicons') {
    console.log('[Service Worker] Periodic Background Syncing:', event.tag);
    event.waitUntil(
      // Simulate fetching latest lexicons in background
      Promise.resolve()
    );
  }
});

// 6. Web Push Notifications API
self.addEventListener('push', (event) => {
  let data = { title: 'El Qilin Negro', body: 'Un nuevo misterio se ha revelado en tu grimorio.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'El Qilin Negro', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'explore', title: 'Abrir Grimorio' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
