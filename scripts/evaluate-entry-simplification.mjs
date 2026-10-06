import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import ts from 'typescript';
import { answerQuestion } from '../server/api.mjs';

async function load(file) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const { journeyEntry, restoreSession, canReview } = await load('../src/domain/journey.ts');
const { steps } = await load('../src/domain/content.ts');
const { buildPrayerSequence } = await load('../src/domain/prayer-sequence.ts');
const nodes = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].flatMap(prayer => buildPrayerSequence(steps, prayer));
const initial = { version: 2, sessionId: 'entry-test', language: 'ar', answers: {}, prerequisites: {}, stepHistory: [], completedSteps: [] };
let cases = 0;
for (const language of ['ar', 'en']) for (const journeyId of ['first_prayer', 'first_fast']) {
  const entry = journeyEntry(journeyId, nodes);
  assert.equal(entry.mode, 'LEARN');
  assert.equal(entry.stepId, journeyId === 'first_prayer' ? 'prayer_intro' : 'fast_intro');
  assert.equal(nodes.find(node => node.id === entry.stepId).stageId, entry.stageId);
  cases++;
  for (const stepId of [undefined, 'mode_selection', 'choose_mode', 'prayer_mode_selection', 'fast_mode_selection']) {
    const old = { ...initial, language, journeyId, stepId, completedSteps: [entry.stepId], stepHistory: ['mode_selection'] };
    const migrated = restoreSession(JSON.stringify(old), initial, nodes);
    assert.equal(migrated.stepId, entry.stepId);
    assert.equal(migrated.mode, 'LEARN');
    assert.deepEqual(migrated.completedSteps, [entry.stepId]);
    assert.deepEqual(migrated.stepHistory, []);
    assert.equal(migrated.language, language);
    cases++;
  }
  const stepId = journeyId === 'first_prayer' ? 'prep_qiblah' : 'suhoor';
  const completedSteps = [entry.stepId];
  const fastingSimulation = { secondsSinceMidnight: 17200, journeyStage: 'before_fajr', mode: 'simulation', isAuthoritativeTime: false };
  const old = { ...initial, language, journeyId, mode: 'PREPARE_TO_PERFORM', stepId, stageId: 'obsolete', stepHistory: ['mode_selection', entry.stepId], completedSteps, fastingSimulation };
  const migrated = restoreSession(JSON.stringify(old), initial, nodes);
  assert.equal(migrated.stepId, stepId);
  assert.equal(migrated.mode, 'LEARN');
  assert.equal(migrated.stageId, nodes.find(node => node.id === stepId).stageId);
  assert.deepEqual(migrated.completedSteps, completedSteps);
  assert.deepEqual(migrated.stepHistory, [entry.stepId]);
  assert.deepEqual(migrated.fastingSimulation, fastingSimulation);
  assert.deepEqual(restoreSession(JSON.stringify(migrated), initial, nodes), migrated);
  cases++;
  const question = language === 'ar' ? 'لازم؟' : 'Is it required?';
  const answer = await answerQuestion(question, migrated);
  assert.equal(answer.resolution.intent, 'REQUIREMENT_STATUS');
  assert.equal(answer.citations[0].knowledgeId, journeyId === 'first_prayer' ? 'qiblah_requirement' : 'suhoor_requirement');
  cases++;
}
for (const stepId of ['phone_aside_start', 'prayer_done', 'fast_done']) {
  const journeyId = stepId === 'fast_done' ? 'first_fast' : 'first_prayer';
  const saved = { ...initial, journeyId, mode: 'PREPARE_TO_PERFORM', stepId, completedSteps: [stepId], answers: { finished: true } };
  const restored = restoreSession(JSON.stringify(saved), initial, nodes);
  assert.equal(restored.stepId, stepId);
  assert.deepEqual(restored.answers, saved.answers);
  assert.deepEqual(restored.completedSteps, saved.completedSteps);
  cases++;
}
assert.equal(canReview('phone_aside_start'), false);
assert.equal(journeyEntry('unknown', nodes), undefined);
assert.equal(restoreSession('null', initial, nodes), initial);
assert.equal(restoreSession('{bad', initial, nodes), initial);
const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
assert.ok(!app.includes('chooseMode') && !app.includes('!state.mode ?'));
assert.ok(!app.includes('كيف تحب تستعد للصلاة؟') && !app.includes('متى ناوي تصوم؟'));
assert.ok(app.includes('"intro", "readiness", "wudu", "preparation", "prayer", "ready", "completion"'));
assert.ok(app.includes('"preparation", "before_fajr", "fajr", "daytime", "approaching_iftar", "iftar", "completion"'));
console.log(`Passed ${cases} bilingual entry, legacy restore, refresh, progress preservation and Ask context cases; phone boundary and removed-branch assertions passed.`);

if (process.argv[2]) {
  const protectedPaths = ['server', 'data', 'public', 'src/components', 'src/services', 'src/hooks', 'src/domain', 'src/App.css'];
  let unchanged = 0;
  async function verify(relative) {
    if (relative.replaceAll('\\', '/') === 'src/domain/journey.ts') return;
    const current = path.resolve(relative);
    let entries;
    try { entries = await readdir(current, { withFileTypes: true }); } catch { entries = undefined; }
    if (entries) { for (const entry of entries) await verify(path.join(relative, entry.name)); return; }
    const hash = buffer => createHash('sha256').update(buffer).digest('hex');
    assert.equal(hash(await readFile(current)), hash(await readFile(path.join(process.argv[2], relative))), `Unexpected preservation change: ${relative}`);
    unchanged++;
  }
  for (const relative of protectedPaths) await verify(relative);
  console.log(`Preservation hashes match the pre-change backup for ${unchanged} source/content/media files.`);
}
