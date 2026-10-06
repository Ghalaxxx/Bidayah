import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const moduleUrls = new Map();
async function moduleUrl(file) {
  if (moduleUrls.has(file.href)) return moduleUrls.get(file.href);
  const source = await readFile(file, 'utf8');
  let js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const parsed = ts.createSourceFile(file.pathname, js, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const replacements = [];
  for (const statement of parsed.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier;
    if (specifier.text.startsWith('.')) replacements.push({ start: specifier.getStart(parsed), end: specifier.end, value: JSON.stringify(await moduleUrl(new URL(specifier.text + '.ts', file))) });
  }
  for (const edit of replacements.reverse()) js = js.slice(0, edit.start) + edit.value + js.slice(edit.end);
  const url = `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
  moduleUrls.set(file.href, url);
  return url;
}
const load = async (file) => import(await moduleUrl(new URL(file, import.meta.url)));
const time = await load('../src/domain/fasting-time.ts');
const { synchronizeFastingSimulation, canNavigateFastingNext } = await load('../src/domain/fasting-journey.ts');
const { SimulatedFastingClockProvider } = await load('../src/services/fasting-clock.ts');
const { steps } = await load('../src/domain/content.ts');
const { transitionTarget, restoreSession } = await load('../src/domain/journey.ts');
let passed = 0;
function test(name, run) { run(); passed++; console.log(`PASS ${name}`); }
const initial = () => ({ version: 2, sessionId: 'test', language: 'ar', journeyId: 'first_fast', mode: 'LEARN', stepId: 'approaching_fajr', stageId: 'before_fajr', completedSteps: ['fast_intro', 'fast_intention', 'suhoor'], stepHistory: ['fast_intro', 'fast_intention', 'suhoor'], answers: {}, prerequisites: {}, startedAt: 'test', updatedAt: 'test' });
const sync = (state, seconds) => synchronizeFastingSimulation(state, time.simulatedTimeContext(seconds), seconds, steps);

test('Before Fajr: exact labels, target and non-authoritative simulation', () => {
  const context = time.simulatedTimeContext(time.DEMO_START_SECONDS);
  assert.equal(context.mode, 'simulation'); assert.equal(context.isAuthoritativeTime, false);
  assert.equal(context.labelAr, 'متبقي على بدء الصيام'); assert.equal(context.targetTime, '05:00');
  assert.equal(time.formatRemainingTime(context.remainingTime), '00:15:00');
  assert.equal(context.journeyStage, 'before_fajr');
});
test('Automatic natural Fajr boundary switches to a thirteen-hour Maghrib countdown', () => {
  const before = sync(initial(), time.DEMO_FAJR_SECONDS - 1);
  assert.equal(time.formatRemainingTime(time.simulatedTimeContext(time.DEMO_FAJR_SECONDS - 1).remainingTime), '00:00:01');
  const after = sync(before, time.DEMO_FAJR_SECONDS);
  assert.equal(after.stepId, 'fast_day'); assert.equal(after.stageId, 'daytime');
  const context = time.simulatedTimeContext(time.DEMO_FAJR_SECONDS);
  assert.equal(context.target, 'maghrib'); assert.equal(context.targetTime, '18:00');
  assert.equal(context.labelAr, 'متبقي على الإفطار'); assert.equal(time.formatRemainingTime(context.remainingTime), '13:00:00');
});
test('Natural approaching/Maghrib boundaries update JourneyState without a button', () => {
  let state = sync(initial(), time.DEMO_FAJR_SECONDS);
  state = sync(state, time.DEMO_APPROACHING_SECONDS);
  assert.equal(state.stageId, 'approaching_iftar'); assert.equal(state.stepId, 'approaching_iftar');
  assert.equal(time.formatRemainingTime(time.simulatedTimeContext(time.DEMO_APPROACHING_SECONDS).remainingTime), '00:05:00');
  state = sync(state, time.DEMO_MAGHRIB_SECONDS);
  assert.equal(state.stepId, 'iftar'); assert.equal(state.stageId, 'iftar');
  assert.equal(state.fastingSimulation.journeyStage, 'iftar');
});
test('Boundary-gated forward navigation cannot bypass the countdown', () => {
  const before = time.simulatedTimeContext(time.DEMO_START_SECONDS);
  assert.equal(canNavigateFastingNext('approaching_fajr', 'fast_begin', before), false);
  assert.equal(canNavigateFastingNext('fast_day', 'approaching_iftar', time.simulatedTimeContext(time.DEMO_FAJR_SECONDS)), false);
  assert.equal(canNavigateFastingNext('approaching_iftar', 'iftar', time.simulatedTimeContext(time.DEMO_MAGHRIB_SECONDS - 1)), false);
  assert.equal(canNavigateFastingNext('approaching_iftar', 'iftar', time.simulatedTimeContext(time.DEMO_MAGHRIB_SECONDS)), true);
});
test('Demo jumps follow the complete route and remain simulation-only', () => {
  const provider = new SimulatedFastingClockProvider();
  let state = sync(initial(), provider.getSeconds());
  for (const [action, expected] of [['fajr', 'fast_day'], ['approaching_maghrib', 'approaching_iftar'], ['maghrib', 'iftar']]) {
    provider.simulate(action); state = synchronizeFastingSimulation(state, provider.getSnapshot(), provider.getSeconds(), steps);
    assert.equal(state.stepId, expected); assert.equal(provider.getSnapshot().isAuthoritativeTime, false);
  }
  const done = transitionTarget(steps.find((step) => step.id === 'iftar'), steps);
  assert.equal(done.id, 'fast_done'); assert.equal(done.guidanceType, 'ui');
  assert.match(done.instruction.ar, /التعلّم/); assert.match(done.instruction.en, /not evidence/);
});
test('Simulation never changes real evidence, prerequisites or performed-worship answers', () => {
  const state = initial();
  state.temporalEvidence = { source: 'external-test-evidence', verified: false };
  state.answers.actualFastCompleted = false;
  const after = sync(state, time.DEMO_MAGHRIB_SECONDS);
  assert.deepEqual(after.temporalEvidence, state.temporalEvidence);
  assert.deepEqual(after.prerequisites, state.prerequisites);
  assert.deepEqual(after.answers, state.answers);
  assert.deepEqual(after.completedSteps, state.completedSteps);
  assert.ok(!after.completedSteps.includes('fast_done'));
});
test('Clock cannot impersonate real/authoritative time', () => {
  const state = initial(); const context = time.simulatedTimeContext(time.DEMO_MAGHRIB_SECONDS);
  assert.equal(synchronizeFastingSimulation(state, { ...context, mode: 'real' }, time.DEMO_MAGHRIB_SECONDS, steps), state);
  assert.equal(synchronizeFastingSimulation(state, { ...context, isAuthoritativeTime: true }, time.DEMO_MAGHRIB_SECONDS, steps), state);
});
test('Review navigation remains available; one phase is not replayed each second', () => {
  const state = sync(initial(), time.DEMO_FAJR_SECONDS);
  const reviewing = { ...state, stepId: 'suhoor', stageId: 'before_fajr' };
  assert.equal(sync(reviewing, time.DEMO_FAJR_SECONDS + 1).stepId, 'suhoor');
});
test('Completion remains educational and the clock never auto-completes a fast', () => {
  const state = { ...sync(initial(), time.DEMO_MAGHRIB_SECONDS), stepId: 'fast_done', stageId: 'completion' };
  assert.equal(sync(state, time.DEMO_MAGHRIB_SECONDS).stepId, 'fast_done');
});
test('Time is drift-corrected, pauses cleanly, resumes and clamps at zero', () => {
  let now = 0;
  const provider = new SimulatedFastingClockProvider(time.DEMO_FAJR_SECONDS - 2, () => now);
  const unsubscribe = provider.subscribe(() => {});
  now = 1000; assert.equal(provider.getSnapshot().remainingTime, 1);
  now = 3000; assert.equal(provider.getSnapshot().target, 'maghrib');
  unsubscribe(); const paused = provider.getSeconds();
  now = 999000; assert.equal(provider.getSeconds(), paused);
  const off = provider.subscribe(() => {}); now += 1000;
  assert.equal(provider.getSeconds(), paused + 1);
  provider.simulate('maghrib'); now += 86400000;
  assert.equal(provider.getSnapshot().remainingTime, 0); assert.equal(provider.getSnapshot().journeyStage, 'iftar');
  off();
});
test('Simulation persists and restores without interpreting wall-clock time', () => {
  const state = sync(initial(), time.DEMO_APPROACHING_SECONDS);
  const restored = restoreSession(JSON.stringify(state), initial(), steps);
  assert.equal(time.validSimulation(restored.fastingSimulation), true);
  const provider = new SimulatedFastingClockProvider(restored.fastingSimulation.secondsSinceMidnight);
  assert.equal(provider.getSnapshot().remainingTime, 300); assert.equal(provider.getSnapshot().isAuthoritativeTime, false);
});
test('Corrupt, backwards or mismatched simulation updates are rejected', () => {
  assert.equal(time.validSimulation({ version: 1, secondsSinceMidnight: '64800', journeyStage: 'iftar' }), false);
  assert.equal(time.validSimulation({ version: 1, secondsSinceMidnight: 64800, journeyStage: 'before_fajr' }), false);
  const state = sync(initial(), time.DEMO_APPROACHING_SECONDS);
  assert.equal(sync(state, time.DEMO_FAJR_SECONDS), state);
  assert.equal(sync(state, Number.NaN), state);
});
test('Clock events cannot mutate the prayer journey', () => {
  const prayer = { ...initial(), journeyId: 'first_prayer', stepId: 'phone_aside_start', stageId: 'ready' };
  assert.equal(sync(prayer, time.DEMO_MAGHRIB_SECONDS), prayer);
});
console.log(`Passed ${passed} fasting simulation groups. Production/demo visibility is verified separately in the browser.`);
