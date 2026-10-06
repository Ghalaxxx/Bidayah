import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../data/media-review/', import.meta.url));
// Mounted only by Vite's development server, never by the standalone/production API.
export async function mediaReviewMiddleware(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith('/api/media-review/')) return next();
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) { res.statusCode = 403; res.end(); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.end(); return; }
  const name = url.pathname.slice('/api/media-review/'.length);
  if (!/^[a-z_]+\.mp3$/.test(name) && name !== 'manifest') { res.statusCode = 404; res.end(); return; }
  try {
    const manifest = JSON.parse(await readFile(path.join(directory, 'prepared-audio.json'), 'utf8'));
    if (name !== 'manifest' && !manifest.some((item) => item.id + '.mp3' === name)) { res.statusCode = 404; res.end(); return; }
    const bytes = name === 'manifest' ? Buffer.from(JSON.stringify(manifest)) : await readFile(path.join(directory, 'clips', name));
    res.setHeader('Content-Type', name === 'manifest' ? 'application/json; charset=utf-8' : 'audio/mpeg');
    res.setHeader('Content-Length', bytes.length);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.statusCode = 404; res.end(); }
}
