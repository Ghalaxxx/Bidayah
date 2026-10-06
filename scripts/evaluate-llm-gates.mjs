import assert from 'node:assert/strict';
import { answerQuestion } from '../server/api.mjs';

// Transport stub exercises validation, not a claim of live model quality.
const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENAI_API_KEY;
const originalSemantic = process.env.BIDAYAH_SEMANTIC;
process.env.OPENAI_API_KEY = 'test-transport-only';
delete process.env.BIDAYAH_SEMANTIC;
const state = { journeyId: 'first_prayer', language: 'en', stepId: 'prayer_ruku' };
function stub(values) {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(values.shift()) } }] }) });
}
try {
  stub([{ answer: 'Unsupported', knowledgeIds: ['invented_source'], abstain: false }]);
  assert.equal((await answerQuestion('what is bowing', state)).mode, 'abstention');
  stub([{ answer: 'Unsupported number recommendation', knowledgeIds: ['ruku_instruction'], abstain: false }, { supported: false }]);
  assert.equal((await answerQuestion('what is bowing', state)).mode, 'retrieval-only');
  stub([{ answer: 'Review bowing before prayer with your hands on your knees.', knowledgeIds: ['ruku_instruction'], abstain: false }, { supported: true }]);
  assert.equal((await answerQuestion('what is bowing', state)).mode, 'llm-rag');
  globalThis.fetch = async () => { throw new Error('provider unavailable'); };
  assert.equal((await answerQuestion('what is bowing', state)).mode, 'retrieval-only-provider-unavailable');
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('safety-critical requests must not reach generation'); };
  const qiblah = { ...state, stepId: 'prep_qiblah' };
  assert.equal((await answerQuestion('Is it required?', qiblah)).citations[0].knowledgeId, 'qiblah_requirement');
  assert.equal(calls, 0);
  assert.equal((await answerQuestion('Must I return my hands?', { ...state, stepId: 'wudu_head' })).mode, 'abstention');
  assert.equal(calls, 0);
  const iftar = { ...state, journeyId: 'first_fast', stepId: 'iftar' };
  assert.equal((await answerQuestion('Must I eat an odd number of dates?', iftar)).citations[0].knowledgeId, 'iftar_count');
  assert.equal(calls, 0);
  stub([{ answer: 'Follow the phone step by step during prayer.', knowledgeIds: ['ruku_instruction'], abstain: false }]);
  assert.equal((await answerQuestion('what is bowing', state)).mode, 'retrieval-only');
  console.log('Passed 8 LLM transport/grounding gate tests with stubs. No live model evaluation performed.');
} finally {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  if (originalSemantic === undefined) delete process.env.BIDAYAH_SEMANTIC; else process.env.BIDAYAH_SEMANTIC = originalSemantic;
}
