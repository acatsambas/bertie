// Service Worker for Bertie PWA
// This is required for the beforeinstallprompt event to fire

const CACHE_NAME = 'bertie-v1';

// Install event - cache basic assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(self.clients.claim());
});

// Fetch event - required for PWA installability
// Using network-first strategy for simplicity
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For now, just pass through to network
    // This is the minimum required for PWA installability
    event.respondWith(
        fetch(event.request).catch(() => {
            // Optional: return cached response on network failure
            return caches.match(event.request);
        })
    );
});
