# First Prayer complete flow

Mode: LEARN or PREPARE_TO_PERFORM. Every interaction precedes actual prayer.

| State ID | Purpose / user question | Primary information / CTA | Secondary / knowledge / evidence | Previous / next / fallback |
| --- | --- | --- | --- | --- |
| prayer_intro | What will I learn? | Preparation boundary / review | Ask; product policy | mode / know_wudu / restart |
| know_wudu | What is Wudu; do I know it? | Define purification / choose | glossary; source 514 | intro / in_wudu or wudu_intro / unsure => lesson |
| in_wudu | Already purified? | Self-report / choose | Wudu review | know_wudu / wudu_intro or prep_location / unsure => lesson |
| wudu_intro -> wudu_hands -> wudu_mouth -> wudu_nose -> wudu_face -> wudu_right_arm -> wudu_left_arm -> wudu_head -> wudu_feet | How do I perform each action? | Atomic action / reviewed action acknowledgement | Physical detail, optional repetition, media require reviewed source 514; unreviewed detail marked NEEDS_REVIEW | ordered lesson / wudu_complete / evidence unavailable => source review required |
| wudu_complete | Finished; what next? | Transition to direction / continue | Ask next action | feet / prep_location / review |
| prep_location | Where am I preparing? | Select place context | No invented clothing/place rulings | completion or in_wudu / prep_qiblah / unknown context |
| prep_qiblah | What direction? | Qiblah + simulated compass / understood | Kaaba definition; source 106 paragraph 2; trusted local direction needed | location / prayer_selection / simulation never establishes real bearing |
| prayer_selection | Which prayer? | Fajr/Dhuhr/Asr/Maghrib/Isha / choose | Simulated times; source 106 paragraphs 13-14 | qiblah / rakah_intro / unknown => remain and verify locally |
| rakah_intro | What repeats? | Unit + selected count / review | Standing, bowing, two prostrations; 106 | selection / pre_prayer_review / missing selection => selection |
| pre_prayer_review | What do I need before praying? | Purification/direction/intention / review sequence | No readiness assertion yet; 106 paragraphs 1-2 | rakah / prayer_takbir / source gaps => review |
| prayer_takbir -> prayer_stand -> prayer_ruku -> prayer_rise -> prayer_sujud -> prayer_sit -> prayer_second_sujud | What movement/phrase comes where? | Explicit learning / next review | 106 paragraphs 3-11; glossary, evidence and Ask. Detailed recitation media requires review | ordered review / prayer_demo_transition / unresolved => do not assert readiness |
| prayer_demo_transition | How does next unit begin? | Explain repeated sequence / review | 106 paragraph 12 | second sujud / prayer_tashahhud / repeat lesson |
| prayer_tashahhud | Where do I sit after two units? | First/final sitting based on count / review | 106 paragraphs 13-14 | repeat / prayer_later_units / source review |
| prayer_later_units | What if 3 or 4 units? | Selected count and final sitting / review | 106 paragraph 14 | tashahhud / prayer_taslim / missing selection => selection |
| prayer_taslim | How does prayer finish? | Learn right/left ending / reviewed | 106 paragraph 13 | later units / learning_ready / repeat |
| learning_ready | Anything still unclear? | Review or acknowledge preparation | Both modes; essential knowledge gaps disclosed | taslim / prayer_ready / repeat |
| prayer_ready | Reviewed and ready? | Final review acknowledgement / put phone aside | Product boundary | learning_ready / phone_aside_start / return before starting |
| phone_aside_start | Ready to perform independently | Put phone aside / I returned after finishing | No Ask, movement Next/Previous, glossary or time widget; separate return-before-start option | ready / prayer_done or pre_prayer_review / no live state |
| prayer_done | I returned after prayer | Self-reported completion | No validation of religious correctness | phone aside / home / restart |

Ask context is the current node and selected prayer. It never changes this machine. The Wudu evidence gap and incomplete approved recitation assets prevent a pilot-ready declaration.
