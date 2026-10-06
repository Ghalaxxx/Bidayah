# Verification results

2026-10-04.

- Production build succeeds; static output does not itself provide the API.
- Executed 21 retrieval/provenance/safety cases, including contextual Qiblah, Suhoor requirement, per-movement phrases, one/three/odd/seven date questions, no-dates fallback, source gaps and prohibited live prayer requests.
- Executed 4 transport-stub LLM gate cases: invented citation, rejected evidence check, supported candidate, provider failure. These are NOT live LLM evaluations.
- Audited 42 runtime nodes, same-journey registered transitions, corrupt/old session recovery and persona A-E branch invariants.
- Browser checked Arabic preparation route through Wudu completion, Qiblah compass, selected Fajr count, movement review, Tashahhud, Taslim, readiness and phone-aside terminal screen. Verified contextual Qiblah answer with official source link.
- Browser checked English phone-aside view with 390x844 viewport override; no movement Next/Previous/Ask/time widget appears. Checked English fast timeline through Iftar and date-count abstention from unsupported recommendation with source link.
- API health reports real retrieval, llmConfigured=false, semanticEnabled=false, pilotReady=false. No live generation or embeddings tested.

Not covered: full Arabic/English mobile/desktop persona suite; religious-review signoff; zero-knowledge comprehension sessions; accessibility keyboard/screen reader audit; model effectiveness/latency; reviewed media and complete prayer-unit instruction.
