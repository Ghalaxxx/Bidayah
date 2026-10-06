import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function load(file) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const { steps } = await load('../src/domain/content.ts');
const { buildPrayerSequence, prayerUnitCounts } = await load('../src/domain/prayer-sequence.ts');
const { transitionTarget, canReview, restoreSession } = await load('../src/domain/journey.ts');
for (const [prayer, count] of Object.entries(prayerUnitCounts)) {
  const nodes = buildPrayerSequence(steps, prayer);
  let node = nodes.find((item) => item.id === 'pre_prayer_review');
  const visited = [];
  while (node.id !== 'learning_ready') {
    assert.ok(!visited.includes(node.id), 'No traversal cycle');
    visited.push(node.id);
    node = transitionTarget(node, nodes);
    assert.ok(node, 'Every transition registered');
  }
  const path = visited.map((id) => nodes.find((item) => item.id === id));
  assert.equal(path.filter((item) => item.templateId === 'prayer_takbir').length, 1);
  for (let unit = 1; unit <= count; unit++) {
    const unitNodes = path.filter((item) => item.unitNumber === unit);
    const movementIds = unitNodes.map((item) => item.templateId).filter((id) => !['prayer_takbir', 'prayer_tashahhud', 'prayer_later_units', 'prayer_final_dua', 'prayer_taslim'].includes(id));
    assert.deepEqual(movementIds, ['prayer_stand', 'prayer_ruku', 'prayer_rise', 'prayer_sujud', 'prayer_sit', 'prayer_second_sujud']);
    assert.equal(unitNodes.filter((item) => item.templateId === 'prayer_tashahhud').length, Number(unit === 2 || unit === count));
  }
  assert.equal(path.filter((item) => item.templateId === 'prayer_taslim').length, 1);
  assert.equal(path.at(-1).unitNumber, count);
  assert.equal(canReview('phone_aside_start'), false);
  const saved = { version: 2, journeyId: 'first_prayer', stepId: path.at(-1).id, mode: 'LEARN', stepHistory: [], completedSteps: [] };
  assert.equal(restoreSession(JSON.stringify(saved), {}, nodes).stepId, saved.stepId);
  console.log(`${prayer}: ${count} full units, ${path.length - 1} review screens passed`);
}
