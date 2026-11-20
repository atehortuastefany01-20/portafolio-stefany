import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const resolved = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!resolved.startsWith(root + path.sep) && resolved !== path.join(root, 'index.html')) { res.writeHead(403); return res.end(); }
    const content = await readFile(resolved);
    const headers = { 'Content-Type': types[path.extname(resolved)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
    const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if (range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(0, content.length - Number(range[2]));
      const end = range[1] ? (range[2] ? Math.min(Number(range[2]), content.length - 1) : content.length - 1) : content.length - 1;
      if (start > end || start >= content.length) { res.writeHead(416, { 'Content-Range': `bytes */${content.length}` }); return res.end(); }
      res.writeHead(206, { ...headers, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${content.length}` });
      return res.end(content.subarray(start, end + 1));
    }
    res.writeHead(200, { ...headers, 'Content-Length': content.length });
    res.end(content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('No encontrado'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
