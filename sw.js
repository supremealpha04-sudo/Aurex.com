// sw.js - Service Worker for Aurex Designs PWA

const CACHE_NAME = 'aurex-v3';
const STATIC_CACHE = 'aurex-static-v3';
const IMAGE_CACHE = 'aurex-images-v3';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/academy.html',
    '/projects.html',
    '/profile.html',
    '/auth.html',
    '/admin.html',
    '/config.js',
    '/manifest.json',
    '/offline.html',
    '/IMG-20260403-WA0021(1).jpg'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith('aurex-') && !name.includes('v3'))
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            console.log('Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch Strategy: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Supabase API requests (let them go to network)
    if (url.hostname.includes('supabase.co')) {
        event.respondWith(fetch(request));
        return;
    }

    // Skip external resources
    if (url.origin !== self.location.origin && !url.hostname.includes('supabase.co')) {
        event.respondWith(fetch(request));
        return;
    }

    // Navigation requests - serve offline page if needed
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match('/offline.html') || caches.match('/index.html');
            })
        );
        return;
    }

    // Image requests - Cache First
    if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
        event.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        // Return cached image and update in background
                        fetch(request).then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(request, networkResponse.clone());
                            }
                        }).catch(() => {});
                        return cachedResponse;
                    }
                    // Not in cache, fetch from network
                    return fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Return placeholder if offline
                        return caches.match('/IMG-20260403-WA0021(1).jpg');
                    });
                });
            })
        );
        return;
    }

    // Static assets - Cache First
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname === '/') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Update cache in background
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(STATIC_CACHE).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }
                return fetch(request);
            })
        );
        return;
    }

    // Everything else - Network First
    event.respondWith(
        fetch(request).then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                    cache.put(request, clone);
                });
            }
            return response;
        }).catch(() => {
            // Fallback to cache
            return caches.match(request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                // For HTML requests, return offline page
                if (request.headers.get('accept').includes('text/html')) {
                    return caches.match('/offline.html');
                }
                return new Response('Offline', { status: 503 });
            });
        })
    );
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

async function syncMessages() {
    try {
        const db = await openDB();
        const messages = await db.getAll('messages');
        
        for (const message of messages) {
            // Try to send each queued message
            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message)
                });
                if (response.ok) {
                    await db.delete('messages', message.id);
                }
            } catch (error) {
                console.error('Failed to sync message:', error);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('aurex-offline', 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('messages')) {
                db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}