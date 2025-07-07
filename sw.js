const CACHE_NAME = 'joyce-bronze-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/quiz-logic.js',
  '/quiz-interface.js',
  '/main.js',
  '/manifest.json',
  '/assets/images/favicon.png',
  '/assets/images/hero-woman-transparent.png',
  '/assets/images/joyce_bronze_corrected.png',
  '/assets/images/palm-tree.png',
  '/assets/images/star.png',
  '/assets/images/transformations/transformation_artificial_1.jpg',
  '/assets/images/transformations/transformation_artificial_2.jpg',
  '/assets/images/transformations/transformation_artificial_3.jpg',
  '/assets/images/transformations/transformation_big_neon_clareador.jpg',
  '/assets/images/transformations/transformation_big_neon.jpg',
  '/assets/images/transformations/transformation_diva_master_premium.jpg',
  '/assets/images/transformations/transformation_diva_master_simples.jpg',
  '/assets/images/transformations/transformation_natural_1.jpg',
  '/assets/images/transformations/transformation_natural_2.jpg',
  '/assets/videos/video_1.mp4',
  '/assets/videos/video_2.mp4',
  '/assets/videos/video_3.mp4',
  '/assets/videos/video_4.mp4',
  '/assets/videos/video_5.mp4',
  '/assets/videos/video_6.mp4'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});


