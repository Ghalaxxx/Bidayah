# Current state

2026-10-04. Ground truth: inspected repository, both supplied completion briefs and supplied designer image.

| Subsystem | Decision | Reason |
| --- | --- | --- |
| Screenshot photo_2026-10-04_18-58-01.jpg | KEEP | Binding visual reference. Use actual designer bitmap for the welcome artwork; preserve dark ink background, lavender CTA, white type, composition and logo. |
| Existing beige/green CSS | REPLACE | Does not implement the supplied design. |
| App.tsx | REFACTOR | Mixes presentation, persistence, API and journey actions. Preserve functioning paths while separating reusable components. |
| domain/journey.ts | REFACTOR | Registered edges and phone-aside boundary useful; needs complete prayer-unit graph and temporal intent. |
| domain/content.ts | REFACTOR | Atomic lessons useful; duplicated source registry, weak Wudu, compressed repeat units and claim review gaps. |
| domain/prayer.ts | KEEP / REFACTOR | Source-located Arabic phrases and positions; add complete unit model, connected media and pronunciation records. |
| server/api.mjs | REFACTOR | Real configurable generation and verifier exist, but no live credentials; split transport, generation and evidence contracts. |
| server/retrieval.mjs | REPLACE | Exact variant-heavy scoring is not a sufficient retrieval baseline. Add subject/intent resolution, BM25 and an evaluated semantic path. |
| knowledge.json | REFACTOR | Small approved extractive corpus; insufficient beginner coverage, no schema or excerpt entities. |
| glossary JSON / inline registry | REFACTOR | Multiple registries with different coverage. |
| sources.json | KEEP | Canonical four-source pack; adding an authority does not automatically approve its claims. |
| pilot services | KEEP | Simulated direction/times isolated; compact presentation and explicit timeline state required. |
| evaluation scripts | KEEP / EXPAND | Real executable gates, but small dataset and stub generation tests are not live benchmarks. |
| historical architecture docs | KEEP / UPDATE | Preserve decisions; distinguish baseline/history from current implementation. |
| Python/notebooks | None found | Do not invent nonexistent experiments or empty notebooks. Any new notebook must execute an actual measured experiment. |
| source audio / reviewed pronunciation | NEEDS REVIEW | No approved local recitation recordings; cannot fabricate signoff. |
| placeholder Vite assets | REMOVE from usage | Unrelated to Bidayah; preserve files until no references remain. |

Execution: evidence/coverage -> deterministic complete sequences and temporal state -> retrieval/grounding and measurable evaluation -> designer UI and linked media -> mobile/bilingual/E2E checks -> exact external review packages. Credentials and human approval are external dependencies, not reasons to stop other engineering.

Image provides one welcome screen, not an entire UI file set. Additional journey/sheet states must use its visual tokens; do not invent extra onboarding claims/pages to fill the screenshot pagination dots.
