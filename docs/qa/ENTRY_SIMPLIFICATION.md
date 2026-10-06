# Entry Navigation Simplification

Date: 2026-10-05.

Pre-change snapshot: `backups/before-entry-simplification-20261005-120312/`. Contains existing source, server, data, public assets, scripts, docs and root configuration. Dependencies and generated build output were excluded; no existing changes were reverted.

## Scope

- `src/App.tsx`: remove both mode-selection render branches and handler; start each journey directly at its existing orientation; automatically assign `LEARN`.
- `src/domain/journey.ts`: shared entry defaults and version-2 session migration. Pending selection sessions move to their corresponding intro. Existing valid progress, answers, completed steps and fasting simulation remain preserved. Legacy mode values normalize to `LEARN`; removed/invalid history nodes cannot be revisited.
- `scripts/evaluate-entry-simplification.mjs`: focused bilingual entry, old-session migration, refresh/idempotence, completed-progress, Ask-state and preservation tests.

The internal mode type retains the historical value solely for compatible migration/context contracts. New and restored active sessions use `LEARN` automatically. No choice handler or mode-dependent learning banner branch remains. No mode-selection node was included in the existing seven-stage progress calculations, so progress remains unchanged. The initial Previous button is disabled, and subsequent Previous returns to the existing orientation rather than a removed choice.

## Verification

- Build and TypeScript: passed.
- Lint: passed without warnings.
- Focused entry suite: 35 cases passed, plus removed-branch, progress-list and phone-boundary assertions.
- SHA-256 preservation: 57 files in server, data, public, components, hooks, services, domain content/media and CSS match the pre-change snapshot. The only excluded domain file is the intentionally modified navigation/restoration helper.
- Full existing product suite: 287 contextual Ask cases, 16 HTTP contracts, 26 context/safety regressions, 8 stubbed LLM gates, 44 journey nodes, all five prayer sequences, 13 fasting simulation groups and existing visual/audio gates passed. No live LLM-quality claim is made.
- Browser: Home -> Prayer and Home -> Fast tested directly in Arabic and English. Both show their existing intro, not mode selection.
- Browser: Next/Previous, seven-stage progress, reload/resume for both journeys, moving simulation countdown and sourced Suhoor question chip verified.
- Old-session migration is tested through the exact restoration helper used by the application, including missing step/mode and removed-entry identifiers, both languages, existing progress and completed journeys. Browser storage was not injected for this test.

No changes to Ask implementation, RAG, sources, religious learning content, visuals, audio, CSS, fasting simulation or phone-aside behavior.

Proof screenshots: `entry-simplification/prayer-ar.png`, `entry-simplification/fast-ar.png`.

Run focused tests:

```powershell
node scripts/evaluate-entry-simplification.mjs 'backups/before-entry-simplification-20261005-120312'
```
