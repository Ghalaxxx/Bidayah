import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const review = path.join(root, 'data/media-review');
const spec = JSON.parse(await readFile(path.join(review, 'audio-candidates.json'), 'utf8'));
const input = path.join(review, 'prayer-book-narration.mp3');
await mkdir(path.join(review, 'clips'), { recursive: true });
const assets = [];
for (const candidate of spec.candidates) {
  if (!/^[a-z_]+$/.test(candidate.id)) throw new Error('Invalid clip identifier');
  const clips = candidate.ranges.map(([start, end]) => {
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) throw new Error('Invalid source interval');
    return execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-ss', String(start), '-t', String(end - start), '-i', input, '-f', 's16le', '-ar', '44100', '-ac', '1', 'pipe:1'], { maxBuffer: 32 * 1024 * 1024 });
  });
  const file = path.join(review, 'clips', candidate.id + '.mp3');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', '96k', file], { input: Buffer.concat(clips) });
  const sha256 = createHash('sha256').update(await readFile(file)).digest('hex');
  assets.push({ id: candidate.id, phrase: candidate.phrase, sourceId: 'prh_prayer_binbaz_001', url: '/api/media-review/' + candidate.id + '.mp3', sha256, ranges: candidate.ranges, pronunciationReview: { status: 'needs_review' }, rights: { status: spec.rightsStatus }, origin: spec.recordingPage });
}
await writeFile(path.join(review, 'prepared-audio.json'), JSON.stringify(assets, null, 2));
console.log(`Prepared ${assets.length} actual clips for local review only. No asset approved or published.`);
