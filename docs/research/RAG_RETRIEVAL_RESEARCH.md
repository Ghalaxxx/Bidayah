# RAG and Retrieval Research Notes

Date: 2026-10-03

## Product-Specific Goal

Bidayah needs a source-traceable beginner assistant for First Prayer and First Fast. The goal is not to build a broad Islamic chatbot. The goal is to answer only from approved content, preserve the journey sequence, and refuse or mark `NEEDS_REVIEW` when support is missing.

## Sources Consulted

- Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, Lewis et al., NeurIPS 2020: https://arxiv.org/abs/2005.11401
- Multilingual E5 Text Embeddings technical report: https://arxiv.org/abs/2402.05672
- MTEB: Massive Text Embedding Benchmark: https://arxiv.org/abs/2210.07316
- MMTEB: Massive Multilingual Text Embedding Benchmark: https://arxiv.org/abs/2502.13595
- RAGAS: Automated Evaluation of Retrieval Augmented Generation: https://arxiv.org/abs/2309.15217
- OpenAI Structured Outputs documentation: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI Evals documentation: https://developers.openai.com/api/docs/guides/evals
- OWASP Top 10 for LLM and GenAI: https://genai.owasp.org/initiative/owasp-top-10-for-llm-and-genai/
- OWASP LLM Prompt Injection Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

## Research Takeaways

### 1. RAG is useful, but it does not remove the need for governance

Lewis et al. introduced RAG as a way to combine parametric generation with non-parametric retrieved knowledge. For Bidayah, this supports the architectural direction: retrieve approved source-backed content first, then generate only within that retrieved context.

Decision for Bidayah:

- Retrieval happens before generation.
- The generator never sees arbitrary web content.
- The answer must expose source IDs.
- Missing source support produces refusal or `NEEDS_REVIEW`.

### 2. Arabic and English require multilingual retrieval validation

Multilingual E5 and MMTEB indicate that multilingual embedding quality varies by task and language. Bidayah cannot assume English benchmark performance transfers cleanly to Arabic beginner questions, dialectal Arabic, or mixed Arabic-English input.

Decision for Bidayah:

- Start with hybrid retrieval: Arabic-normalized lexical matching plus multilingual embeddings.
- Keep curated question variants for high-risk intents.
- Evaluate Arabic, English, dialectal Arabic, and short contextual questions separately.
- Treat embedding choice as an empirical decision, not branding.

### 3. Retrieval evaluation and answer evaluation are different

RAGAS separates retrieval context quality from answer faithfulness and answer relevance. This distinction matters because Bidayah can retrieve the right source and still generate an unsafe overgeneralized answer.

Decision for Bidayah:

- Evaluate retrieval top-k separately from answer correctness.
- Add faithfulness checks against retrieved claim IDs.
- Maintain manual golden cases for religious safety, especially unsupported claims.
- Do not accept model-graded religious correctness without human-reviewed gold data.

### 4. Structured outputs are important for safety gates

OpenAI Structured Outputs supports schema-constrained model responses. For Bidayah, free-form generation should be wrapped in a typed answer contract.

Decision for Bidayah:

Every answer service response should fit a schema like:

```json
{
  "answer": "...",
  "language": "ar",
  "sourceIds": ["prh_fasting_001"],
  "claimIds": ["fast_iftar_recommended_foods_001"],
  "confidence": "source_backed",
  "needsReview": false,
  "escalationType": null
}
```

### 5. LLM security must be designed in, not added later

OWASP highlights prompt injection, sensitive information disclosure, excessive agency, and overreliance as relevant risks. Bidayah should not give the LLM tools that can mutate content, approve sources, or override the journey.

Decision for Bidayah:

- Retrieved documents are untrusted instruction-wise. They are evidence, not prompts.
- User input is never allowed to expand the approved source set.
- The LLM cannot write reviewed content.
- The LLM cannot change `reviewStatus`.
- The LLM cannot decide that an unsupported religious claim is true.

## Recommended Retrieval Architecture

1. Normalize the user question.
2. Detect current journey context from `JourneyState`.
3. Run high-precision rules for critical intents.
4. Run hybrid retrieval over approved atomic units:
   - lexical Arabic/English matching
   - multilingual embeddings
   - source and journey filters
5. Re-rank by:
   - source approval
   - current journey/step match
   - exact intent match
   - review status
6. Generate answer only if all retrieved claims are approved and sufficient.
7. Otherwise return a refusal, escalation, or `NEEDS_REVIEW`.

## Non-Goals

- Open-domain religious QA.
- Arbitrary web search.
- Automatic religious ruling synthesis.
- Live phone-based prayer companion.
- Expanding beyond First Prayer and First Fast before evaluations are stable.
