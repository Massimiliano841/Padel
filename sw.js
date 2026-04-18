// ─────────────────────────────────────────────
//  Padel Pro — Service Worker
//  Aggiorna questo numero ad ogni release
//  per forzare il refresh su tutti i dispositivi
// ─────────────────────────────────────────────
const VERSION = 'padel-pro-v1.4.3';

// Install: mette in cache i file essenziali
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache =>
      cache.addAll(['./', './index.html'])
    )
  );
});

// Activate: elimina le cache vecchie
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, poi cache come fallback
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Messaggio SKIP_WAITING: attiva subito il nuovo SW
self.addEventListener('message', e => {
  if(e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
