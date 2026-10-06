# Implementation Roadmap

## Phase 0: Audit and Decisions

Status: started.

Deliverables:

- repository audit
- research notes
- architecture decision record
- safety policy
- evaluation plan
- source coverage audit

## Phase 1: Modularize Current MVP

Extract from `src/App.tsx`:

- `src/domain/journey`
- `src/domain/content`
- `src/domain/ask`
- `src/domain/safety`
- `src/domain/i18n`

Keep behavior identical while making it testable.

## Phase 2: Content Registry

Move inline religious content to structured data:

- sources
- atomic steps
- glossary
- claims
- KnowledgeItems
- evaluation cases

Add stricter validation:

- no religious step without source or `needs_review`
- no approved item with missing source
- no answer item without claim IDs

## Phase 3: Evaluation Runner

Build an executable evaluator that runs:

- journey transition tests
- retrieval cases
- answer cases
- unsupported/refusal cases
- overgeneralization cases

Add `npm run eval`.

## Phase 4: Backend API

Add a small backend only after Phase 1-3:

- content API
- ask API
- retrieval API
- evaluation logging
- server-side LLM keys

## Phase 5: Hybrid Retrieval

Add:

- lexical retrieval
- multilingual embeddings
- reranking
- approved-source filters
- claim-level evidence

Do not allow arbitrary web retrieval for religious answers.

## Phase 6: Constrained LLM Answers

Add LLM generation only with:

- structured output
- retrieved claim context
- source IDs
- post-generation safety gate
- deterministic fallback
- regression tests

## Phase 7: Production Hardening

Add:

- review workflow
- telemetry
- audit logs
- error monitoring
- state migrations
- accessibility testing
- designer frontend integration
