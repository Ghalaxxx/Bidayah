# Designer Reference QA

Executed on 2026-10-04 against the local Vite app at http://127.0.0.1:5173.

## Reference Implementation

`photo_2026-10-04_18-58-01.jpg` is the mandatory reference. The welcome artwork and brand mark render directly from that original file with CSS clipping; the original file is unchanged. The heading, description, CTA, language switch and resume action are real DOM controls, not a flattened screenshot pretending to be an application. Screenshot-only reference does not establish mathematically exact font metrics or an editable original design.

English copy, crescent, path, circles, stars, white headline, lavender CTA and desktop device framing were visually compared. Mobile removes the mock hardware frame, not the designed content. Arabic has a translated RTL layout; it is not claimed to be the English reference text.

## Executed Checks

- Original bitmap loaded (600px natural width); no broken images.
- Actual DOM viewport 375 x 812: welcome has no horizontal overflow; heading fits in two lines; CTA and resume are visible.
- English and Arabic welcome screenshots inspected. Desktop/reference presentation inspected.
- Begin action opens the actual journey selector.
- Resume restores the saved movement; reload restores the saved phone-aside state through resume.
- Mode cards explicitly distinguish preparation before prayer and detailed learning before prayer.
- Arabic known-Wudu/already-purified/home/Qiblah/Fajr branches traversed.
- Arabic two-unit sequence traversed before addition of the dedicated final-supplication screen. The final English sequence traversed all 17 review screens including that addition, then readiness and phone-aside.
- Arabic and English phone-aside states have no Next, Previous, Ask, movement sequence or timetable. Completion requires explicit user self-report; no completion was automatically recorded.
- Arabic Takbir glossary question returned the approved paragraph-3/4 answer with source citation in the live UI.
- Saved screenshots: `screenshots/welcome-en.jpg`, `screenshots/phone-aside-ar.jpg`, `screenshots/phone-aside-en.jpg`.
- Browser viewport overrides reset after responsive testing.

## Automated Checks

- `npm run build`: passed.
- `npm run lint`: passed.
- `npm run validate:content`: 4 sources, 23 KnowledgeItems, 16 glossary entries, 19 original evaluation fixtures passed.
- `npm run evaluate:product`: 26 contextual/provenance/safety cases; 4 mocked LLM transport gates; 43 base-node graph checks; all five complete selected-prayer sequences passed (17/24/30 review screens for 2/3/4 units).
- Real local embedding diagnostic: 384 dimensions, 8 cases, lexical 5/8, hybrid 6/8. Full results and failure cases are preserved separately.

This is focused engineering QA, not full accessibility certification, novice comprehension research, religious signoff, or live LLM evaluation. Wudu human review and approved pronunciation/media remain unresolved. `/api/health` correctly reports `pilotReady=false` and `llmConfigured=false`. Local semantic fallback is opt-in; the default development server remains lexical/contextual.
