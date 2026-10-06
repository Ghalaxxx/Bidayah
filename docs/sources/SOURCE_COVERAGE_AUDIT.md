# Source Coverage Audit

Date: 2026-10-03

## Approved Sources

| ID | Source | Purpose |
| --- | --- | --- |
| `prh_wudu_001` | رسالة الحرمين، صفة الوضوء | Primary Wudu journey source |
| `prh_prayer_binbaz_001` | رسالة الحرمين، كيفية صلاة النبي ﷺ | Primary First Prayer source |
| `prh_fasting_001` | رسالة الحرمين، من أحكام الصيام | Primary First Fast source |
| `binbaz_suhoor_001` | الموقع الرسمي لسماحة الشيخ عبد العزيز بن باز، السحور ليس شرطًا في صحة الصيام | Supporting source for `suhoor_requirement` |

## Current Coverage

### Wudu

Current MVP covers a simplified readiness/wudu step. It needs fuller extraction into atomic steps from `prh_wudu_001`.

Needs extraction/review:

- exact washing order
- what is obligatory vs instructional beginner wording
- head wiping and ears details
- repetitions if mentioned by approved source
- what to do after Wudu if mentioned by approved source

### Prayer

Current MVP covers preparation, Qiblah, short prayer review, Learn First practice steps, and phone-aside behavior.

Needs extraction/review:

- exact preparation language from source
- prayer sequence from purification through Taslim
- essential phrases and what is beginner-essential
- rak'ah explanation by selected prayer
- differences between learning demo and real prayer selection
- any body-position details not already reviewed

### Fasting

Current MVP covers meaning, intention, Suhoor, fasting day, Iftar timing, and Iftar foods.

Needs extraction/review:

- beginning and end of fasting
- intention details
- invalidators appropriate for beginner scope
- Iftar details and unsupported details
- cases that should escalate rather than answer

### Suhoor Requirement

Covered by:

- `binbaz_suhoor_001`
- `prh_fasting_001`

Current product answer: Suhoor is recommended and not a condition for validity. This is supported by the approved supporting source.

## Known Explicit Gap

Iftar source support currently allows:

- fresh dates when available
- otherwise dates
- otherwise water

The approved source set currently does not specify a number of dates in the implemented KnowledgeItem. Therefore Bidayah must not recommend odd counts or three dates as verified for Iftar unless a reviewed approved source explicitly supports that exact claim.
