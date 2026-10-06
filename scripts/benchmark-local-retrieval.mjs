import { writeFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { localEmbeddings, closeLocalEmbeddings } from '../server/local-embeddings.mjs';
import { knowledge, retrieve, embeddingDocument } from '../server/retrieval.mjs';
import { answerQuestion } from '../server/api.mjs';

const cases = [
  { q: 'What does the opening Allahu Akbar mean?', journey: 'first_prayer', step: 'prayer_takbir', expected: 'takbir_definition' },
  { q: 'اش هو التسبيح', journey: 'first_prayer', step: 'prayer_ruku', expected: 'tasbih_ruku' },
  { q: 'اش هو التسبيح', journey: 'first_prayer', step: 'prayer_sujud', expected: 'tasbih_sujud' },
  { q: 'هل اقولها بصوت عالي', journey: 'first_prayer', step: 'prayer_takbir', expected: 'phrase_volume_unspecified' },
  { q: 'Is eating the predawn meal compulsory for my fast?', journey: 'first_fast', step: 'suhoor', expected: 'suhoor_requirement' },
  { q: 'Can I break my fast using water when dates are unavailable?', journey: 'first_fast', step: 'iftar', expected: 'iftar_food' },
  { q: 'Should my dates be an odd number at sunset?', journey: 'first_fast', step: 'iftar', expected: 'iftar_count' },
  { q: 'I need to know the direction to face before praying', journey: 'first_prayer', step: 'prep_qiblah', expected: 'qiblah_definition' },
];
const approved = knowledge.filter((item) => item.status === 'approved');
const started = performance.now();
try {
  const vectors = await localEmbeddings([...approved.map((item) => embeddingDocument(item, 'en')), ...cases.map((item) => item.q)]);
  process.env.BIDAYAH_LOCAL_EMBEDDINGS = 'true';
  delete process.env.OPENAI_API_KEY;
  const results = [];
  for (const [index, test] of cases.entries()) {
    const semantic = approved.map((item, i) => ({ id: item.id, journey: item.journey, score: vectors[i].reduce((sum, value, j) => sum + value * vectors[approved.length + index][j], 0) })).filter((item) => item.journey === test.journey).sort((a, b) => b.score - a.score);
    const lexical = retrieve(test.q, { journeyId: test.journey, stepId: test.step });
    const response = await answerQuestion(test.q, { journeyId: test.journey, stepId: test.step, language: /[\u0600-\u06ff]/u.test(test.q) ? 'ar' : 'en' });
    const hybrid = response.citations[0]?.knowledgeId ?? null;
    results.push({ ...test, lexicalTop1: lexical[0]?.item.id ?? null, semanticTop3: semantic.slice(0, 3), hybridTop1: hybrid, retrievalMode: response.retrievalMode, correct: hybrid === test.expected });
  }
  const report = { executedAt: new Date().toISOString(), model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2', localFilesOnly: true, dimensions: vectors[0].length, elapsedMs: Math.round(performance.now() - started), cases: results, lexicalAccuracy: results.filter((item) => item.lexicalTop1 === item.expected).length / results.length, hybridAccuracy: results.filter((item) => item.correct).length / results.length, limitation: 'Small diagnostic set, not a live LLM or pilot-readiness evaluation. Semantic top-three is an English-document diagnostic; hybridTop1 is the actual API with language-specific documents, current-step eligibility and lexical precedence.' };
  await mkdir(new URL('../docs/evaluation/', import.meta.url), { recursive: true });
  await writeFile(new URL('../docs/evaluation/local-retrieval-results.json', import.meta.url), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { closeLocalEmbeddings(); }
