import { Readable } from 'node:stream';
import { apiMiddleware } from './api.mjs';

export default async function handler(req, res) {
  // Vercel may parse the body before invoking the existing Node middleware.
  const request = req.body === undefined ? req : Object.assign(Readable.from([
    Buffer.isBuffer(req.body) || typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
  ]), { url: req.url, method: req.method, headers: req.headers });
  return apiMiddleware(request, res, () => { res.statusCode = 404; res.end(); });
}
