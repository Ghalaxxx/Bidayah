# Content depth audit

Generated from runtime nodes on 2026-10-04. Current implementation; missing coverage is explicit, not assumed reviewed.

## prayer_intro

- User sees: سنجهزك قبل الصلاة / We will prepare you before prayer.
- Primary explanation: سنراجع الوضوء والقبلة والخطوات الأساسية أولًا، حتى تعرف ما ستفعل قبل أن تبدأ.
- User needs: understand this action and its position in the intro stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: know_wudu.
- Next action: review CTA; performance occurs outside the application.

## know_wudu

- User sees: هل تعرف كيف تتوضأ؟ / Do you know how to perform Wudu?.
- Primary explanation: الوضوء طهارة بالماء قبل الصلاة. إذا لم تتعلّمه من قبل، اختر الشرح.
- User needs: understand this action and its position in the readiness stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; wudu_definition: paragraph 1.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش الوضوء / ليش أسويه / what is wudu.
- Next: نعم => in_wudu / لا => wudu_intro / لست متأكدًا => wudu_intro.
- Next action: review CTA; performance occurs outside the application.

## in_wudu

- User sees: هل أنت متوضئ الآن؟ / Are you currently in Wudu?.
- Primary explanation: هذا يحدد هل ننتقل للاستعداد للصلاة أو نبدأ الوضوء.
- User needs: understand this action and its position in the readiness stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; wudu_definition: paragraph 1.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش الوضوء / ليش أسويه / what is wudu.
- Next: نعم => prep_location / لا => wudu_intro.
- Next action: review CTA; performance occurs outside the application.

## prep_location

- User sees: أين ستصلي؟ / Where will you pray?.
- Primary explanation: سنستخدم الإجابة للسياق العملي فقط.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: في المنزل => prep_qiblah / في المسجد => prep_qiblah / مكان آخر => prep_qiblah.
- Next action: review CTA; performance occurs outside the application.

## prep_qiblah

- User sees: استقبل القبلة / Face the Qiblah.
- Primary explanation: توجّه إلى القبلة قبل أن تبدأ الصلاة.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: القبلة.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; qiblah_definition: paragraph 2.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: القبلة هي اتجاه الكعبة..
- Ask questions: وش القبلة / وش هي / وين اتوجه.
- Next: prayer_selection.
- Next action: review CTA; performance occurs outside the application.

## prayer_selection

- User sees: أي صلاة تستعد لها؟ / Which prayer are you preparing for?.
- Primary explanation: اختر الصلاة التي تريد مراجعتها. المواقيت المعروضة مثال توضيحي؛ لا تحدد الصلاة الحالية في مكانك.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: ركعة.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: الفجر — ركعتان => rakah_intro / الظهر — أربع ركعات => rakah_intro / العصر — أربع ركعات => rakah_intro / المغرب — ثلاث ركعات => rakah_intro / العشاء — أربع ركعات => rakah_intro.
- Next action: review CTA; performance occurs outside the application.

## rakah_intro

- User sees: ما معنى ركعة؟ / What is a rak'ah?.
- Primary explanation: الركعة وحدة من الصلاة: قيام وقراءة، ثم ركوع، ثم وقوف، ثم سجود وجلوس وسجود ثانٍ. سنتعلّم ترتيب الوحدات قبل الصلاة.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: ركعة, الركوع, السجود.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; rakah_definition: paragraphs 7-14.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: سنعلّم الحركة وما تقوله خطوة بخطوة، ولن تحتاج إلى فهم كل المصطلحات مسبقًا..
- Ask questions: وش يعني ركعة / كم ركعة / what is a rakah.
- Next: pre_prayer_review.
- Next action: review CTA; performance occurs outside the application.

## pre_prayer_review

- User sees: قبل أن تبدأ / Before you begin.
- Primary explanation: تأكد أنك على وضوء، متوجه للقبلة، وتعرف أن الرحلة ستبدأ بالتكبير ثم القيام والقراءة.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الوضوء, القبلة, تكبيرة الإحرام.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001, prh_wudu_001; prayer_intention: paragraph 2.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: هل انطق النية / وش النية / اقول النيه بصوت.
- Next: prayer_takbir.
- Next action: review CTA; performance occurs outside the application.

## prayer_ready

- User sees: أنت جاهز للصلاة / You are ready to pray.
- Primary explanation: راجعت الخطوات التي تحتاجها. عندما تكون مستعدًا، ضع الهاتف جانبًا وابدأ الصلاة.
- User needs: understand this action and its position in the ready stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: phone_aside_start.
- Next action: review CTA; performance occurs outside the application.

## phone_aside_start

- User sees: ضع الهاتف جانبًا وابدأ الصلاة / Put the phone aside and begin the prayer.
- Primary explanation: ابدأ الصلاة عندما تكون مستعدًا. بعد أن تنتهي، ارجع إلى بداية وحدد أنك أنهيت الصلاة.
- User needs: understand this action and its position in the ready stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: لم أبدأ؛ أرجع للمراجعة => pre_prayer_review / رجعت بعد انتهاء الصلاة => prayer_done.
- Next action: review CTA; performance occurs outside the application.

## prayer_takbir

- User sees: تعلّم بداية الصلاة / Learn the beginning of prayer.
- Primary explanation: في الصلاة، تبدأ بتكبيرة الإحرام قائلًا: الله أكبر.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: تكبيرة الإحرام.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; takbir_definition: paragraphs 3-4; prayer_intention: paragraph 2; phrase_volume_unspecified: paragraphs 3, 7, 9-11; phrase volume unspecified.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش يعني تكبيرة الإحرام / اش هي تكبيره الاحرام / وش التكبير / هل انطق النية / وش النية / اقول النيه بصوت / هل اقولها بصوت عالي / اقولها بصوت عالي / هل ارفع صوتي.
- Next: prayer_stand.
- Next action: review CTA; performance occurs outside the application.

## prayer_stand

- User sees: القيام والقراءة / Standing and recitation.
- Primary explanation: تعلّم أن هذه الخطوة تكون للقيام والقراءة.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: ركعة.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; prayer_recitation: paragraph 6.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش أقول / وش اقرا / what do i say.
- Next: prayer_ruku.
- Next action: review CTA; performance occurs outside the application.

## prayer_ruku

- User sees: تعلّم الركوع / Learn bowing.
- Primary explanation: تعلّم حركة الركوع وما يقال فيها: سبحان ربي العظيم.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الركوع.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; tasbih_ruku: paragraph 7; phrase_volume_unspecified: paragraphs 3, 7, 9-11; phrase volume unspecified; ruku_instruction: paragraph 7.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: اش هو التسبيح / وش يعني تسبيح / وش التسبيح / هل اقولها بصوت عالي / اقولها بصوت عالي / هل ارفع صوتي / وش الركوع / ما فهمت الحركة / وش اقول.
- Next: prayer_rise.
- Next action: review CTA; performance occurs outside the application.

## prayer_rise

- User sees: تعلّم الرفع من الركوع / Learn rising from bowing.
- Primary explanation: تعلّم أن بعد الركوع يكون الرفع منه والوقوف باطمئنان.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: السجود.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: prayer_sujud.
- Next action: review CTA; performance occurs outside the application.

## prayer_sujud

- User sees: تعلّم السجود / Learn prostration.
- Primary explanation: تعلّم خطوة السجود وما يقال فيها: سبحان ربي الأعلى.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: السجود.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; tasbih_sujud: paragraphs 9 and 11; phrase_volume_unspecified: paragraphs 3, 7, 9-11; phrase volume unspecified; sujud_instruction: paragraphs 9-11.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: اش هو التسبيح / وش يعني تسبيح / وش التسبيح / هل اقولها بصوت عالي / اقولها بصوت عالي / هل ارفع صوتي / وش السجود / ما فهمت الحركة / وش اقول.
- Next: prayer_sit.
- Next action: review CTA; performance occurs outside the application.

## prayer_sit

- User sees: تعلّم الجلوس بين السجدتين / Learn sitting between prostrations.
- Primary explanation: تعلّم موضع الجلوس بين السجدتين في ترتيب الصلاة.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; phrase_volume_unspecified: paragraphs 3, 7, 9-11; phrase volume unspecified.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: هل اقولها بصوت عالي / اقولها بصوت عالي / هل ارفع صوتي.
- Next: prayer_second_sujud.
- Next action: review CTA; performance occurs outside the application.

## prayer_second_sujud

- User sees: السجدة الثانية / Second prostration.
- Primary explanation: تعلّم أن السجدة الثانية تأتي بعد الجلوس بين السجدتين.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; tasbih_sujud: paragraphs 9 and 11; phrase_volume_unspecified: paragraphs 3, 7, 9-11; phrase volume unspecified; sujud_instruction: paragraphs 9-11.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: اش هو التسبيح / وش يعني تسبيح / وش التسبيح / هل اقولها بصوت عالي / اقولها بصوت عالي / هل ارفع صوتي / وش السجود / ما فهمت الحركة / وش اقول.
- Next: prayer_demo_transition.
- Next action: review CTA; performance occurs outside the application.

## prayer_demo_transition

- User sees: إكمال الركعات / Complete the rak'ahs.
- Primary explanation: في مراجعة التعلم، تتكرر الركعات بترتيب القيام والركوع والسجود، ثم تتعلم ختام الصلاة.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; rakah_definition: paragraphs 7-14.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش يعني ركعة / كم ركعة / what is a rakah.
- Next: prayer_tashahhud.
- Next action: review CTA; performance occurs outside the application.

## prayer_taslim

- User sees: تعلّم ختام الصلاة / Learn the end of prayer.
- Primary explanation: تعلّم أن ختام الصلاة يكون بالتسليم.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; taslim_definition: paragraph 13.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: كيف تنتهي الصلاة / وش التسليم / what is taslim.
- Next: learning_ready.
- Next action: review CTA; performance occurs outside the application.

## learning_ready

- User sees: جاهز تبدأ؟ / Ready to begin?.
- Primary explanation: راجعت خطوات الصلاة. يمكنك إعادة أي جزء تحتاجه، أو البدء عندما تشعر أنك مستعد.
- User needs: understand this action and its position in the ready stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: مراجعة الخطوات => pre_prayer_review / راجعت التسلسل => prayer_ready.
- Next action: review CTA; performance occurs outside the application.

## prayer_done

- User sees: تمت رحلتك الأولى / Your first prayer journey is complete.
- Primary explanation: أتممت رحلة أول صلاة خطوة بخطوة.
- User needs: understand this action and its position in the completion stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: terminal.
- Next action: review CTA; performance occurs outside the application.

## prayer_final_dua

- User sees: الدعاء قبل التسليم / Supplication before Taslim.
- Primary explanation: بعد التشهد والصلاة على النبي، يوضح المصدر الاستعاذة بالله من أربع، ثم الدعاء بما تشاء من خير الدنيا والآخرة، قبل التسليم.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: prayer_taslim.
- Next action: review CTA; performance occurs outside the application.

## prayer_tashahhud

- User sees: الجلوس بعد الركعة الثانية / Sitting after the second unit.
- Primary explanation: بعد السجدة الثانية من الركعة الثانية يأتي الجلوس للتشهد. في الفجر يكون هذا الجلوس الأخير؛ في الصلاة ذات ثلاث أو أربع ركعات يتبعه قيام للركعات الباقية.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; tashahhud_definition: paragraphs 13-14.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: التشهد ذكر يقال في الجلوس. نصه الكامل والصلاة على النبي يحتاجان مراجعة وحفظًا قبل الصلاة؛ هذا الملخص وحده لا يعلّمهما..
- Ask questions: وش التشهد / what is tashahhud.
- Next: prayer_later_units.
- Next action: review CTA; performance occurs outside the application.

## prayer_later_units

- User sees: الركعات الباقية والجلوس الأخير / Remaining units and final sitting.
- Primary explanation: الفجر ركعتان، المغرب ثلاث، والظهر والعصر والعشاء أربع. يوضح المصدر قراءة الفاتحة في الركعات التالية، ثم الجلوس الأخير بعد آخر ركعة قبل التسليم.
- User needs: understand this action and its position in the prayer stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_prayer_binbaz_001; rakah_definition: paragraphs 7-14; tashahhud_definition: paragraphs 13-14.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش يعني ركعة / كم ركعة / what is a rakah / وش التشهد / what is tashahhud.
- Next: prayer_taslim.
- Next action: review CTA; performance occurs outside the application.

## wudu_intro

- User sees: الوضوء / Wudu.
- Primary explanation: الوضوء طهارة بالماء قبل الصلاة. ابدأ بالتسمية: بسم الله، ثم اتبع ترتيب الغسل والمسح الموضح هنا دون فاصل طويل بين الأعضاء.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; wudu_definition: paragraph 1.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: الترتيب والموالاة مذكوران في المصدر: لا تقدم عضوًا على عضو ولا تؤخر الانتقال طويلًا. غسل الأعضاء مرة واحدة يجزئ؛ وتكرار غسل الوجه والمضمضة والاستنشاق واليدين والرجلين مرتين أو ثلاثًا مستحب، ولا ننقل ذلك إلى مسح الرأس والأذنين..
- Ask questions: وش الوضوء / ليش أسويه / what is wudu.
- Next: wudu_hands.
- Next action: review CTA; performance occurs outside the application.

## wudu_hands

- User sees: اغسل كفيك / Wash your hands.
- Primary explanation: ابدأ بغسل الكفين.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: ابدأ بغسل الكفين بالماء كما يوضح التطبيق العملي في المصدر، ثم انتقل للمضمضة والاستنشاق..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_mouth.
- Next action: review CTA; performance occurs outside the application.

## wudu_mouth

- User sees: المضمضة / Rinse your mouth.
- Primary explanation: تمضمض بالماء.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: ضع الماء في الفم وحرّكه داخله، ثم أخرجه. لا تبتلعه. يذكر المصدر المبالغة في المضمضة والاستنشاق ما لم تكن صائمًا أو تخشى ضررًا..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_nose.
- Next action: review CTA; performance occurs outside the application.

## wudu_nose

- User sees: الاستنشاق / Rinse your nose.
- Primary explanation: استنشق الماء ثم أخرجه برفق.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: اجذب الماء إلى الأنف بالنفس، ثم أخرجه بالاستنثار. يذكر المصدر استثناء الصائم ومن يخشى الضرر من المبالغة..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_face.
- Next action: review CTA; performance occurs outside the application.

## wudu_face

- User sees: اغسل وجهك / Wash your face.
- Primary explanation: اغسل وجهك بالماء من منابت الشعر المعتادة إلى الذقن، ومن الأذن إلى الأذن.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; wudu_face_detail: video requires review.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: اغسل ما على الوجه من شعر كالحاجبين. إذا كانت اللحية خفيفة يصل الماء إلى البشرة تحتها؛ وإن كانت كثيفة يُغسل ظاهرها، ويذكر المصدر استحباب تخليلها بالماء..
- Ask questions: كيف اغسل وجهي / كم مرة / how wash face.
- Next: wudu_right_arm.
- Next action: review CTA; performance occurs outside the application.

## wudu_right_arm

- User sees: اغسل يدك اليمنى / Wash your right arm.
- Primary explanation: اغسل اليد اليمنى من أطراف الأصابع إلى المرفق، بما في ذلك المرفق نفسه.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: المرفق هو المفصل بين الذراع والعضد؛ يشمله الغسل. البداية باليمين موضحة في المصدر..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_left_arm.
- Next action: review CTA; performance occurs outside the application.

## wudu_left_arm

- User sees: اغسل يدك اليسرى / Wash your left arm.
- Primary explanation: اغسل اليد اليسرى من أطراف الأصابع إلى المرفق، بما في ذلك المرفق نفسه.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: اغسل اليسرى كما غسلت اليمنى، ولا تترك المرفق خارج الغسل..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_head.
- Next action: review CTA; performance occurs outside the application.

## wudu_head

- User sees: امسح رأسك / Wipe your head.
- Primary explanation: بلّل يديك بماء جديد. امسح من مقدمة الرأس إلى مؤخرته، ثم أعد يديك إلى المقدمة.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: هذه خطوة مسح باليدين المبتلتين، وليست غسل الرأس أو صب الماء عليه. الحركة من المقدمة إلى المؤخرة ثم العودة كما في التطبيق المرئي..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_ears.
- Next action: review CTA; performance occurs outside the application.

## wudu_ears

- User sees: امسح أذنيك / Wipe your ears.
- Primary explanation: امسح الأذنين مرة واحدة: بالسبابتين داخل الأذنين وبالإبهامين ظاهرهما، بما بقي من ماء مسح الرأس.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: السبابة هي الإصبع بجوار الإبهام. يوضح المصدر مسح الداخل بالسبابتين والخارج بالإبهامين مرة واحدة، بعد الرأس وقبل القدمين..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_feet.
- Next action: review CTA; performance occurs outside the application.

## wudu_feet

- User sees: اغسل قدميك / Wash your feet.
- Primary explanation: اغسل القدم اليمنى ثم اليسرى من أطراف الأصابع إلى الكعبين، مع غسل الكعبين والعقبين وبين الأصابع.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; claim-level evidence mapping still needed.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: الكعبان هما العظمان البارزان عند اتصال القدم بالساق. اعتنِ بالعقبين، وهما مؤخر القدمين، وبوصول الماء بين الأصابع..
- Ask questions: coverage gap; abstain rather than invent.
- Next: wudu_complete.
- Next action: review CTA; performance occurs outside the application.

## wudu_complete

- User sees: تم الوضوء / Wudu complete.
- Primary explanation: أصبحت الآن جاهزًا للانتقال إلى الاستعداد للصلاة.
- User needs: understand this action and its position in the wudu stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الوضوء.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_wudu_001; wudu_next: paragraphs 1-2.
- Review: needs_review; existing lesson approval is not independent religious signoff.
- Optional detail: بعد الانتهاء يذكر المصدر استحباب قول: أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله؛ ويذكر زيادة: اللهم اجعلني من التوابين واجعلني من المتطهرين..
- Ask questions: خلصت وضوء الحين وش / what after wudu.
- Next: prep_location.
- Next action: review CTA; performance occurs outside the application.

## fast_intro

- User sees: أول صيام / First Fast.
- Primary explanation: الصيام عبادة بالإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس. ستراجع الاستعداد، ووجبة ما قبل الفجر، وبداية الصيام، والنهار، ثم الإفطار عند الغروب.
- User needs: understand this action and its position in the preparation stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; fast_definition: sections 1 and 7.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش الصيام / what is fasting.
- Next: fast_intention.
- Next action: review CTA; performance occurs outside the application.

## fast_intention

- User sees: النية / Intention.
- Primary explanation: في صيام رمضان، تكون نية صيام اليوم التالي من الليل قبل الفجر. النية أن تعرف أنك تريد الصيام لله.
- User needs: understand this action and its position in the before_fajr stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; fast_intention: section 4.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش النية / متى انوي / what is intention.
- Next: suhoor.
- Next action: review CTA; performance occurs outside the application.

## suhoor

- User sees: السحور / Suhoor.
- Primary explanation: السحور وجبة قبل الفجر وقبل بداية الصيام. هو مستحب وليس شرطًا لصحة الصيام؛ لا تبطل صيامك لمجرد أنك لم تتسحر.
- User needs: understand this action and its position in the before_fajr stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: السحور, الفجر.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: binbaz_suhoor_001, prh_fasting_001; suhoor_definition: section 8 items 1-2; suhoor_requirement: approved source-pack claim: suhoor_requirement; live source fetch pending recheck; fajr_boundary: section 1.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: إذا لم تتسحر، لا يعني ذلك أن صومك غير صحيح..
- Ask questions: وش السحور / what is suhoor / طيب لازم / لازم سحور / إذا ما تسحرت / متى أوقف / متى أوقف أكل / وش يعني الفجر.
- Next: approaching_fajr.
- Next action: review CTA; performance occurs outside the application.

## fast_begin

- User sees: بداية الصيام: مراجعة / Review the start of fasting.
- Primary explanation: يمتد الصيام من طلوع الفجر إلى غروب الشمس.
- User needs: understand this action and its position in the fajr stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; fast_definition: sections 1 and 7; fajr_boundary: section 1.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش الصيام / what is fasting / متى أوقف / متى أوقف أكل / وش يعني الفجر.
- Next: fast_day.
- Next action: review CTA; performance occurs outside the application.

## fast_day

- User sees: أثناء النهار / During the day.
- Primary explanation: أثناء وقت الصيام تتجنب الأكل والشرب المتعمدين. ويؤكد المصدر اجتناب الكذب والغيبة والشتم. الحالات الشخصية، ومنها المرض والأدوية، تحتاج سؤالًا مختصًا؛ لا نستنتج حكمها من هذا الملخص.
- User needs: understand this action and its position in the daytime stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; fast_definition: sections 1 and 7; iftar_boundary: sections 1 and 8 item 3.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: وش الصيام / what is fasting / متى أفطر / وش المغرب / الحين آكل.
- Next: approaching_iftar.
- Next action: review CTA; performance occurs outside the application.

## approaching_iftar

- User sees: قرب الإفطار في المحاكاة / Approaching Iftar in the simulation.
- Primary explanation: تعلّم ما تنتظره قبل الإفطار: في الواقع ينتهي وقت الصيام عند تحقق غروب الشمس في مكانك، لا عند وصول العدّاد التجريبي إلى الصفر.
- User needs: understand this action and its position in the approaching_iftar stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: المغرب, الإفطار.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; iftar_boundary: sections 1 and 8 item 3.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: تنتقل المحاكاة تلقائيًا إلى مراجعة الإفطار عند 18:00 في ساعة العرض. هذا ليس تأكيدًا لدخول المغرب في مكانك..
- Ask questions: متى أفطر / وش المغرب / الحين آكل.
- Next: iftar.
- Next action: review CTA; performance occurs outside the application.

## iftar

- User sees: الإفطار / Iftar.
- Primary explanation: عند تحقق غروب الشمس في مكانك ينتهي وقت الصيام. فتح هذه الشاشة لا يعني أن وقت الإفطار دخل.
- User needs: understand this action and its position in the iftar stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: الإفطار, المغرب.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; iftar_boundary: sections 1 and 8 item 3; iftar_food: section 8 item 4; iftar_count: section 8 item 4; count unspecified.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: إذا دخل وقت المغرب في مكانك فقد انتهت مدة الصيام، ويمكنك الإفطار. في وضع العرض نعرض هذه الحالة يدويًا بدل الاعتماد على موقعك..
- Ask questions: متى أفطر / وش المغرب / الحين آكل / ما عندي تمر / أفطر على ايش / لا يوجد تمر / كم تمرة / لازم ثلاث / لازم عدد فردي.
- Next: fast_done.
- Next action: review CTA; performance occurs outside the application.

## fast_done

- User sees: أكملت مراجعة يوم الصيام / Fasting-day review complete.
- Primary explanation: راجعت المراحل من الاستعداد إلى الإفطار. تقدّمك هنا يسجل التعلّم؛ لا يثبت أنك صمت يومًا فعليًا.
- User needs: understand this action and its position in the completion stage.
- Possible confusion: no scoped KnowledgeItem; explanation may not answer beginner follow-ups.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: product/navigation only.
- Source support: UI policy; claim-level evidence mapping still needed.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: coverage gap; abstain rather than invent.
- Next: terminal.
- Next action: review CTA; performance occurs outside the application.

## approaching_fajr

- User sees: قبل بدء الصيام / Before fasting begins.
- Primary explanation: راجع وقت الفجر في تقويم محلي موثوق. يبدأ الصيام بطلوع الفجر؛ المواقيت التجريبية لا تخبرك أن الوقت دخل فعلًا.
- User needs: understand this action and its position in the before_fajr stage.
- Possible confusion: details beyond retrieved evidence; real time versus illustrative state.
- Terminology: no linked term definition; manual terminology review required.
- Defined: linked terms available; not a complete terminology audit.
- Religious claims: instruction above.
- Source support: prh_fasting_001; fajr_boundary: section 1.
- Review: approved; existing lesson approval is not independent religious signoff.
- Optional detail: not yet available.
- Ask questions: متى أوقف / متى أوقف أكل / وش يعني الفجر.
- Next: fast_begin.
- Next action: review CTA; performance occurs outside the application.
