# Media implementation and runtime evidence

2026-10-04. Implementation completed for physical visuals; no claim of human religious or pronunciation approval.

## Learner Experience

- Nine real Wudu illustrations: hands, mouth, nose, face, right arm, left arm, head, ears, feet. Reviewed against official source 514 and actual video frames, not ASR alone.
- Every physical screen has step number, actual bitmap, instruction, optional beginner detail, sources, contextual Ask and next action. Full overview expands all nine illustrated steps.
- Eleven prayer visual mappings cover all movements and final recitations. All five prayer sequences use real visuals; final three/four-unit sitting uses Tawarruk. Corrected atlas v2 shows both feet and upright right foot. Taslim framing isolates the two head turns without claiming a universal sitting posture.
- Learning remains before prayer. Phone-aside screen has no movement Next/Previous or Ask.
- Internal approval/media notices are not rendered in the learner UI. Original designer welcome identity is preserved.

## Audio Implementation

- Exact approved Arabic phrases are displayed. Real HTML audio player supports Listen/Pause, restart, loop, failure recovery and pausing other players.
- Original source recording: https://islamhouse.com/ar/audios/213201/ (narration of the same approved Ibn Baz booklet, not a new source for religious claims).
- Rights finding: https://d1.islamhouse.com/html/disclaimer.htm paragraph 18 grants no copyright license. Availability to download is not redistribution/adaptation permission. No rights approval has been fabricated.
- Seven real candidate clips prepared locally, hashed and played in browser: Takbir, Ruku, rising, Sujud, second Sujud, Tashahhud, Taslim. These clips remain exclusively internal. Browser playback does not prove correct Arabic pronunciation or exact cut boundaries.
- Sitting and final dua recording variants are deliberately withheld; blessing alignment needs manual comparison. No Arabic/Al-Fatihah text or audio imported from model memory or English system TTS.
- `npm run audio:prepare` creates internal clips/manifest. `npm run audio:publish` requires matching canonical text/source, file SHA-256, named/date pronunciation approval and documented cleared rights. Current run publishes zero assets intentionally.
- `data/media-review/audio-decisions.json` stores genuine external review decisions (currently empty). A future decision includes id, phrase, sourceId, sha256, pronunciationReview {status, reviewer, date}, rights {status, evidence}; optional meaning/transliteration only with reviewed status.
- Dev-only `?media-review=true` tests actual playback locally. Middleware only accepts loopback clients. Production removes this UI and does not serve candidate MP3s. No normal learner controls pretend that draft recordings are approved.

## Verification

- `npm run build`, `npm run lint`, `npm run validate:content`, `npm run evaluate:product` passed.
- New media tests: real PNGs/dimensions, ordered ears inclusion, all prayer mappings, exact phrase/source/hash binding, non-silent decoded audio, invalid/unsigned/unlicensed rejection.
- `media-browser-results.json`: actual nine Wudu screens and 24 Maghrib movement screens; image loaded, no horizontal overflow/internal notices.
- `media-mobile-results.json`: nine Wudu screens at actual DOM 375x812; loaded images, no horizontal overflow.
- `prayer-mobile-results.json`: all 24 Maghrib screens retested at 375x812 using corrected atlas v2; every image loaded, no horizontal overflow. English Wudu screen also inspected (`wudu-hands-en.jpg`).
- `audio-browser-results.json`: all seven clips progressed currentTime, readyState 4, paused false, no media error; Replay and Loop buttons exercised. Only last player remained playing; preceding players paused automatically.
- Complete Wudu overview opened: nine loaded images. Phone-aside screen verified through actual UI navigation.
- Production preview with `?media-review=true` opens normal welcome, not review UI. Candidate MP3 URL receives SPA HTML rather than audio; no draft audio in `dist`, and no review endpoint/string in production bundle.
- Screenshots in `docs/qa/screenshots/` show actual running screens. Source frames in the same directory are private comparison evidence, not learner media.

Acceptance limitation: hearing every core recitation in the normal learner UI is not claimed or passed. The user's explicit safe-audio exception is implemented; source permissions and qualified pronunciation decisions are genuine external dependencies, kept internal.
