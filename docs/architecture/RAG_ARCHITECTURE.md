# RAG Architecture

## Current State

The current app does not have real RAG. It has deterministic contextual retrieval in `resolveAnswer()` using:

- Arabic normalization
- keyword and variant matching
- current journey step context
- source ID checks
- safe fallback/refusal

This is valuable as a baseline, but it is not production RAG.

## Target Retrieval Pipeline

1. **Scope filter**
   - first_prayer
   - first_fast
   - unsupported

2. **Context filter**
   - current journey
   - current stage
   - current step
   - mode
   - language

3. **Safety precheck**
   - personal medical fasting case
   - complex fatwa
   - travel edge case
   - prompt injection
   - request to use non-approved sources

4. **Hybrid retrieval**
   - exact intent rules for high-risk questions
   - BM25-style lexical retrieval
   - multilingual embeddings
   - curated variants

5. **Reranking**
   - approved review status first
   - current step relevance
   - claim specificity
   - source priority

6. **Sufficiency check**
   - Are all needed claims present?
   - Are all claims approved?
   - Is the user asking for a detail the source does not specify?

7. **Generation**
   - structured output only
   - answer from retrieved claims only
   - no unsupported additions

8. **Post-generation provenance gate**
   - every religious sentence maps to claim IDs
   - source IDs exist
   - unsupported details are removed or refused

## Retrieval Index Units

Use claim-sized and answer-sized units, not arbitrary chunks only.

Recommended index records:

- `claim`
- `knowledge_item`
- `glossary_item`
- `atomic_step`
- `source_excerpt`

Each index record must include:

- `recordId`
- `recordType`
- `journeyIds`
- `stageIds`
- `stepIds`
- `language`
- `sourceIds`
- `claimIds`
- `reviewStatus`
- `text`

## Why Not Pure Vector Search

Pure vector search can retrieve semantically similar but religiously wrong context. For Bidayah, exact source scope and review status matter more than broad semantic similarity.

## Why Not Pure Keyword Search

Beginner Arabic questions are often short and contextual:

- "طيب لازم؟"
- "وش هي؟"
- "الحين وش؟"

Keyword search alone can miss these. Journey context and curated variants are necessary.

## Answer Contract

```ts
type AskBidayahAnswer = {
  answer: string;
  language: "ar" | "en";
  intent: string;
  status: "answered" | "needs_review" | "escalate" | "unsupported";
  sourceIds: string[];
  claimIds: string[];
  shouldEscalate: boolean;
  refusalReason?: string;
};
```
