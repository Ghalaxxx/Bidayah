import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const files = execFileSync('git', ['ls-files', '--cached', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const patterns = [
  /sk-(?:proj-)?[A-Za-z0-9_-]{24,}/u,
  /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/u,
  /AKIA[A-Z0-9]{16}/u,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
  /https?:\/\/[^\s/]+:[^\s/@]+@/u,
  /[?&](?:access_token|api_key|token)=[A-Za-z0-9_-]{20,}/u,
];
const findings = [];
for (const file of files) {
  if (/(?:^|\/)(?:\.env(?:\..+)?|id_rsa|id_ed25519|credentials\.json)$/u.test(file) && file !== '.env.example') findings.push(`${file}: sensitive filename`);
  if (/\.(?:png|jpg|jpeg|woff2?|mp3|mp4|pdf)$/u.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (let i = 0; i < patterns.length; i++) if (patterns[i].test(text)) findings.push(`${file}: credential pattern ${i + 1}`);
}
if (findings.length) { console.error(findings.join('\n')); process.exitCode = 1; }
else console.log(`No high-confidence credential patterns or forbidden secret filenames in ${files.length} staged files. Heuristic scan, not a guarantee.`);
