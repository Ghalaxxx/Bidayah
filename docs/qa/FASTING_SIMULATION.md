# Fasting Simulation Verification

Date: 2026-10-04. Status: PASS for the requested simulated countdown. This is not pilot approval of the complete product.

## Contract And Boundaries

- `src/domain/fasting-time.ts`: reusable context with mode, target, targetTime, remainingTime (seconds), journeyStage, isAuthoritativeTime, labelAr and labelEn. All simulator snapshots set mode to simulation and authoritative time to false.
- `src/services/fasting-clock.ts`: subscribable provider contract and monotonic simulator. The simulator never consults system date, GPS, timezone or a prayer-time API.
- `src/hooks/useFastingClock.ts`: React subscription adapter, independent of simulator implementation.
- `src/components/FastingTimeContext.tsx`: bilingual compact countdown, target, permanent demo notice and safety text; optional development controls.
- `src/domain/fasting-journey.ts`: explicit simulation adapter persists `fastingSimulation`, advances registered lessons at phase changes and preserves real evidence, answers, prerequisites and performed-worship state.
- `src/App.tsx`, `src/App.css`, `src/domain/content.ts`: integration, guarded forward navigation, styling and narrow simulation-copy correction. Religious recommendations were not expanded.
- `scripts/evaluate-fasting-simulation.mjs`, `package.json`: executable simulation regression suite.

Future verified providers implement `FastingClockProvider`. UI/subscription code and the registered fasting lesson graph can be reused; the composition root must supply a separate verified-time state adapter. Do not route real snapshots through `synchronizeFastingSimulation`, which intentionally rejects real/authoritative time. A future real adapter requires independently validated location, date, calculation/provider provenance and temporal evidence. Flipping a boolean is not a verification service.

## Demo Behavior

Start: 04:45. Fajr: 05:00. Approaching Iftar: 17:55. Maghrib: 18:00. Simulation time progresses 1:1 while the fasting journey is active. It pauses on Home, mode selection, another journey and completion. Reload returns to the welcome screen; Resume restores the saved simulated second and phase, not wall-clock elapsed time.

At a new phase the corresponding learning node opens. It does not mark skipped lessons complete or assert worship was performed. Moving backwards to review remains possible, and ordinary ticking does not repeatedly overwrite that review. Forward boundaries cannot bypass the current simulated phase. Without development controls a full demonstration uses the stated 1:1 schedule, not accelerated production time.

Normal production has no demo controls. Development or `MODE=demo` plus `VITE_DEMO_CONTROLS=true` exposes the three controls. No URL parameter bypass exists. The full five-prayer table is excluded from every First Fast screen.

## Acceptance Checklist

| Requirement | Result | Evidence |
| --- | --- | --- |
| Before Fajr labels and ticking HH:MM:SS | PASS | Browser observed 15:00 decreasing; `screenshots/fasting-before-fajr-ar.jpg` |
| Fajr transition targets Maghrib and opens daytime | PASS | Browser observed 13:00:00 and `daytime / fast_day`; `screenshots/fasting-daytime-ar.jpg` |
| Approaching Iftar updates JourneyState | PASS | Browser observed 05:00 and approaching lesson; `screenshots/fasting-approaching-iftar-ar.jpg` |
| Maghrib zero opens Iftar learning, not real timing | PASS | Browser observed 00:00:00, explicit simulation wording and real-sunset caution; `screenshots/fasting-iftar-ar.jpg` |
| Educational completion requires learner navigation | PASS | Browser reached `completion / fast_done`; explanatory completion copy denies evidence of a performed fast |
| Natural boundaries without clicking controls | PASS | Injected monotonic-clock and reducer tests cover Fajr, 17:55 and 18:00; browser full-day transitions used demo jumps, not a thirteen-hour wait |
| Reload/resume preserves simulation state | PASS | Browser resumed daytime with saved countdown; invalid/backwards snapshots rejected by tests |
| Production controls absent | PASS | Default production build preview inspected: no controls in DOM; `screenshots/fasting-production-ar.jpg` |
| No full five-prayer timetable in First Fast | PASS | Browser DOM inspected in both modes and production |
| Arabic RTL / English LTR | PASS | Both language cards, safety labels and completion inspected; actual mobile DOM width 375, no horizontal overflow |
| Simulation cannot establish authoritative temporal evidence | PASS | Thirteen automated groups, including real/authoritative rejection and preservation of evidence/answers |

## Commands Actually Run

- `npm run build`: PASS, TypeScript and default production bundle.
- `npm run lint`: PASS, no warnings.
- `npm run validate:content`: PASS, 4 sources, 23 KnowledgeItems, 16 terms, 19 source/evaluation fixtures.
- `npm run evaluate:product`: PASS, 26 contextual safety cases, 4 stubbed LLM gates, 43 graph nodes, five prayer sequence cases and 13 fasting simulation groups.

## Remaining Product Blockers

Real verified timing is deliberately not implemented. Reviewed Wudu/prayer visual assets, full reviewed recitation audio/transliteration/meaning, complete religious review and live-LLM evaluation remain outside this completed countdown feature. The comprehensive attached zero-knowledge completion briefs are not fulfilled by this countdown; see `docs/audit/PILOT_READINESS.md`. Automated tests do not substitute for human religious approval or media licensing.
