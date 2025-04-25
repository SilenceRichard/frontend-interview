// sw.js - Version 1 (Problematic update)

const CACHE_NAME = 'cache-v4'; // 缓存名称，版本1
const urlsToCache = [
    '/', // 缓存根路径，通常映射到 index.html
    '/index.html', // 明确缓存 index.html
];

console.log('SW Startup - v1');

// 安装阶段：缓存资源
self.addEventListener('install', event => {
    console.log('SW Installing - v2...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache - v1');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Assets added to cache - v1');
                // **注意：这里没有 self.skipWaiting()**
                // return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache assets during install - v1:', error);
            })
    );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
    console.log('SW Activating - v1...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // 删除所有不等于当前CACHE_NAME的缓存
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('SW Activated - v1. Old caches cleaned.');
             // **注意：这里没有 clients.claim()**
            // return  self.clients.claim();
        })
    );
});

// 拦截网络请求，优先从缓存提供
self.addEventListener('fetch', event => {
    console.log('SW Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果缓存中有匹配的响应，则返回缓存的响应
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                // 否则，从网络获取
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                // 可以提供一个离线页面作为备用
            })
    );
}); 