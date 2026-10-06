# Bidayah | بداية

**A gentle, practical first step into Islam.**

Bidayah helps zero-knowledge beginners prepare for their first prayer and first fast. It combines bilingual, illustrated learning journeys with contextual questions grounded in an approved source set.

## Problem and Solution

Beginners need to know what matters now, what comes next and what unfamiliar terms mean. Bidayah presents the current action, its explanation and source rather than disconnected information. It teaches and prepares **before worship**, never as a live phone companion during prayer.

## Main Features

- First Prayer: Wudu readiness and illustrations, Qiblah preparation, all five prayer sequences, readiness checklist and phone-aside boundary.
- First Fast: intention, Suhoor, daytime guidance, Iftar and a visibly labeled simulated countdown.
- Arabic RTL and English LTR, source links and browser-local saved progress.
- Ask Bidayah: contextual short questions, scoped follow-up memory and safe escalation.
- Visual teaching assets and a pronunciation/rights-gated audio pipeline. Unapproved recordings are not exposed to learners.

## Ask Bidayah and Architecture

```text
Question + JourneyState + scoped conversation
  -> separate subject and intent resolution
  -> approved subject/intent evidence filtering
  -> structured retrieval (+ optional semantic ranking)
  -> safety checks
  -> extractive answer or constrained optional LLM
  -> citation validation and source links
```

At Qiblah, `لازم؟` asks whether facing Qiblah is required; at Suhoor it asks whether Suhoor is required. Definitions cannot establish requirements. Recommendations and numbers cannot be transferred between religious contexts. Unsupported or personal cases safely escalate.

Without a key, Ask works through real structured retrieval. Optional OpenAI generation is server-only, evidence-constrained and checked again for support. The LLM never controls journey transitions.

**Stack:** React 19, TypeScript 6, Vite 8, Lucide, local font assets and Node.js HTTP APIs. Journey transitions and simulation boundaries are deterministic. Approved JSON evidence is loaded by the server; the default demo requires no database or vector service. Progress persists in the current browser's `localStorage`.

## Project Structure

```text
src/                    UI, domain/journey logic, components, services and hooks
public/                 Runtime visuals, icons and source/audio registries
server/                 Ask retrieval, safety, optional AI and production host
api/                    Vercel adapters for the existing server API
data/ask/               Generated journey context and suggested questions
data/knowledge/         KnowledgeItems and intent-specific evidence facets
data/evaluation/        Executable question fixtures
data/media-review/      Review metadata; uncleared recordings stay local
data/sources/review/    Source evidence; large recordings stay local
scripts/                Validation, regression tests and source/media tooling
docs/                   Architecture, research, safety and QA evidence
vercel.json             Vite output plus same-origin Node.js functions
.env.example            Safe configuration template, never credentials
```

The designer reference bitmap in the repository root is a required imported asset. Backups, dependencies, build output and local review recordings are ignored, not deleted.

## Install and Run

Prerequisites: **Node.js 22.12+ or Node.js 24** and npm. Internal audio verification additionally needs FFmpeg and locally held review recordings.

```bash
git clone https://github.com/Ghalaxxx/Bidayah.git
cd Bidayah
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Development serves the UI and Ask API together. No environment variables are required for retrieval-only operation.

For optional AI, copy `.env.example` to `.env` locally and fill only the needed values. Never put credentials in `VITE_` variables, browser storage or commits. Development and production Node launchers load `.env`; hosting dashboards supply production secrets.

| Variable | Purpose / safe default |
| --- | --- |
| `OPENAI_API_KEY` | Optional server-only key; blank uses retrieval-only |
| `BIDAYAH_LLM_MODEL` | Generator/verifier; `gpt-4.1-mini` |
| `BIDAYAH_EMBEDDING_MODEL` | Cloud embeddings; `text-embedding-3-small` |
| `BIDAYAH_SEMANTIC` | Cloud semantic ranking; `false` |
| `BIDAYAH_LOCAL_EMBEDDINGS` | Optional Python worker; `false` |
| `BIDAYAH_PYTHON` | Worker executable; `python` |
| `PORT`, `HOST` | Local production host; `3001`, `127.0.0.1` |
| `VITE_DEMO_CONTROLS` | Non-secret demo build flag; `false` |

```bash
npm run build
npm start
```

Open `http://127.0.0.1:3001`. Unlike static `vite preview`, `npm start` serves both built assets and the API. `npm run api` starts the API alone for reverse-proxy setups.

## Reproduce the Demo

1. Begin, select First Prayer and enter preparation directly. Review Wudu and Qiblah; ask `لازم؟` (English: `Is it required?`). Confirm a direct sourced answer.
2. Select a prayer, review its illustrated steps and reach the readiness/phone-aside screen. Actual prayer is performed away from the phone.
3. Start First Fast. Review intention and Suhoor; ask `طيب لازم؟`, then `طيب لو ما أكلت؟`.
4. Simulation starts at 04:45, targets demo Fajr 05:00, then demo Maghrib 18:00. Development controls jump to Fajr, approaching Maghrib and Maghrib. Iftar learning unlocks in the simulation, never as evidence of real local timing.

For an explicit hackathon demo deployment, set `VITE_DEMO_CONTROLS=true` and build with `npm run build -- --mode demo`. Normal production uses `npm run build` and hides jump controls. Both modes clearly label timing as simulation.

## Verification

```bash
npm run lint
npm run validate:content
npm run evaluate:ask
node scripts/evaluate-entry-simplification.mjs
node scripts/evaluate-deployment.mjs
npm run build
```

The contextual suite covers 287 question instances, both languages, follow-ups, safety and citations. These finite regression results are not a universal accuracy guarantee or scholarly certification.

`npm run evaluate:product` adds graph, five-prayer, simulation and internal audio tests. Audio checks require FFmpeg and local review recordings, deliberately not redistributed on GitHub. See [media review](docs/qa/MEDIA_IMPLEMENTATION.md).

## Deployment

**Vercel configuration is included.** Import this repository, use its root, Node.js 22 or 24, the Vite preset, `npm ci`, `npm run build` and output `dist`. Three `api/` adapters serve Ask, suggestions and health with the existing middleware. Knowledge JSON files are included in the function bundle.

Default deployment needs no secrets and uses retrieval-only. Set optional server variables in the hosting dashboard; keep local Python embeddings disabled on serverless hosting. Verify `/api/health`, a sourced Ask answer and the journeys afterward. A traditional Node host can run `npm start` behind HTTPS with platform-provided `HOST` and `PORT`.

[Submission verification](docs/qa/FINAL_SUBMISSION.md) records actual deployment/GitHub status. Configuration alone does not prove a public deployment succeeded. Hosting reference: [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js).

## Sources and Limitations

Approved content is the official Haramain Wudu, prayer and fasting material plus the specified official Ibn Baz Suhoor ruling. Canonical links and locators are preserved in source and knowledge records.

- No real prayer-time service, real compass, location collection, accounts or cloud progress sync.
- Simulated time never establishes real Fajr/Maghrib or marks worship performed.
- Evidence does not cover every ruling, phrase meaning or pronunciation; unsupported cases safely escalate.
- Audio publication requires qualified pronunciation review and redistribution permission. The current public audio registry is empty; internal clips are not production-approved.
- Live LLM/embedding quality is not certified by stubbed tests. Broader public use needs independent religious review and operational protections such as provider-budget/rate controls.

References: [Ask QA](docs/qa/ASK_INTELLIGENCE.md), [entry QA](docs/qa/ENTRY_SIMPLIFICATION.md), [simulation safety](docs/qa/FASTING_SIMULATION.md), [AI runtime](docs/integration/AI_RUNTIME.md).
