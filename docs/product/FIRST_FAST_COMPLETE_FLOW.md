# First Fast complete flow

Timeline orientation is separate from actual time. No simulated timestamp or Next button establishes dawn/sunset.

| State ID | Purpose / mental question | Information / primary CTA | Secondary / knowledge / source | Previous / next / fallback |
| --- | --- | --- | --- | --- |
| fast_intro | What is fasting? | Definition and full day map / review | Fajr/Suhoor/Maghrib/Iftar glossary; 252 section 1 | mode / fast_intention / restart |
| fast_intention | How do I prepare tomorrow? | Ramadan intention before Fajr / understood | Section 4; other fast types need scoped review | intro / suhoor / unsupported personal case => qualified help |
| suhoor | What/when; required? | Before-dawn meal; recommended not validity condition / review | 252 section 8; approved Ibn Baz support; contextual questions | intention / approaching_fajr / source unavailable => abstain |
| approaching_fajr | When stop eating? | Verify local dawn; simulated times not evidence / review boundary | 252 section 1 | suhoor / fast_begin / cannot verify => no now claim |
| fast_begin | Has fasting begun? | Conditional dawn boundary / review | Explain Fajr, not sunrise; 252 section 1 | approaching / fast_day / cannot verify => local timetable |
| fast_day | What do I avoid? | Core daytime basics / review | 252 sections 7/9; personal/medical questions escalated | beginning / approaching_iftar / insufficient evidence => abstain |
| approaching_iftar | When can I break? | Wait until verified sunset / review | Section 8; time widget illustrative | day / iftar / simulation cannot authorize eating |
| iftar | What next; how many dates? | Conditional sunset; rutab/dates/water / review | Required timing vs optional food; no number specified; 252 section 8 | approaching / fast_done / no dates => supported water fallback |
| fast_done | Did I learn or perform? | Review complete, not proof of fasting | Completion of learning only | iftar / home / repeat |

JourneyState retains mode, selected step/stage, answers and history. Ask uses stage for short ambiguous questions, lexical evidence for explicit questions anywhere within journey, and never infers real time from state. Health/exemptions and unsupported dua formulas require scoped review.
