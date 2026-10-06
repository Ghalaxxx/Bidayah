# Wudu source review package

Source: https://risala.prh.gov.sa/ar/content/514

Original official video: https://risala.prh.gov.sa/storage/contents/514/ar_sifat_alwoudo_new.mp4

Local original: `data/sources/review/prh-wudu-official.mp4`.
Machine transcript: `data/sources/review/wudu-transcript.json`.
Source snapshot and hash: `data/sources/review/prh_wudu_001.json`.

These are evidence artifacts, not fabricated human approval. The ASR contains transcription errors and must not be imported directly as approved lesson text.

| Candidate action | Video seconds to inspect | Reviewer task |
| --- | --- | --- |
| Begin and wash hands | 0-17 | Check exact words and requirement/recommendation classification |
| Rinse mouth; inhale and expel nasal water | 17-43 | Distinguish basic action from stronger rinsing and fasting exception |
| Wash face | 48-66 | Verify hairline/chin/ear-to-ear limits |
| Wash arms, right first | 86-100 | Verify fingers-to-elbows including elbows |
| Wipe head with new water | 100-128 | Verify direction and return stroke |
| Wipe ears | 128-153 | Verify once, index fingers inside, thumbs outside, remaining water |
| Wash feet | 153-182 | Verify toes-to-ankles, heels and between toes, right then left |
| Order and continuity; once sufficient | 183-203 | Verify distinction between sufficiency and recommendation |
| Repeating washes two/three times | 203-214 | Identify precisely which actions, never transfer to head/ears |
| Closing remembrance | 215-239 | Check exact Arabic text and optional classification |

## Approval Record

## Implementation Comparison (2026-10-04)

The actual video frames and source text have now been inspected against the physical sequence. Nine physical lesson screens render original instructional illustrations, including ears after the head and before the feet. Order, continuity, face/arm/foot boundaries, head/ear wiping and wash repetitions are described with the locators above. Full visual overview and beginner details are wired to the running UI. Internal review notices have been removed from learner screens. Browser evidence: `docs/qa/MEDIA_IMPLEMENTATION.md`.

This is source comparison and implementation QA, not a signed religious approval. Generated images remain original instructional interpretations; no human reviewer identity or pronunciation approval was invented.

Each proposed KnowledgeItem requires: source ID, exact start/end seconds, corrected Arabic excerpt, bilingual paraphrase, classification, excluded claims, reviewer name, date and decision. Each visual/audio/transliteration requires its own correctness decision. Source authority does not imply correctness of generated illustration or ASR.

No reviewer identity or approval has been invented. Until signed off, these candidates remain internal review material and cannot silently populate approved retrieval.
