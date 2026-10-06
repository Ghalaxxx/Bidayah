# Product correction audit

Date: 2026-10-04. Baseline: inspected implementation, not assumed complete.

## A. Phone-use implications

`src/App.tsx`: generic actionDone (Done, next step) on movement screens; imperative titles prayer_ruku/prayer_rise/prayer_sujud/prayer_sit/prayer_taslim; generic previous, Ask and glossary controls on phone_aside_start; learning banner limited to stage=prayer and absent on Taslim; glossary sujud says follow the journey; current_next_action says follow the shown step. These combine into a reasonable live-use interpretation. PREPARE skips movements entirely through a conditional inside go(). Demo shortcuts skip Wudu completion. No explicit LIVE mode exists, but the state boundary is not enforced.

Disallowed-user-request fixtures in data/evaluation and safety documentation are intentional negative examples, not product instructions. Keep them, label them and execute them.

## B. Prayer depth

know_wudu/in_wudu: term not defined in question. All Wudu actions: short labels without reviewed physical detail. prep_qiblah: no compass/Kaaba explanation. prayer_selection: fixed demo two-unit prayer even for unknown prayer. rakah_intro: no prayer-specific counts. pre_prayer_review: asserts readiness too early. prayer_stand: no recitation teaching. prayer_rise/prayer_sit: missing phrases and positions. prayer_demo_transition: compresses subsequent units and omits first/final Tashahhud. prayer_taslim: no physical explanation. prayer_ready: reached without sufficient review.

## C. Fasting depth

fast_intro: lacks practical definition/timeline. fast_intention: omits Ramadan intention before Fajr. suhoor: validity answered but meal/time terms barely explained. fast_begin: manually entering a screen can imply actual dawn. fast_day: says invalidators without explaining them. approaching_iftar/iftar: simulated navigation presented as actual sunset. fast_done: reading screens is treated as performing a fast.

## D. Terminology

Missing or weak: Kaaba, first/final Tashahhud, Taslim, standing/recitation, Fajr versus sunrise, Maghrib versus simulation, complete rak'ah, later units. External glossary files have entries absent from the actual inline runtime registry.

## E. Missing knowledge

Physical Wudu details/repetitions, selected-prayer units, recitations per movement, later-unit transitions, Tashahhud, definition/practical context of Qiblah, no-dates Iftar, seven dates, intention timing, daytime basics and contextual short questions. Existing current_next_action is technical filler rather than a beginner answer.

## F. Evidence

Source URLs are not claim-level provenance. Every inline record is approved despite the source audit acknowledging missing extraction. Prayer source paragraphs 1-14 support sequence/counts. Fasting sections 1/4/7/8/9 support definition, intention, daytime scope and Iftar. Wudu source is video; exact boundaries/repetition/ears and source-aligned visuals remain NEEDS_REVIEW until media is reviewed. Transliteration, audio and meaning require separate review; do not synthesize approved recordings. Covering/place specifics not established in inspected approved material remain NEEDS_REVIEW.

## G. AI baseline

Knowledge base: partial, duplicated inline. Retrieval: real deterministic substring matching, shallow contextual filters. Semantic retrieval: missing. Hybrid search: missing. RAG: missing. LLM: missing. Reranker: missing; not automatically justified for this small corpus. Citation IDs: partial, no exact support spans. Evaluation JSON: present but not executing answers.

## H. Architecture

Single React file owns content, state, retrieval and UI. Arbitrary go(nextId), conditional transitions hidden in UI, stale session restoration, incorrect global-list progress, non-atomic answerOption updates, no temporal evidence, no API error handling, demo shortcut, readiness unsupported by reviewed knowledge. There is no existing backend to preserve.

## I/J. Corrected machines

See FIRST_PRAYER_COMPLETE_FLOW.md and FIRST_FAST_COMPLETE_FLOW.md. Both modes review before prayer; application does not track prayer movements during performance. Only explicit returned-after-prayer acknowledgement records completion. Fasting stage navigation cannot establish actual dawn/sunset. Simulated services never authorize real actions.

## Pilot blockers

Reviewed Wudu media, complete recitation/transliteration/meaning coverage and approved audio/visual assets; source-review signoff; successful live model/embedding run with server credentials; executed Arabic/English mobile/desktop persona QA. Compilation is not pilot readiness.
