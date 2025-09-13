const CACHE_NAME = 'socai-mini-v1'
const urlsToCache = [
  '/',
  '/upload',
  '/otp',
  '/generate',
  '/result',
  '/tokens-exhausted',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip API calls and image uploads
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co') ||
      event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline token updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    // Could implement offline token sync here
  }
})

// Push notification support (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const notificationData = event.data.json()
    
    const options = {
      body: notificationData.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: notificationData.primaryKey
      },
      actions: [{
        action: 'explore',
        title: 'Lihat Video',
        icon: '/icons/icon-192x192.png'
      }]
    }

    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll().then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})