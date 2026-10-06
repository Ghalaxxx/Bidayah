import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { apiMiddleware } from './api.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.woff': 'font/woff', '.woff2': 'font/woff2' };
await stat(path.join(root, 'index.html'));

export const server = createServer(async (req, res) => {
  try {
    if (new URL(req.url, 'http://localhost').pathname.startsWith('/api/')) {
      return await apiMiddleware(req, res, () => { res.statusCode = 404; res.end(); });
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.statusCode = 405; res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root)) { res.statusCode = 403; res.end(); return; }
    try {
      const bytes = await readFile(file);
      res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { res.statusCode = 404; res.end(); }
  } catch { res.statusCode = 400; res.end(); }
});
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3001);
  const host = process.env.HOST || '127.0.0.1';
  server.listen(port, host, () => console.log(`Bidayah production: http://${host}:${port}`));
}
