#!/usr/bin/env node
// Local dev server that mimics Vercel's `cleanUrls: true` behavior.
// - Serves static files from project root
// - Strips trailing /, resolves /foo → /foo.html, /foo/bar → /foo/bar.html
// - Returns the standard 404 for missing files
// Pure Node, no dependencies. Usage: node dev-server.js [port]

const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT || process.argv[2], 10) || 8000;
const VERBOSE = !!process.env.DEBUG;
const log = VERBOSE ? console.log.bind(console) : function() {};

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
  let decoded = '';
  try {
    decoded = decodeURIComponent(requestPath);
  } catch (_) {
    return null;
  }
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
  let p = '/';
  try {
    p = new URL(reqUrl, 'http://localhost').pathname || '/';
  } catch (_) {
    return null;
  }

  // Drop trailing slash (except root)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  const candidatePath = safeJoin(ROOT, p);
  if (!candidatePath) return null;

  const hasExtension = path.extname(candidatePath) !== '';

  // 1. cleanUrls first for extensionless routes (e.g. /education -> /education.html)
  // This avoids accidental extensionless files shadowing real page routes.
  let resolved = null;
  if (!hasExtension) {
    resolved = tryFile(candidatePath + '.html');
    if (resolved) return resolved;
  }

  // 2. Direct file hit (e.g. /css/style.css, /favicon.svg)
  resolved = tryFile(candidatePath);
  if (resolved) return resolved;

  // 3. Directory → look for index.html
  try {
    const stat = fs.statSync(candidatePath);
    if (stat.isDirectory()) {
      resolved = tryFile(path.join(candidatePath, 'index.html'));
      if (resolved) return resolved;
    }
  } catch (_) {}

  // 4. cleanUrls fallback (e.g. /podcast → /podcast.html)
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
    log(`404 ${req.method} ${req.url}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, (statErr, stat) => {
    if (statErr) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error\n');
      log(`500 ${req.method} ${req.url} :: ${statErr.message}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end('500 Internal Server Error\n');
      log(`500 ${req.method} ${req.url} :: ${err.message}`);
    });
    stream.on('end', () => {
      log(`200 ${req.method} ${req.url} -> ${path.relative(ROOT, filePath)}`);
    });
    stream.pipe(res);
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
  console.log('    http://localhost:' + PORT + '/education');
  console.log('    http://localhost:' + PORT + '/work-with-us/services');
  console.log('');
  console.log('  Note: podcast episodes are baked into static HTML at build time.');
  console.log('');
  console.log('  Ctrl+C to stop.');
  console.log('');
});
