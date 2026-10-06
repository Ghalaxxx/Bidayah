# Local Semantic Retrieval

The real CPU embedding worker loads the already-cached `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` with offline/local-files-only settings. It produces normalized 384-dimensional vectors. There is no external data transmission, religious text generation, or substitute for human source review.

Requirements: Python with sentence-transformers and the cached model. The current laptop has both. Enable `BIDAYAH_LOCAL_EMBEDDINGS=true` in the server environment; optionally set `BIDAYAH_PYTHON` to the Python executable. It is opt-in and fails to conservative extraction/abstention if unavailable. Do not expose Python or model credentials to frontend environment variables.

Lexical/contextual evidence wins. Semantic fallback accepts only approved records in the current journey AND current step, only explicit queries longer than three words, and cosine similarity at least 0.65. Generated unit IDs normalize to their canonical movement IDs. Date-count boundaries and phone-aside policy remain ahead of the model.

Run `node scripts/benchmark-local-retrieval.mjs` for a real embedding and actual answer API experiment. Outputs: `docs/evaluation/local-retrieval-results.json`. Eight diagnostic cases: lexical 5/8; hybrid 6/8. Predawn-meal obligation paraphrase and indirect direction paraphrase still abstain. This small measurement must not be called a production accuracy score or live LLM benchmark.

Live OpenAI generation remains separately configured with `OPENAI_API_KEY`. No such key was available, so no successful live generation or live LLM quality claim is made.
