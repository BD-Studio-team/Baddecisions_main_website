#!/usr/bin/env node
// Local dev server that mimics Vercel's `cleanUrls: true` behavior.
// - Serves static files from project root
// - Strips trailing /, resolves /foo → /foo.html, /foo/bar → /foo/bar.html
// - Returns the standard 404 for missing files
// Pure Node, no dependencies. Usage: node dev-server.js [port]

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const ROOT = __dirname;
const PORT = parseInt(process.argv[2], 10) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.otf':   'font/otf',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml',
  '.map':  'application/json',
};

function safeJoin(root, requestPath) {
  // Block path traversal
  const decoded = decodeURIComponent(requestPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(root, normalized);
  if (!full.startsWith(root)) return null;
  return full;
}

function tryFile(p) {
  try {
    const stat = fs.statSync(p);
    if (stat.isFile()) return p;
  } catch (_) {}
  return null;
}

function resolvePath(reqUrl) {
  const parsed = url.parse(reqUrl);
  let p = parsed.pathname || '/';

  // Drop trailing slash (except root)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  const candidatePath = safeJoin(ROOT, p);
  if (!candidatePath) return null;

  // 1. Direct file hit (e.g. /css/style.css, /favicon.svg)
  let resolved = tryFile(candidatePath);
  if (resolved) return resolved;

  // 2. Directory → look for index.html
  try {
    const stat = fs.statSync(candidatePath);
    if (stat.isDirectory()) {
      resolved = tryFile(path.join(candidatePath, 'index.html'));
      if (resolved) return resolved;
    }
  } catch (_) {}

  // 3. cleanUrls: append .html (e.g. /podcast → /podcast.html)
  resolved = tryFile(candidatePath + '.html');
  if (resolved) return resolved;

  // 4. cleanUrls: nested route (e.g. /work-with-us/services → /work-with-us/services.html)
  // already handled above via candidatePath + '.html'.

  return null;
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
    console.log(`404 ${req.method} ${req.url}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error\n');
      console.log(`500 ${req.method} ${req.url} :: ${err.message}`);
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-store',
    });
    res.end(data);
    console.log(`200 ${req.method} ${req.url} -> ${path.relative(ROOT, filePath)}`);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  BDS dev server (mimics Vercel cleanUrls)');
  console.log('  -----------------------------------------');
  console.log('  Listening on http://localhost:' + PORT);
  console.log('  Serving from ' + ROOT);
  console.log('');
  console.log('  Try:');
  console.log('    http://localhost:' + PORT + '/');
  console.log('    http://localhost:' + PORT + '/podcast');
  console.log('    http://localhost:' + PORT + '/learn');
  console.log('    http://localhost:' + PORT + '/work-with-us/services');
  console.log('');
  console.log('  Note: /api/podcast is a Vercel serverless function and will 404 here.');
  console.log('  The podcast page falls back to hardcoded episodes — that is expected.');
  console.log('');
  console.log('  Ctrl+C to stop.');
  console.log('');
});
