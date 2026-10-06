import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const prepared = JSON.parse(await readFile(path.join(root, 'data/media-review/prepared-audio.json'), 'utf8'));
const decisions = JSON.parse(await readFile(path.join(root, 'data/media-review/audio-decisions.json'), 'utf8'));
const canonical = ts.transpileModule(await readFile(path.join(root, 'src/domain/prayer.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { prayerMovements } = await import(`data:text/javascript;base64,${Buffer.from(canonical).toString('base64')}`);
const accepted = [];
for (const decision of decisions) {
  if (decision.pronunciationReview?.status !== 'approved' || decision.rights?.status !== 'cleared') continue;
  const candidate = prepared.find((asset) => asset.id === decision.id);
  const phrase = prayerMovements.map(row => row.recitation).find(row => row?.id === decision.id);
  if (!candidate || !phrase || candidate.phrase !== phrase.arabic || candidate.sourceId !== phrase.sourceId || decision.sourceId !== candidate.sourceId) throw new Error('Decision must match the canonical phrase and approved source');
  if (!candidate || !/^[a-z_]+$/.test(candidate.id) || !decision.pronunciationReview.reviewer?.trim() || !decision.pronunciationReview.date || !decision.rights.evidence?.trim()) throw new Error('Incomplete signed review/rights decision');
  const file = path.join(root, 'data/media-review/clips', candidate.id + '.mp3');
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  if (hash !== decision.sha256 || hash !== candidate.sha256 || decision.phrase !== candidate.phrase) throw new Error('Review does not bind the exact current phrase/file');
  accepted.push({ ...candidate, url: '/media/audio/' + candidate.id + '.mp3', pronunciationReview: decision.pronunciationReview, rights: decision.rights, transliteration: decision.transliteration, meaning: decision.meaning });
}
await mkdir(path.join(root, 'public/media/audio'), { recursive: true });
for (const asset of accepted) await copyFile(path.join(root, 'data/media-review/clips', asset.id + '.mp3'), path.join(root, 'public/media/audio', asset.id + '.mp3'));
await writeFile(path.join(root, 'public/data/media/audio.json'), JSON.stringify(accepted, null, 2));
console.log(`Published ${accepted.length} signed, rights-cleared, phrase-bound assets. No draft enters the learner UI.`);
