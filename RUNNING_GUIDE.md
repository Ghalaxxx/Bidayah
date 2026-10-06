# Bidayah Running Guide

Use the project root (the folder containing `package.json`) for every command below. No database is required. Do not enter API keys into a chat, commit, screenshot or browser console.

## 1. Prerequisites

- Node.js 22.12+ or Node.js 24, with npm.
- Git and a current browser.
- Optional: a funded OpenAI API account and API key for live LLM generation. Retrieval-only works without a key. ChatGPT subscription credit is not API credit.
- Only internal audio verification needs FFmpeg and the locally held review recordings. These recordings are not included in the public repository. Optional local semantic ranking additionally needs the Python setup described in `docs/integration/LOCAL_SEMANTIC_RETRIEVAL.md`; leave it disabled for normal setup and Vercel.

Check installed tools:

```powershell
node --version
npm --version
git --version
```

## 2. Clone and Enter the Project

```powershell
git clone https://github.com/Ghalaxxx/Bidayah.git
cd Bidayah
```

For the existing laptop checkout instead:

```powershell
cd "C:\Users\ghala\Downloads\هاكثون باذل"
```

Confirm `package.json` is present. `npm` will not find the project if run from `C:\Users\ghala`.

## 3. Install Dependencies

Stop this project's running development server with Ctrl+C before reinstalling, especially on Windows where native modules can be locked.

```powershell
npm ci
```

This uses the committed npm lockfile. Do not delete the lockfile to work around errors.

## 4. Configure the Environment

Only if `.env` does not already exist:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux, use `cp .env.example .env`. The `.env` file must be directly beside `package.json`, not in `src` or `public`. When using Notepad, select All Files when saving so the filename does not become `.env.txt`.

Edit `.env`, not `.env.example`. To enable the LLM, replace the blank key with your private key:

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
BIDAYAH_LLM_MODEL=gpt-4.1-mini
BIDAYAH_EMBEDDING_MODEL=text-embedding-3-small
BIDAYAH_SEMANTIC=false
BIDAYAH_LOCAL_EMBEDDINGS=false
BIDAYAH_PYTHON=python
PORT=3001
HOST=127.0.0.1
VITE_DEMO_CONTROLS=false
```

Do not literally use the placeholder as a key. Leave `OPENAI_API_KEY` empty for retrieval-only. The LLM key is optional for the application, required for live generation. Model variables choose generation and optional cloud embedding models; semantic flags default off. `PORT`/`HOST` configure the local production host. `VITE_DEMO_CONTROLS` is a non-secret build flag, not a place for credentials.

Node launch scripts load `.env` automatically. Restart after changing it. Never rename the key to `VITE_OPENAI_API_KEY` or `NEXT_PUBLIC_OPENAI_API_KEY`; these names imply client-side exposure.

Check exclusion without printing the secret:

```powershell
git check-ignore .env
git status --short
```

`.env` should be reported as ignored and should not appear among changes to commit.

## 5. Start Development and Open the App

```powershell
npm run dev
```

Open `http://localhost:5173/`, or the Local URL printed by Vite if that port is occupied. Keep the terminal open. Ctrl+C stops the server. This command serves both the UI and API; a separate `npm run api` is unnecessary.

## 6. Test the Main Application

1. Enter from Welcome and select a language.
2. Choose First Prayer; follow readiness, Wudu if needed and Qiblah preparation. Check illustrations and source links.
3. Select a prayer and review the movements, then reach the phone-aside screen. The actual prayer is performed without following the phone.
4. Return home and choose First Fast. Check intention, Suhoor and the compact simulated countdown.
5. In development, use the demo Fajr/approaching-Maghrib/Maghrib controls. Verify daytime -> approaching Iftar -> Iftar guidance -> completion. These times are never evidence of real local timing.
6. Check Previous/Next, return navigation, English/Arabic and refresh/resume. Browser-local progress is not synced across devices.

## 7. Test Ask Bidayah

At Qiblah, open Ask and send `لازم؟` or `Is it required?`; expect a sourced requirement answer, not just a definition or simulated-compass warning. Test suggested question chips.

Ask `وش الركوع؟` or `What is bowing in prayer?`. With a funded working API key, a supported generation request can return `mode: "llm-rag"`. In browser Developer Tools -> Network -> `/api/ask` -> Response, inspect `mode` and citations. No secret is sent by the browser.

Test follow-ups: `طيب وش أقول فيه؟`, then `وبعدين؟`. Moving to another journey step must reset question memory safely. Unsupported personal rulings should escalate instead of inventing answers.

Open `/api/health`: `llmConfigured: true` means a key is present, not that billing or generation succeeded. Requirement, validity, count, timing and next-action questions intentionally use reviewed extractive answers even with the LLM enabled. Provider failures return safe retrieval fallback rather than unsupported generation.

## 8. Build and Test Production Locally

```powershell
npm run lint
npm run validate:content
npm run build
npm start
```

Open `http://127.0.0.1:3001/`. If occupied, in PowerShell use `$env:PORT='3012'` before `npm start`, and open port 3012. `npm start` serves built assets plus Ask. `npm run preview` is only a static preview and is not a complete API deployment.

Regression checks (stop the production terminal with Ctrl+C first, or use another terminal):

```powershell
npm run evaluate:ask
node scripts/evaluate-ask-api.mjs
node scripts/evaluate-llm-gates.mjs
node scripts/evaluate-entry-simplification.mjs
node scripts/evaluate-deployment.mjs
node scripts/evaluate-fasting-simulation.mjs
node scripts/evaluate-prayer-sequence.mjs
```

`npm run evaluate:product` includes all main regression checks and internal media checks. Its audio test needs the non-distributed recordings and FFmpeg; a clean public clone can run the other tests above without them. Stubbed LLM tests do not prove live generation works.

## 9. Deploy through Vercel GitHub Integration

1. Sign into the intended Vercel account; connect GitHub through account Login Connections and authorize access to `Ghalaxxx/Bidayah`.
2. Add New -> Project -> import that existing repository. Do not create another GitHub repository.
3. Use the repository root, Vite framework, Node 22 or 24, install `npm ci`, build `npm run build`, output `dist`.
4. Keep the included `vercel.json` and `api/` adapters. Deploying only `dist` to a static site omits Ask.
5. Configure the private environment variables below before deploying. Keep local Python embeddings disabled.
6. Deploy, wait for Ready and open the production domain. Record the actual URL; do not infer deployment success from configuration alone.

Normal production hides demo clock-jump controls. For an explicitly labeled hackathon demo deployment only, set `VITE_DEMO_CONTROLS=true` and override Build Command with `npm run build -- --mode demo`. The clock remains non-authoritative in either build.

## 10. Configure the Key in Vercel

Vercel Project -> Settings -> Environment Variables -> Add:

- Name: `OPENAI_API_KEY`
- Value: the private key, entered only in the hosting dashboard
- Environment: Production; select Preview/Development only if deliberately needed
- Save -> Deployments -> Redeploy the intended production deployment

Use encrypted/sensitive storage where offered. Set `BIDAYAH_LLM_MODEL=gpt-4.1-mini` if overriding the default. Local `.env` is never uploaded. Every environment change needs a new deployment before it applies to a running deployment. Never disclose the secret in logs or support screenshots.

## 11. Optional Vercel CLI Deployment

From the same project root, for an account authorized to this project:

```powershell
npx vercel login
npx vercel link
npx vercel env add OPENAI_API_KEY production
npx vercel --prod
```

Select the existing intended project during linking. Enter the key at the interactive secret prompt, not in the command line. CLI deployment does not replace GitHub integration for automatic pushes. Vercel access must be authorized; do not work around a login/access error by publishing secrets or creating an unrelated project.

## 12. Verify the Public Deployment

Use the public URL, not localhost. Repeat the main journeys, navigation, illustrations, source links, Arabic and English checks from sections 6-7. Confirm `/api/health` and successful `/api/ask`/suggestion requests in Network. Test a supported definition that actually returns `llm-rag`, not just `llmConfigured`.

Inspect browser Console for errors, Network for failed assets/API responses, and Vercel runtime/build logs for failures. A successful build is not proof of runtime correctness. Do not label production AI verified until an actual generated answer and its approved citation have been checked.

## 13. Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `ENOENT ... package.json` | Wrong current directory | Enter the directory containing `package.json`. |
| Windows `EPERM` installing | Native module held by dev server | Stop this project's server with Ctrl+C, retry `npm ci`; do not kill unrelated processes. |
| Dependencies unavailable | Node version, network or npm installation issue | Verify prerequisites/network, then retry `npm ci` and read the first error. |
| `.env` not loaded | Wrong location, `.env.txt`, or stale server | Check the root filename and restart `npm run dev`/`npm start`. |
| Missing key / retrieval-only | No server-side key | Configure `.env` locally or Production variable on Vercel. |
| Local Ask works, Vercel does not | Missing Production key or no redeploy | Add Production variable, save and redeploy; verify live response mode. |
| Ask 404 on Vercel | Static-only deployment or missing API bundle | Import the whole repository and use its configuration, not only `dist`. |
| Key visible in browser | Secret placed in client-facing variable | Remove it, revoke/rotate it, and redeploy; never use `VITE_` for secrets. |
| Provider fallback or API 429 | Connectivity, exhausted API credit, or rate limit | Check API billing/model access and logs; avoid exposing key values. |
| Build failure | Missing dependency, unsupported Node or a real type error | Run `npm ci` and `npm run build`; fix the reported issue without redesign. |
| Audio suite fails on public clone | Local review media/FFmpeg absent | Run standard tests; public audio remains intentionally approval-gated. |
| Vercel GitHub-link error | GitHub Login Connection/access missing | Connect the intended GitHub account and grant repository access in Vercel. |

## 14. Update Later

From a clean working tree, before making changes:

```powershell
git pull --ff-only origin main
```

After edits, test and inspect before committing:

```powershell
npm run lint
npm run build
npm run evaluate:ask
git status --short
git diff
node scripts/check-submission-secrets.mjs
git add README.md RUNNING_GUIDE.md
git diff --cached
git commit -m "docs: update Bidayah run instructions"
git push origin main
```

The `git add` example stages documentation only; list the specific files you intentionally changed for other work. Never stage `.env`. With Git integration, a push to the configured production branch triggers a Vercel build; check Ready status and re-test the public application afterward.
