# AI runtime

Development: npm run dev serves UI and /api/ask through server-only Vite middleware. Production API: node server/api.mjs behind a same-origin reverse proxy. Vite preview is static and does not serve the API.

Canonical AI evidence: data/knowledge/knowledge.json. Approved-source registry: public/data/sources/sources.json. Every returned citation has knowledgeId, sourceId and locator. NEEDS_REVIEW records are excluded. Current UI lesson data still needs complete migration to this registry.

Without server OPENAI_API_KEY: actual lexical/contextual retrieval returns approved extractive answers. This is explicitly retrieval-only, not an LLM run. With a server key: real OpenAI call uses strict structured output; only retrieved knowledge IDs can be cited. OPENAI_API_KEY must never use VITE_ prefix or enter browser storage.

Configuration: BIDAYAH_LLM_MODEL (default gpt-4.1-mini), BIDAYAH_EMBEDDING_MODEL (default text-embedding-3-small), BIDAYAH_SEMANTIC=true enables actual embeddings with in-process caching and cosine search. Small corpus does not warrant a vector database or trained reranker yet. The semantic threshold is provisional and must be calibrated with Arabic/English evaluation before pilot deployment.

Current safety: unsupported/personal requests abstain; product-boundary requests redirect before retrieval; contextual short questions require exact active-step scope. Iftar count and time answers stay extractive even with an LLM. Unknown citation IDs rejected; provider errors return approved extraction. A second model call checks candidate claims against the cited evidence and rejects unsupported claims. This automated check is not independent religious review or proof of entailment: until live adversarial evaluation is reviewed, LLM outputs remain experimental and not pilot approved.

No credentials were created or hardcoded. Live generation/semantic effectiveness require configured credentials and evaluation. GET /api/health reports configuration, never secrets. Endpoint accepts only two journeys and bounded requests. It is local development infrastructure; deployment needs request-rate controls and production operational review.
