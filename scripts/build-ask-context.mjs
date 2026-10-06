import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';

async function load(file) {
  const text = await readFile(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const { steps } = await load('../src/domain/content.ts');
const { buildPrayerSequence, prayerUnitCounts } = await load('../src/domain/prayer-sequence.ts');
const project = node => ({ id: node.id, subjectStep: node.templateId ?? node.id, journeyId: node.journeyId, stageId: node.stageId, title: node.title, next: node.next, unitNumber: node.unitNumber, totalUnits: node.totalUnits });
const registry = { first_prayer: Object.fromEntries(Object.keys(prayerUnitCounts).map(prayer => [prayer, buildPrayerSequence(steps, prayer).filter(node => node.journeyId === 'first_prayer').map(project)])), first_fast: steps.filter(node => node.journeyId === 'first_fast').map(project) };
await mkdir(new URL('../data/ask/', import.meta.url), { recursive: true });
await writeFile(new URL('../data/ask/journey-context.json', import.meta.url), JSON.stringify(registry, null, 2));
console.log('Ask context projected from existing journey nodes; no journey content or transitions changed.');
