// The current Glossary does not install a worker. Keep previous installations
// working while limiting their cache access to this site's own resources.
const scope = new URL(self.registration.scope);
const prefix = `antizionist-glossary:${scope.pathname}:`;
const cacheName = `${prefix}287`;
const core = new Set([
  'index.html', 'glossary.html', 'styles.css?v=286', 'home.css?v=286',
  'enhance.css?v=286', 'glossary-site.css?v=287', 'glossary-site.js?v=287',
  'glossary-reader.js?v=287', 'inverted-world-logo-transparent-480.webp',
  'inverted-world-logo-transparent-720.webp', 'icon-192.png', 'manifest.webmanifest',
]);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll([...core])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const obsolete = (await caches.keys()).filter(key => key !== cacheName &&
      (key.startsWith(prefix) || (scope.pathname === '/TheAntizionistGlossary/' && key === 'tag-v286-core')));
    await Promise.all(obsolete.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function loadPage(request, name) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok && !response.redirected && !/\b(?:private|no-store)\b/i.test(response.headers.get('cache-control') || '')) {
      await cache.put(name, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    return (await cache.match(name)) || (await cache.match('index.html')) || Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const name = url.pathname.slice(scope.pathname.length);
  if (request.mode === 'navigate' && !url.search && !/^detector-app(?:-he)?\.html$/.test(name) && /^(?:[\w-]+\.html)?$/.test(name)) {
    event.respondWith(loadPage(request, name || 'index.html'));
  } else if (core.has(name + url.search)) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(request)) || fetch(request)));
  }
});
