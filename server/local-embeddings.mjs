import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

let worker;
let sequence = 0;
const pending = new Map();
const cache = new Map();
function start() {
  if (worker) return;
  worker = spawn(process.env.BIDAYAH_PYTHON || 'python', [fileURLToPath(new URL('../scripts/embedding-worker.py', import.meta.url))], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  const fail = () => {
    for (const entry of pending.values()) { clearTimeout(entry.timer); entry.reject(new Error('Local embeddings unavailable')); }
    pending.clear(); worker = undefined;
  };
  worker.on('error', fail);
  worker.on('exit', fail);
  worker.stderr.on('data', () => {});
  createInterface({ input: worker.stdout }).on('line', (line) => {
    try {
      const response = JSON.parse(line);
      const entry = pending.get(response.id);
      if (!entry) return;
      pending.delete(response.id); clearTimeout(entry.timer);
      if (response.error || !Array.isArray(response.vectors)) entry.reject(new Error('Invalid embedding response'));
      else entry.resolve(response.vectors);
    } catch { /* Non-protocol stdout cannot become retrieved evidence. */ }
  });
  process.once('exit', () => worker?.kill());
}
export async function localEmbeddings(texts) {
  const missing = [...new Set(texts.filter((text) => !cache.has(text)))];
  if (missing.length) {
    start();
    const id = ++sequence;
    const vectors = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('Local embeddings timed out')); }, 45000);
      pending.set(id, { resolve, reject, timer });
      worker.stdin.write(JSON.stringify({ id, texts: missing }) + '\n', (error) => {
        if (error) { clearTimeout(timer); pending.delete(id); reject(error); }
      });
    });
    if (vectors.length !== missing.length || vectors.some((vector) => !Array.isArray(vector) || vector.length !== 384 || vector.some((value) => !Number.isFinite(value)))) throw new Error('Invalid vectors');
    missing.forEach((text, index) => cache.set(text, vectors[index]));
  }
  return texts.map((text) => cache.get(text));
}
export function closeLocalEmbeddings() { worker?.kill(); }
