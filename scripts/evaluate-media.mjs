import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

async function load(file) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const { steps } = await load('../src/domain/content.ts');
const { wuduVisuals, prayerVisuals, visualForPrayer } = await load('../src/domain/media.ts');
const { prayerMovements } = await load('../src/domain/prayer.ts');
const { buildPrayerSequence, prayerUnitCounts } = await load('../src/domain/prayer-sequence.ts');
const { audioForRecitation, publishableAudio } = await load('../src/domain/recitation-audio.ts');
assert.equal(wuduVisuals.length, 9);
assert.equal(prayerVisuals.length, 11);
for (const assets of [wuduVisuals, prayerVisuals]) {
  for (const asset of assets) {
    assert.ok(asset.locator && asset.alt.ar && asset.alt.en);
    assert.ok(asset.cell >= 0 && asset.cell < 9);
    const file = await readFile(new URL('../public' + asset.src, import.meta.url));
    assert.equal(file.subarray(1, 4).toString(), 'PNG');
    assert.ok(file.readUInt32BE(16) >= 900 && file.readUInt32BE(20) >= 900);
  }
}
for (let i = 0; i < wuduVisuals.length - 1; i++) {
  assert.equal(steps.find(step => step.id === wuduVisuals[i].id).next, wuduVisuals[i + 1].id);
}
for (const [prayer, units] of Object.entries(prayerUnitCounts)) {
  for (const node of buildPrayerSequence(steps, prayer).filter(node => node.templateId?.startsWith('prayer_'))) {
    const asset = visualForPrayer(node.templateId, node.unitNumber, units);
    assert.ok(asset, node.id + ' has a real visual');
    if (node.templateId === 'prayer_taslim') assert.equal(asset.framing, 'upper_body');
    if (node.templateId === 'prayer_tashahhud' && units > 2 && node.unitNumber === units) assert.equal(asset.cell, 7);
  }
}
const candidates = JSON.parse(await readFile(new URL('../data/media-review/prepared-audio.json', import.meta.url), 'utf8'));
assert.equal(candidates.length, 7);
for (const candidate of candidates) {
  const recitation = prayerMovements.map(row => row.recitation).find(row => row?.id === candidate.id);
  assert.equal(candidate.phrase, recitation.arabic);
  assert.equal(candidate.sourceId, recitation.sourceId);
  assert.equal(publishableAudio(candidate), false);
  assert.equal(audioForRecitation(recitation, [candidate]), undefined);
  const url = new URL('../data/media-review/clips/' + candidate.id + '.mp3', import.meta.url);
  const bytes = await readFile(url);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), candidate.sha256);
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', decodeURIComponent(url.pathname).replace(/^\/(\w:)/, '$1'), '-f', 's16le', '-ac', '1', '-ar', '16000', 'pipe:1'], { maxBuffer: 32 * 1024 * 1024 });
  let peak = 0;
  for (let i = 0; i < pcm.length; i += 2) peak = Math.max(peak, Math.abs(pcm.readInt16LE(i)));
  assert.ok(pcm.length > 16000 && peak > 100, candidate.id + ' contains actual non-silent audio');
}
// Synthetic approval fixtures test the gate only; they never publish an asset.
const recitation = prayerMovements.find(row => row.recitation?.id === 'takbir').recitation;
const fixture = { ...candidates[0], url: '/media/audio/takbir.mp3', pronunciationReview: { status: 'approved', reviewer: 'TEST FIXTURE ONLY', date: '2026-10-04' }, rights: { status: 'cleared', evidence: 'TEST FIXTURE ONLY' } };
assert.equal(audioForRecitation(recitation, [fixture]), fixture);
for (const mutation of [{ phrase: 'different' }, { sourceId: 'unapproved' }, { id: 'other' }, { sha256: 'bad' }, { url: 'https://external.invalid/audio.mp3' }, { pronunciationReview: { status: 'needs_review' } }, { pronunciationReview: { status: 'approved', reviewer: 5 } }, { rights: undefined }, { rights: { status: 'unknown' } }]) {
  assert.equal(audioForRecitation(recitation, [{ ...fixture, ...mutation }]), undefined);
}
assert.equal(publishableAudio(null), false);
const registry = JSON.parse(await readFile(new URL('../public/data/media/audio.json', import.meta.url), 'utf8'));
for (const asset of registry) assert.equal(publishableAudio(asset), true);
console.log('Media passed: 9 ordered Wudu visuals, 11 prayer mappings, all five prayer sequences, 7 non-silent real review clips, strict phrase/review/rights gates.');
