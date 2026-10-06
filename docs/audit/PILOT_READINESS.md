# Pilot readiness

Status: NOT READY. 2026-10-04.

The compact First Fast simulation countdown is now implemented and tested: Fajr 05:00, approaching Iftar 17:55 and Maghrib 18:00; automatic lesson transitions; explicit non-authoritative labels; no fasting-screen five-prayer timetable; development-only jump controls; persisted simulation progress; educational completion only. Feature evidence: [Fasting simulation](../qa/FASTING_SIMULATION.md). This does not resolve the blockers below.

Implemented: domain content separated from React; guarded transitions; PREPARE_TO_PERFORM/LEARN distinction; review before readiness in both modes; phone-aside state without movement navigation or Ask; restored sessions versioned/invalid JSON rejected; five prayer selection choices; Tashahhud/final sitting/Taslim review; structured movement/Arabic recitation records; example compass/time services; expanded fasting timeline; explicit simulated-time boundaries; external atomic KB; real context/lexical retrieval; optional real embedding and LLM API code; source/locator provenance; automated evidence check for generated claims; conservative fallback; executable negative tests.

Still required before pilot approval:

- Wudu now has nine physical illustrated screens, including ears, and a functioning full visual overview. Source/video comparison, exact locators and browser rendering checks are recorded in `docs/qa/MEDIA_IMPLEMENTATION.md`. No internal review notices remain in learner screens. Formal religious approval is still separate from implementation QA.
- Repeated-unit review covers all five selected prayers with actual movement illustrations. The real Listen/Replay/Loop player, clip preparation, exact-phrase binding and signed-rights publication pipeline are implemented. Seven actual recordings play in a development-only loopback review UI. They are not learner-approved: the publisher does not grant a reuse license, and pronunciation/clip boundaries need a qualified review. Sitting/final supplication variants are withheld rather than presented as exact matches. Full Al-Fatihah text/audio and reviewed transliteration/meaning need approved evidence and recording rights; no source text was invented.
- Religious review of derived explanations and optional/required classifications is not replaced by source authority or automated model checks.
- Fasting requires explicit temporal self-report/resume phases before it can act as an actual day tracker; current screen progress is educational only.
- Live LLM generation needs a server OPENAI_API_KEY; none is configured in the tested environment. Local multilingual embedding retrieval now runs without a key and was measured on eight diagnostic cases (6/8 hybrid, 5/8 lexical). Live LLM reliability and broad multilingual grounding have not been established; this small experiment is not pilot validation.
- Full mobile/desktop Arabic/English persona E2E and accessibility QA remain necessary. Node graph tests are not browser user-comprehension tests.
- Domain lesson content and AI knowledge are now separated, but full canonical content unification/claim-level evidence coverage is still incomplete.

The latest designer screenshot now controls the welcome screen: original provided bitmap artwork/logo, navy/lavender styling, live text/CTA/language/resume controls. English reference and Arabic variant were visually inspected. This is not a claim of mathematically exact typography from an editable design file. No pilot-ready claim is made.
