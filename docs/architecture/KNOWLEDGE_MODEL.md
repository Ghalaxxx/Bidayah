# Knowledge Model

## Principle

Bidayah content must be atomic, source-backed, reviewable, and scoped. A beginner-facing sentence should not become "verified" unless its religious claim is traceable to an approved source.

## Core Entities

### Source

Official source metadata.

Required fields:

- `id`
- `titleAr`
- `titleEn`
- `organizationAr`
- `organizationEn`
- `url`
- `sourceType`
- `verified`

### Claim

Smallest reviewable religious assertion.

Example:

```json
{
  "id": "fast_iftar_recommended_foods_claim_001",
  "sourceIds": ["prh_fasting_001"],
  "journeyIds": ["first_fast"],
  "claimAr": "يُفطر على رطبات، فإن لم يجد فعلى تمرات، فإن لم يجد فعلى ماء.",
  "claimEn": "The approved source supports breaking the fast with fresh dates when available, otherwise dates, otherwise water.",
  "reviewStatus": "approved"
}
```

### KnowledgeItem

Beginner-facing answer package that references claims.

Required fields:

- `id`
- `intent`
- `journeyIds`
- `stageIds`
- `stepIds`
- `questionVariants`
- `answerAr`
- `answerEn`
- `claimIds`
- `sourceIds`
- `reviewStatus`
- `riskLevel`

### AtomicStep

One journey action.

Required fields:

- `id`
- `journeyId`
- `stageId`
- `titleAr`
- `titleEn`
- `bodyAr`
- `bodyEn`
- `sourceIds`
- `claimIds`
- `reviewStatus`
- `next`
- `options`

### ReviewStatus

Allowed values:

- `approved`
- `needs_review`
- `rejected`
- `draft`

Only `approved` content can be used for verified answers.

## Important Modeling Rule

Do not encode common practice as Sunnah unless the approved source explicitly supports that practice in that exact context.

Example:

- Supported: Iftar may mention fresh dates, dates, then water if supported by the approved fasting source.
- Unsupported unless source specifies it: "Eat 1, 3, 5, or 7 dates because odd numbers are Sunnah for Iftar."

## Content Movement Rule

Religious content should move out of `src/App.tsx` into structured data files or a content service. The frontend should import generated typed content or call an API, not define religious claims inline.
