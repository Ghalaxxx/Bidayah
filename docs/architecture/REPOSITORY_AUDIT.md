# Repository Audit

Date: 2026-10-03

## Scope

This audit covers the current Bidayah repository in:

`C:\Users\ghala\Downloads\هاكثون باذل`

The product scope remains limited to:

- First Prayer
- First Fast

No new religious domains should be added until the source, review, retrieval, and evaluation workflow is reliable for these two journeys.

## Current Repository Shape

| Area | Current state | Production concern |
| --- | --- | --- |
| Frontend | Vite + React + TypeScript app. Most product logic is in `src/App.tsx`. | UI, journey engine, content, retrieval, state, and safety are tightly coupled. |
| Styling | `src/App.css` implements the current polished phone-style interface. | Designer frontend can replace this later if service contracts are stable. |
| Journey engine | Deterministic step transitions inside `src/App.tsx`. | Needs extraction into a pure, testable module. |
| State | `JourneyState` is persisted in `localStorage` under `bidayah_state`. | Good for MVP, but production needs versioned state migrations and optional account sync. |
| Sources | Four approved source records live in `public/data/sources/sources.json`, duplicated conceptually in `src/App.tsx`. | Sources need one canonical content registry. |
| Knowledge base | KnowledgeItems are inline in `src/App.tsx`. | Not scalable, not easy to review, no ingestion/review workflow. |
| Ask Bidayah | Deterministic keyword/context retrieval in `resolveAnswer()`. | This is not real RAG and not an LLM system. It is a useful baseline and safety oracle. |
| Evaluation | `data/evaluation/evaluation-cases.json` contains 13 cases, including overgeneralization checks. | Needs executable evaluator, regression gates, and retrieval/generation metrics. |
| Validation | `scripts/validate-content.mjs` checks sources, glossary, and evaluation references. | Does not validate inline app content or religious claim coverage. |
| Backend | None. | Required before real LLM/RAG if keys, logs, embeddings, and safety gates are needed. |

## What Is Real Today

- A working local React MVP.
- Deterministic journey navigation for First Prayer and First Fast.
- Basic source IDs and visible source panels.
- Beginner glossary handling for questions like "ايش هي القبلة؟".
- Guardrail behavior for unsupported personal cases.
- Specific evaluation cases preventing unsupported Iftar date-number claims.
- Prayer UX correction: Do Now prepares before prayer; Learn First is practice/review.

## What Is Not Real Yet

- No live LLM call.
- No vector database.
- No embeddings.
- No reranker.
- No server-side source ingestion.
- No human review console.
- No structured claim ledger.
- No automated RAG faithfulness scoring.
- No telemetry or production observability.

## Main Risks

1. **Religious provenance drift**  
   Inline content can be changed without a review trail. Every religious claim needs a source-backed claim record or `NEEDS_REVIEW`.

2. **Overgeneralization**  
   The product must not transfer a Sunnah, number, dua, sequence, requirement, or recommendation from one context to another without explicit approved-source support.

3. **Frontend lock-in**  
   The current UI is useful, but the future designer frontend should consume stable journey and answer services rather than reimplementing religious logic.

4. **LLM overreach**  
   A generic chat model must not decide ritual order or invent rulings. The Journey Engine owns sequence; retrieval provides approved context; generation is constrained.

5. **False sense of RAG**  
   Keyword retrieval with source IDs is not sufficient for production religious QA. It should remain as a deterministic fallback and evaluation baseline.

## Recommended Refactor Boundaries

| Module | Responsibility |
| --- | --- |
| `journey-engine` | Deterministic journey state, transitions, prerequisites, mode behavior. |
| `content-registry` | Sources, atomic steps, glossary entries, KnowledgeItems, review status. |
| `retrieval-service` | Hybrid lexical/semantic retrieval over approved content only. |
| `answer-service` | Source-grounded response generation or refusal. |
| `safety-service` | Unsupported scope detection, personal-case escalation, provenance checks. |
| `evaluation-runner` | Regression tests for retrieval, answers, refusals, and overgeneralization. |
| `frontend-adapter` | Thin interface consumed by current or future UI. |

## Immediate Engineering Rule

Do not add an LLM SDK or vector database until the content model, source coverage, evaluation gates, and service interfaces are documented and partially extracted.
