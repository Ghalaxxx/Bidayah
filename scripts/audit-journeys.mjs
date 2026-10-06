import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';
import assert from 'node:assert/strict';

async function loadTs(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const { steps, glossary } = await loadTs('../src/domain/content.ts');
const { transitionTarget, restoreSession, canReview } = await loadTs('../src/domain/journey.ts');
const knowledge = JSON.parse(await readFile(new URL('../data/knowledge/knowledge.json', import.meta.url), 'utf8'));
const ids = new Set(steps.map((step) => step.id));
assert.equal(ids.size, steps.length, 'Unique nodes');
for (const step of steps) {
  for (const next of [step.next, ...(step.options ?? []).map((option) => option.next)].filter(Boolean)) {
    assert.ok(transitionTarget(step, steps, next), `${step.id} -> ${next}`);
  }
  assert.equal(transitionTarget(step, steps, 'unregistered_state'), undefined);
}
assert.equal(canReview('phone_aside_start'), false);
assert.equal(restoreSession('{bad', { version: 2 }, steps).version, 2);
assert.equal(restoreSession(JSON.stringify({ version: 1, stepId: 'prayer_sujud' }), { version: 2 }, steps).stepId, undefined);

const next = (id, choice) => {
  const node = steps.find((step) => step.id === id);
  return transitionTarget(node, steps, choice ? node.options.find((option) => option.value === choice)?.next : undefined)?.id;
};
// Personas A/B/C: branches for a new learner, known Wudu, already purified.
assert.equal(next('know_wudu', 'no'), 'wudu_intro');
assert.equal(next('know_wudu', 'yes'), 'in_wudu');
assert.equal(next('in_wudu', 'no'), 'wudu_intro');
assert.equal(next('in_wudu', 'yes'), 'prep_location');
assert.equal(next('wudu_complete'), 'prep_location');
assert.equal(next('prep_location', 'home'), 'prep_qiblah');
// Persona D: all modes share pre-performance review, never a live progression.
assert.equal(next('pre_prayer_review'), 'prayer_takbir');
assert.equal(next('prayer_demo_transition'), 'prayer_tashahhud');
assert.equal(next('prayer_taslim'), 'learning_ready');
assert.equal(next('learning_ready', 'ready'), 'prayer_ready');
assert.equal(next('phone_aside_start', 'finished'), 'prayer_done');
// Persona E: includes approaching dawn and sunset orientation.
assert.equal(next('suhoor'), 'approaching_fajr');
assert.equal(next('fast_begin'), 'fast_day');
assert.equal(next('fast_day'), 'approaching_iftar');

const audit = ['# Content depth audit', '', 'Generated from runtime nodes on 2026-10-04. Current implementation; missing coverage is explicit, not assumed reviewed.', ''];
const matrix = ['# Knowledge coverage matrix', '', '| Journey | Stage | Step | Beginner need | KnowledgeItem | Source / locator | Review | Glossary | Expected questions | Safety | Media / coverage |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
for (const step of steps) {
  const items = knowledge.filter((item) => item.steps.includes(step.id));
  const terms = (step.relatedGlossaryIds ?? []).map((id) => glossary.find((item) => item.id === id));
  audit.push(`## ${step.id}`, '', `- User sees: ${step.title.ar} / ${step.title.en}.`, `- Primary explanation: ${step.instruction.ar}`, `- User needs: understand this action and its position in the ${step.stageId} stage.`, `- Possible confusion: ${items.length ? 'details beyond retrieved evidence; real time versus illustrative state' : 'no scoped KnowledgeItem; explanation may not answer beginner follow-ups'}.`, `- Terminology: ${terms.map((item) => item?.terms.ar[0]).join(', ') || 'no linked term definition; manual terminology review required'}.`, `- Defined: ${terms.every(Boolean) ? 'linked terms available; not a complete terminology audit' : 'missing glossary link'}.`, `- Religious claims: ${step.guidanceType === 'religious' ? 'instruction above' : 'product/navigation only'}.`, `- Source support: ${(step.sourceIds ?? []).join(', ') || 'UI policy'}; ${items.map((item) => `${item.id}: ${item.locator}`).join('; ') || 'claim-level evidence mapping still needed'}.`, `- Review: ${step.reviewStatus}; existing lesson approval is not independent religious signoff.`, `- Optional detail: ${step.explanation?.ar || step.howToKnow?.ar || 'not yet available'}.`, `- Ask questions: ${items.flatMap((item) => item.questions.slice(0, 3)).join(' / ') || 'coverage gap; abstain rather than invent'}.`, `- Next: ${step.next || (step.options ?? []).map((option) => `${option.label.ar} => ${option.next}`).join(' / ') || 'terminal'}.`, '- Next action: review CTA; performance occurs outside the application.', '');
  matrix.push(`| ${step.journeyId} | ${step.stageId} | ${step.id} | ${step.title.en} | ${items.map((item) => item.id).join(', ') || 'MISSING'} | ${items.map((item) => `${item.sourceId}: ${item.locator}`).join('; ') || step.sourceIds.join(', ') || 'UI policy'} | ${items.map((item) => item.status).join(', ') || step.reviewStatus} | ${(step.relatedGlossaryIds ?? []).join(', ')} | ${items.flatMap((item) => item.questions.slice(0, 2)).join('; ')} | no live prayer; no simulated real timing; unsupported details abstain | ${step.guidanceType === 'ui' ? 'UI node' : items.some((item) => item.status === 'approved') ? 'partial; reviewed media pending' : 'GAP / NEEDS_REVIEW'} |`);
}
await mkdir(new URL('../docs/audit/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/audit/CONTENT_DEPTH_AUDIT.md', import.meta.url), audit.join('\n'));
await writeFile(new URL('../docs/audit/KNOWLEDGE_COVERAGE_MATRIX.md', import.meta.url), matrix.join('\n'));
console.log(`Audited ${steps.length} nodes; graph, restore and persona branch checks passed. Browser persona QA remains separate.`);
