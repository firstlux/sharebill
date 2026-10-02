// Cache app để dùng offline
const CACHE = 'sharebill-v4';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'qrcode.min.js', 'firebase-config.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const put = (req, res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return res; };

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // File của app: lấy bản mới từ mạng, mất mạng thì dùng bản đã cache
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => put(req, r))
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
    return;
  }
  // Thư viện Firebase (gstatic) có version cố định: cache-first
  if (url.hostname === 'www.gstatic.com') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(r => put(req, r))));
  }
});
