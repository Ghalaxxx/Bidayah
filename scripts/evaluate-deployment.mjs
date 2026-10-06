import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { server } from '../server/production.mjs';
import handler from '../server/vercel-handler.mjs';

delete process.env.OPENAI_API_KEY;
delete process.env.BIDAYAH_SEMANTIC;
delete process.env.BIDAYAH_LOCAL_EMBEDDINGS;
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
let cases = 0;
try {
  const home = await fetch(base);
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /Bidayah/u); cases++;
  for (const asset of [...html.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/gu)].map(match => match[1]).concat(['/media/wudu-atlas.png', '/media/prayer-atlas-v2.png', '/data/sources/sources.json', '/data/media/audio.json'])) {
    assert.equal((await fetch(base + asset)).status, 200, asset); cases++;
  }
  assert.equal((await fetch(base + '/api/health')).status, 200); cases++;
  const state = { journeyId: 'first_prayer', stepId: 'prep_qiblah', language: 'ar', mode: 'LEARN' };
  const answer = await (await fetch(base + '/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'لازم؟', state }) })).json();
  assert.equal(answer.citations[0].knowledgeId, 'qiblah_requirement');
  assert.match(answer.answer, /^نعم/u); cases++;
  const suggestions = await (await fetch(base + '/api/ask/suggestions?journeyId=first_prayer&stepId=prep_qiblah&language=en')).json();
  assert.equal(suggestions.suggestions.length, 3); cases++;
  assert.equal((await fetch(base + '/api/media-review/takbir.mp3')).status, 404); cases++;
  assert.equal((await fetch(base + '/.env')).status, 404); cases++;
  assert.equal((await fetch(base + '/%2e%2e%2fpackage.json')).status, 403); cases++;
  assert.equal((await fetch(base + '/missing.js')).status, 404); cases++;
  let body;
  const response = { statusCode: 200, setHeader() {}, end(value) { body = value; } };
  await handler({ url: '/api/ask', method: 'POST', headers: {}, body: { question: 'Is it required?', state: { ...state, language: 'en' } } }, response);
  assert.equal(JSON.parse(body).citations[0].knowledgeId, 'qiblah_requirement'); cases++;
  await handler({ url: '/api/ask', method: 'POST', headers: {}, body: '{broken' }, response);
  assert.equal(response.statusCode, 400); cases++;
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.framework, 'vite');
  assert.ok(config.functions['api/**/*.mjs'].includeFiles.includes('data/knowledge')); cases++;
  console.log(`Passed ${cases} production assets, API, Vercel parsed-body adapter and path-isolation checks.`);
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
