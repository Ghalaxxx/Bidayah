# Ask Bidayah Intelligence Pass

Verification date: 2026-10-05 (Asia/Riyadh).

Resumed the interrupted implementation in place. No existing changes were reverted. This directory is untracked within the enclosing Git repository (`git status --short -- .` reports `?? ./`), so there is no trustworthy tracked per-file baseline or historical diff. The inspected partial implementation, not Git metadata, was used to continue the work.

## Implementation

- Separate subject and 22-intent resolution; canonical step, mode, language, prayer selection, history and immediate conversational references.
- Internal contextual expansion; no expanded query is rendered to learners.
- Reviewed subject/intent facets filter evidence before lexical or optional semantic ranking. Requirement/validity cannot fall back to definition-only evidence.
- Voice-intention evidence answers speaking questions, not whether intention itself is required. Unknown referents cannot inherit an unrelated requirement.
- Scoped memory validated against approved knowledge and reset across step, journey, locale, mode, session and prayer selection. Closing/reopening Ask clears memory; pending stale responses cannot update a new session.
- Recitation meaning/pronunciation resolves to the phrase, not the movement. Without approved explanation/pronunciation evidence, it safely abstains.
- Next/previous questions use the actual journey graph, not the last discussed movement. Source follow-ups cite the immediately discussed approved item.
- All displayed bilingual question chips use the same resolver and approved retrieval guards. Unsafe/unanswerable suggestions are hidden; tests also assert every reviewed catalog chip remains available.
- Optional LLM generation is grounded in the selected facet, with citation membership and entailment gates. Sensitive requirement, number, timing and graph-navigation answers remain extractive. Semantic ranking is bounded and cannot introduce out-of-scope evidence.

## Results

`npm run build`: passed TypeScript project checking and Vite production build.

`npm run lint`: passed, no warnings after removing an unused evaluation import.

`npm run validate:content`: passed 4 source records, 30 KnowledgeItems, 41 intent facets, 16 glossary entries, 19 legacy cases and 48 bilingual contextual groups.

`npm run evaluate:product`: passed all included suites:

| Check | Result |
| --- | --- |
| Contextual question instances | 287 / 287 |
| Subject resolution | 287 / 287 (100%) |
| Intent resolution | 287 / 287 (100%) |
| Expected retrieval / abstention | 287 / 287 (100%) |
| Citation ID, source ID, verified source and exact locator integrity | 214 / 214 (100%) |
| Required safe escalation / phone boundary | 56 / 56 (100%) |
| Arabic | 151 / 151 |
| English | 136 / 136 |
| Follow-up and changed-step question instances | 26 / 26 |
| Question instances not equal to stored normalized variants | 221 / 221 |
| Reviewed catalog chips | 40 / 40 |
| Real HTTP contracts, chips, follow-ups and memory guards | 16 cases |
| Existing provenance/context/safety regression suite | 26 cases |
| LLM transport and grounding gates | 8 stubbed cases |
| Existing journey graph | 44 nodes plus restore/persona branches |
| Five prayer sequences | 17 / 30 / 30 / 24 / 30 screens |
| Fasting simulation | 13 groups |
| Existing media | 9 Wudu visuals, 11 prayer mappings, 7 internal non-silent audio clips and publication/review gates |

Additional memory assertions reject changed step, journey, language, mode, session, prayer selection, invented IDs and forged subject references in both languages.

These percentages describe this finite, deterministic regression set. They are not a universal language-understanding guarantee, a blind benchmark, or an independent religious-content certification. Citation integrity checks provenance metadata; they do not substitute for qualified scholarly review of source interpretation.

Full per-question input, expected and actual subject/intent/evidence, source IDs, answer, expansion and results are in `../evaluation/ask-contextual-results.json`. No remaining failing executable cases.

## Application Verification

Actual application tested at `http://127.0.0.1:5173/` through browser controls, not injected application state:

- First Prayer -> Qiblah -> Ask -> `لازم؟`: direct condition answer beginning `نعم، استقبال القبلة شرط في الصلاة` with the approved prayer source. Not a definition or simulation warning.
- Qiblah requirement question chip also works. English chip returns the equivalent direct requirement answer.
- Ruku definition -> what to say -> phrase meaning -> next: correct Ruku phrase, safe evidence-gap response for meaning, then canonical rise-from-Ruku step.
- After advancing to rise-from-Ruku, `وش أقول؟` answers the rise phrases and roles, not the previous Ruku phrase.
- Suhoor chip `طيب لازم؟` -> `طيب لو ما أكلت؟`: remains Suhoor and explains that missing Suhoor alone does not invalidate the fast, with the approved Ibn Baz citation.
- Existing fasting countdown visibly decreases and remains explicitly simulation-only. UI styling, journey nodes, visuals, audio files and simulation provider were not rewritten.

Screenshots: `ask-intelligence/qiblah-required-ar.png`, `qiblah-required-en.png`, `ruku-next-ar.png`, `suhoor-followup-ar.png`.

## Files

Implementation files completed or changed across the interrupted pass and this continuation:

- `server/ask-context.mjs`
- `server/retrieval.mjs`
- `server/api.mjs`
- `src/App.tsx` (Ask request/memory wiring and chips only; no design rewrite)
- `data/knowledge/ask-knowledge.json`
- `data/knowledge/ask-facets.json`
- `data/ask/question-suggestions.json`
- `data/ask/journey-context.json` (generated from existing journey nodes)
- `scripts/build-ask-context.mjs`
- `scripts/validate-content.mjs`
- `scripts/evaluate-ask-context.mjs`
- `scripts/evaluate-ask-api.mjs`
- `scripts/evaluate-llm-gates.mjs`
- `data/evaluation/ask-contextual-cases.json`
- `package.json`

Verification artifacts: this report, `docs/evaluation/ask-contextual-results.json`, the four screenshots above, and regenerated production build output.

Also inspected API declaration, existing tests, journey projection, all partial JSON files and Ask client connections. No unfinished markers, invalid JSON, unresolved imports or half-written branches remain in the scoped implementation.

## Genuine Limitations

- No live LLM/model-provider credentials were configured for these tests. LLM gates were exercised with explicit transport stubs; no live-model or live-embedding quality claim is made. The actual application was verified with real structured retrieval, not mocked answers.
- The approved set does not establish every requested ruling, phrase meaning or pronunciation. Examples include the explicit requirement to return hands during head wiping and source-supported pronunciation/translation of the Ruku phrase. These remain safe evidence-gap responses, not inferred religious answers.
- No new human scholarly approval, pronunciation review, audio rights clearance, or pilot-readiness certification is asserted. Existing publication gates remain unchanged.
