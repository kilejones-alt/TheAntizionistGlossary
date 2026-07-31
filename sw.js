const CACHE='tag-v222-core';
const CORE=[
  './','index.html','glossary.html','introduction.html','methodology.html','about.html','detector-app.html',
  'styles.css?v=222','script.js?v=222','shared-shell.css?v=222','shared-shell.js?v=222','style.css?v=128','app.js?v=128','rules.js?v=128',
  'inverted-world-logo-transparent-480.webp','inverted-world-logo-transparent-720.webp','icon-192.png','icon-512.png','lumen-nocturne.mp3',
  'manifest.webmanifest','detector-manifest.webmanifest'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;})));
});
