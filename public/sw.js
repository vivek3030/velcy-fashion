const CACHE_NAME = 'velcy-fashion-v1'
const STATIC_CACHE_NAME = 'velcy-fashion-static-v1'
const DYNAMIC_CACHE_NAME = 'velcy-fashion-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add your static assets here
  // '/logo.png',
  // '/favicon.ico'
]

const API_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error)
      })
  )
})

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete')
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Activation failed', error)
      })
  )
})

// Fetch Strategy: Network First for API, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests (except images)
  if (!url.origin.includes(self.location.origin) && !url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return
  }

  // API requests - Network First with cache fallback
  if (url.pathname.includes('/api/') || url.pathname.includes('firebaseio.com')) {
    event.respondWith(
      networkFirstStrategy(request)
        .catch(() => {
          console.log('📡 Service Worker: Network failed, serving from cache')
          return caches.match(request)
        })
    )
    return
  }

  // Image requests - Cache First with network fallback
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(
      cacheFirstStrategy(request, IMAGE_CACHE_DURATION)
        .catch(() => {
          console.log('🖼️ Service Worker: Cache failed, fetching from network')
          return fetch(request)
        })
    )
    return
  }

  // Static assets - Cache First
  if (STATIC_ASSETS.some(asset => url.pathname === new URL(asset, self.location.origin).pathname)) {
    event.respondWith(
      cacheFirstStrategy(request)
    )
    return
  }

  // Dynamic content - Network First with cache fallback
  event.respondWith(
    networkFirstStrategy(request, API_CACHE_DURATION)
  )
})

// Network First Strategy
async function networkFirstStrategy(request, maxAge = API_CACHE_DURATION) {
  try {
    console.log('🌐 Service Worker: Fetching from network:', request.url)

    const response = await fetch(request)

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('📡 Service Worker: Network failed, checking cache:', request.url)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Cache First Strategy
async function cacheFirstStrategy(request, maxAge = null) {
  try {
    console.log('💾 Service Worker: Checking cache:', request.url)

    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      // Check if cache is still valid (if maxAge is specified)
      if (maxAge) {
        const cachedTime = cachedResponse.headers.get('cached-at')
        if (cachedTime) {
          const age = Date.now() - parseInt(cachedTime)
          if (age < maxAge) {
            console.log('✅ Service Worker: Serving from cache (valid):', request.url)
            return cachedResponse
          }
        }
      } else {
        console.log('✅ Service Worker: Serving from cache:', request.url)
        return cachedResponse
      }
    }

    // Cache miss or expired, fetch from network
    console.log('🌐 Service Worker: Cache miss/expired, fetching from network:', request.url)

    const response = await fetch(request)

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      const responseToCache = response.clone()

      // Add timestamp to response headers for cache validation
      responseToCache.headers.set('cached-at', Date.now().toString())

      cache.put(request, responseToCache)
    }

    return response
  } catch (error) {
    console.log('❌ Service Worker: Cache and network failed:', request.url)

    // Try to serve from any cache as last resort
    const fallbackResponse = await caches.match(request)
    if (fallbackResponse) {
      console.log('🆘 Service Worker: Serving from fallback cache:', request.url)
      return fallbackResponse
    }

    throw error
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOfflineOrders())
  }
})

// Sync offline orders when back online
async function syncOfflineOrders() {
  try {
    console.log('🔄 Service Worker: Syncing offline orders')

    // Get all offline orders from IndexedDB
    const offlineOrders = await getOfflineOrders()

    for (const order of offlineOrders) {
      try {
        // Retry the order submission
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order.data)
        })

        if (response.ok) {
          // Remove successful order from IndexedDB
          await removeOfflineOrder(order.id)
          console.log('✅ Service Worker: Order synced successfully:', order.id)
        } else {
          console.error('❌ Service Worker: Order sync failed:', order.id)
        }
      } catch (error) {
        console.error('❌ Service Worker: Order sync error:', error)
      }
    }
  } catch (error) {
    console.error('❌ Service Worker: Background sync failed:', error)
  }
}

// IndexedDB helpers for offline storage
async function getOfflineOrders() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VelcyFashionOffline', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['orders'], 'readonly')
      const store = transaction.objectStore('orders')
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }

    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore('orders', { keyPath: 'id' })
    }
  })
}

async function removeOfflineOrder(orderId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VelcyFashionOffline', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const deleteRequest = store.delete(orderId)

      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Velcy Fashion',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Order',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Velcy Fashion', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/track-order')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Cleanup old caches periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('🚀 Service Worker: Loaded successfully')