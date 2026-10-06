import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { apiMiddleware } from '../server/api.mjs';

delete process.env.OPENAI_API_KEY;
delete process.env.BIDAYAH_SEMANTIC;
delete process.env.BIDAYAH_LOCAL_EMBEDDINGS;
const server = createServer((req, res) => apiMiddleware(req, res, () => { res.statusCode = 404; res.end(); }));
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const state = { sessionId: 'http-test', journeyId: 'first_prayer', stepId: 'prep_qiblah', language: 'ar', mode: 'LEARN' };
const post = body => fetch(`${base}/api/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
let tests = 0;
try {
  const response = await post({ question: 'لازم؟', state });
  assert.equal(response.status, 200);
  const answer = await response.json();
  assert.equal(answer.resolution.intent, 'REQUIREMENT_STATUS');
  assert.equal(answer.resolution.subject, 'facing_qiblah');
  assert.match(answer.answer, /^نعم/u);
  assert.equal(answer.citations[0].knowledgeId, 'qiblah_requirement');
  assert.equal(answer.sources[0].id, answer.citations[0].sourceId);
  tests++;
  for (const body of ['{', null, { question: '', state }, { question: 'a'.repeat(1501), state }, { question: 'لازم؟', state: { ...state, language: 'toString' } }, { question: 'لازم؟', state: { ...state, stepId: 2 } }]) {
    assert.equal((await post(body)).status, 400); tests++;
  }
  assert.equal((await post('x'.repeat(16001))).status, 413); tests++;
  assert.equal((await fetch(`${base}/api/ask`)).status, 405); tests++;
  const suggestions = await fetch(`${base}/api/ask/suggestions?journeyId=first_prayer&stepId=prep_qiblah&language=ar`);
  assert.equal(suggestions.status, 200);
  assert.equal((await suggestions.json()).suggestions.length, 3); tests++;
  assert.equal((await fetch(`${base}/api/ask/suggestions?journeyId=first_prayer&stepId=prep_qiblah&language=toString`)).status, 400); tests++;
  assert.equal((await fetch(`${base}/api/ask/suggestions?journeyId=first_prayer&stepId=toString&language=ar`)).status, 200); tests++;
  assert.equal((await fetch(`${base}/api/ask/suggestions`, { method: 'POST' })).status, 405); tests++;
  const offStep = await (await post({ question: 'وش الركوع؟', state })).json();
  const followup = await (await post({ question: 'طيب وش أقول فيه؟', state, recentContext: offStep.memory })).json();
  assert.equal(followup.resolution.subject, 'ruku');
  assert.match(followup.answer, /سبحان ربي العظيم/u); tests++;
  const reset = await (await post({ question: 'لازم؟', state: { ...state, stepId: 'unit_1_prayer_takbir' }, recentContext: offStep.memory })).json();
  assert.equal(reset.resolution.subject, 'takbir');
  assert.equal(reset.mode, 'abstention'); tests++;
  const forged = await (await post({ question: 'لازم؟', state, recentContext: { ...offStep.memory, lastSubject: 'suhoor' } })).json();
  assert.equal(forged.resolution.subject, 'facing_qiblah'); tests++;
  console.log(`Passed ${tests} actual HTTP contract, suggestions, context and memory guard cases.`);
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
