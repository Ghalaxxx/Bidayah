import type { ExperienceMode } from "./journey";
import type { FastingSimulationState } from "./fasting-time";

export type Lang = "ar" | "en";
export type JourneyId = "first_prayer" | "first_fast";
export type Mode = ExperienceMode;
export type ReviewStatus = "approved" | "needs_review";

export type JourneyState = {
  version: 2;
  sessionId: string;
  language: Lang;
  journeyId?: JourneyId;
  stageId?: string;
  stepId?: string;
  mode?: Mode;
  locationContext?: "home" | "mosque" | "other";
  completedSteps: string[];
  stepHistory: string[];
  answers: Record<string, string | boolean | number>;
  prerequisites: Record<string, boolean | string>;
  fastingSimulation?: FastingSimulationState;
  startedAt: string;
  updatedAt: string;
};

export type Source = {
  id: string;
  titleAr: string;
  titleEn: string;
  organizationAr: string;
  organizationEn: string;
  authorAr?: string;
  authorEn?: string;
  url: string;
  verified: boolean;
};

export type Step = {
  id: string;
  templateId?: string;
  unitNumber?: number;
  totalUnits?: number;
  journeyId: JourneyId;
  stageId: string;
  type: "INTRO" | "QUESTION" | "INSTRUCTION" | "CHECKLIST" | "RECITATION" | "TRANSITION" | "COMPLETION";
  title: Record<Lang, string>;
  instruction: Record<Lang, string>;
  explanation?: Record<Lang, string>;
  howToKnow?: Record<Lang, string>;
  practicalNote?: Record<Lang, string>;
  introducedTerms?: string[];
  relatedGlossaryIds?: string[];
  recommendedPractices?: {
    id: string;
    title: Record<Lang, string>;
    body: Record<Lang, string>;
    sourceIds: string[];
    reviewStatus: ReviewStatus;
  }[];
  sourceIds: string[];
  knowledgeItemIds?: string[];
  reviewStatus: ReviewStatus;
  guidanceType: "ui" | "religious";
  next?: string;
  options?: { label: Record<Lang, string>; value: string; next?: string }[];
};


export type GlossaryItem = {
  id: string;
  terms: Record<Lang, string[]>;
  aliases: Record<Lang, string[]>;
  definition: Record<Lang, string>;
  beginnerExplanation: Record<Lang, string>;
  relatedJourneyIds: JourneyId[];
  relatedStepIds: string[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
};

export const sources: Source[] = [
  {
    id: "prh_wudu_001",
    organizationAr: "رئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي",
    organizationEn: "Presidency of Religious Affairs at the Grand Mosque and the Prophet's Mosque",
    titleAr: "صفة الوضوء",
    titleEn: "How to Perform Wudu",
    url: "https://risala.prh.gov.sa/ar/content/514",
    verified: true,
  },
  {
    id: "prh_prayer_binbaz_001",
    organizationAr: "رئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي",
    organizationEn: "Presidency of Religious Affairs at the Grand Mosque and the Prophet's Mosque",
    titleAr: "كيفية صلاة النبي ﷺ",
    titleEn: "How the Prophet Prayed",
    authorAr: "الشيخ عبد العزيز بن عبد الله بن باز",
    authorEn: "Sheikh Abdulaziz bin Abdullah bin Baz",
    url: "https://risala.prh.gov.sa/ar/content/106",
    verified: true,
  },
  {
    id: "prh_fasting_001",
    organizationAr: "رئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي",
    organizationEn: "Presidency of Religious Affairs at the Grand Mosque and the Prophet's Mosque",
    titleAr: "من أحكام الصيام",
    titleEn: "Some Rulings of Fasting",
    authorAr: "اللجنة العلمية برئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي",
    authorEn: "Scientific Committee under the Presidency of Religious Affairs at the Grand Mosque and the Prophet's Mosque",
    url: "https://risala.prh.gov.sa/ar/content/252",
    verified: true,
  },
  {
    id: "binbaz_suhoor_001",
    organizationAr: "الموقع الرسمي لسماحة الشيخ عبد العزيز بن باز",
    organizationEn: "Official website of Sheikh Abdulaziz Ibn Baz",
    titleAr: "السحور ليس شرطًا في صحة الصيام",
    titleEn: "Suhoor is not a condition for the validity of fasting",
    url: "https://binbaz.org.sa/fatwas/12275/",
    verified: true,
  },
];

export const glossary: GlossaryItem[] = [
  {
    id: "qiblah",
    terms: { ar: ["القبلة", "قبلة"], en: ["qiblah", "qibla"] },
    aliases: { ar: ["اتجاه القبلة", "اتجاه الصلاة", "وين اتوجه"], en: ["prayer direction", "where do i face", "direction of prayer"] },
    definition: { ar: "القبلة هي الجهة التي يتوجه إليها المسلم في الصلاة.", en: "The Qiblah is the direction a Muslim faces in prayer." },
    beginnerExplanation: { ar: "في هذه الخطوة، المطلوب منك أن تجعل وجهتك نحو القبلة قبل أن تبدأ الصلاة.", en: "In this step, you face the Qiblah before beginning the prayer." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["prep_qiblah"],
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
  },
  {
    id: "wudu",
    terms: { ar: ["الوضوء", "وضوء"], en: ["wudu", "ablution"] },
    aliases: { ar: ["اتوضأ", "طهارة بالماء"], en: ["wash before prayer", "purification with water"] },
    definition: { ar: "الوضوء طهارة بالماء نستعد بها للصلاة.", en: "Wudu is purification with water before prayer." },
    beginnerExplanation: { ar: "إذا لم تتوضأ من قبل، خذها خطوة خطوة: نغسل أعضاء محددة ثم نكمل إلى الصلاة.", en: "If you have never done it before, take it step by step: wash the specified parts, then continue to prayer." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["wudu_intro", "know_wudu", "in_wudu"],
    sourceIds: ["prh_wudu_001"],
    reviewStatus: "approved",
  },
  {
    id: "rakah",
    terms: { ar: ["ركعة", "الركعة"], en: ["rak'ah", "rakah", "unit of prayer"] },
    aliases: { ar: ["وحدة الصلاة"], en: ["prayer unit"] },
    definition: { ar: "الركعة جزء من الصلاة يجمع قيامًا وركوعًا وسجودًا ضمن ترتيب الصلاة.", en: "A rak'ah is one unit of prayer that includes standing, bowing, and prostration in the prayer sequence." },
    beginnerExplanation: { ar: "عندما ترى كلمة ركعة، فالمقصود جزء يتكرر في الصلاة بترتيب معروف.", en: "When you see rak'ah, think of one repeated unit within the prayer." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["prayer_stand", "prayer_ruku", "prayer_sujud"],
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
  },
  {
    id: "ruku",
    terms: { ar: ["الركوع", "ركوع"], en: ["ruku", "bowing"] },
    aliases: { ar: ["اركع", "انحني"], en: ["bow", "bend forward"] },
    definition: { ar: "الركوع هو الانحناء في الصلاة بعد القراءة.", en: "Ruku is the bowing position in prayer after recitation." },
    beginnerExplanation: { ar: "في هذه الخطوة تنحني للركوع ثم تنتقل بعدها للرفع منه.", en: "In this step you bow, then rise from bowing." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["prayer_ruku"],
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
  },
  {
    id: "sujud",
    terms: { ar: ["السجود", "سجود", "اسجد"], en: ["sujud", "prostration"] },
    aliases: { ar: ["السجدة"], en: ["prostrate"] },
    definition: { ar: "السجود موضع في الصلاة يكون بعد الركوع والرفع منه.", en: "Sujud is the prostration position in prayer after bowing and rising." },
    beginnerExplanation: { ar: "في مراجعة الصلاة، تتعلّم السجود بعد الرفع من الركوع. هذه مراجعة قبل الصلاة.", en: "In this review before prayer, you learn prostration after rising from bowing." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["prayer_sujud", "prayer_second_sujud"],
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
  },
  {
    id: "suhoor",
    terms: { ar: ["السحور", "سحور"], en: ["suhoor", "pre-dawn meal"] },
    aliases: { ar: ["الأكل قبل الفجر"], en: ["meal before fajr", "eat before dawn"] },
    definition: { ar: "السحور هو الأكل قبل بدء الصيام وقبل الفجر.", en: "Suhoor is eating before the fast begins, before Fajr." },
    beginnerExplanation: { ar: "السحور مستحب، لكنه ليس شرطًا لصحة الصيام.", en: "Suhoor is recommended, but it is not a condition for the fast to be valid." },
    relatedJourneyIds: ["first_fast"],
    relatedStepIds: ["suhoor"],
    sourceIds: ["binbaz_suhoor_001", "prh_fasting_001"],
    reviewStatus: "approved",
  },
  {
    id: "iftar",
    terms: { ar: ["الإفطار", "أفطر", "افطار"], en: ["iftar", "break the fast"] },
    aliases: { ar: ["وقت الفطور", "أنهي الصيام"], en: ["break my fast", "eat after fasting"] },
    definition: { ar: "الإفطار هو إنهاء الصيام عند دخول وقته.", en: "Iftar is breaking the fast when its time begins." },
    beginnerExplanation: { ar: "في رحلة الصيام، يكون الإفطار بعد انتهاء وقت الصيام بغروب الشمس.", en: "In the fasting journey, Iftar comes after the fasting time ends at sunset." },
    relatedJourneyIds: ["first_fast"],
    relatedStepIds: ["iftar"],
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
  },
  {
    id: "maghrib",
    terms: { ar: ["المغرب", "أذان المغرب"], en: ["maghrib", "maghrib adhan"] },
    aliases: { ar: ["وقت المغرب", "غروب الشمس"], en: ["sunset prayer", "sunset"] },
    definition: { ar: "المغرب يرتبط بوقت غروب الشمس، وهو الوقت الذي تنتهي عنده مدة الصيام في هذه الرحلة.", en: "Maghrib is connected to sunset, the point when the fasting period ends in this journey." },
    beginnerExplanation: { ar: "في العرض التجريبي نستخدم دخول وقت المغرب كإشارة عملية للإفطار، دون استخدام موقعك الحقيقي.", en: "In demo mode, Bidayah uses Maghrib time as the practical signal for Iftar without using your real location." },
    relatedJourneyIds: ["first_fast"],
    relatedStepIds: ["iftar"],
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
  },
  {
    id: "fajr",
    terms: { ar: ["الفجر", "فجر"], en: ["fajr", "dawn"] },
    aliases: { ar: ["قبل الفجر", "وقت الفجر"], en: ["before fajr", "dawn time"] },
    definition: { ar: "الفجر هو الوقت الذي يبدأ عنده الصيام في رحلة أول صيام.", en: "Fajr is the point when fasting begins in the First Fast journey." },
    beginnerExplanation: { ar: "قبل الفجر تكون مرحلة النية والسحور، وبعد دخول الفجر يبدأ وقت الصيام.", en: "Before Fajr is the time for intention and Suhoor; once Fajr begins, the fast starts." },
    relatedJourneyIds: ["first_fast"],
    relatedStepIds: ["fast_intention", "suhoor", "fast_begin"],
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
  },
  {
    id: "takbir",
    terms: { ar: ["تكبيرة الإحرام", "التكبير", "الله أكبر"], en: ["takbir", "opening takbir", "allahu akbar"] },
    aliases: { ar: ["ابدأ الصلاة", "كبر"], en: ["begin prayer", "opening phrase"] },
    definition: { ar: "تكبيرة الإحرام هي قول: الله أكبر عند بدء الصلاة.", en: "The opening Takbir is saying Allahu Akbar when beginning the prayer." },
    beginnerExplanation: { ar: "هذه هي عبارة البداية التي تنقلك إلى الصلاة في هذا التسلسل.", en: "This is the opening phrase that begins the prayer sequence." },
    relatedJourneyIds: ["first_prayer"],
    relatedStepIds: ["prayer_takbir"],
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
  },
];

const wuduRows = [
  ["wudu_intro", "الوضوء", "Wudu", "الوضوء طهارة بالماء قبل الصلاة. ابدأ بالتسمية: بسم الله، ثم اتبع ترتيب الغسل والمسح الموضح هنا دون فاصل طويل بين الأعضاء.", "Wudu is purification with water before prayer. Begin by saying Bismillah, then follow the washing and wiping sequence shown here without a long interruption between parts."],
  ["wudu_hands", "اغسل كفيك", "Wash your hands", "ابدأ بغسل الكفين.", "Begin by washing both hands."],
  ["wudu_mouth", "المضمضة", "Rinse your mouth", "تمضمض بالماء.", "Rinse your mouth with water."],
  ["wudu_nose", "الاستنشاق", "Rinse your nose", "استنشق الماء ثم أخرجه برفق.", "Draw water into the nose, then clear it gently."],
  ["wudu_face", "اغسل وجهك", "Wash your face", "اغسل وجهك بالماء من منابت الشعر المعتادة إلى الذقن، ومن الأذن إلى الأذن.", "Wash your face from the normal hairline to the chin, and from ear to ear."],
  ["wudu_right_arm", "اغسل يدك اليمنى", "Wash your right arm", "اغسل اليد اليمنى من أطراف الأصابع إلى المرفق، بما في ذلك المرفق نفسه.", "Wash the right arm from the fingertips through the elbow, including the elbow itself."],
  ["wudu_left_arm", "اغسل يدك اليسرى", "Wash your left arm", "اغسل اليد اليسرى من أطراف الأصابع إلى المرفق، بما في ذلك المرفق نفسه.", "Wash the left arm from the fingertips through the elbow, including the elbow itself."],
  ["wudu_head", "امسح رأسك", "Wipe your head", "بلّل يديك بماء جديد. امسح من مقدمة الرأس إلى مؤخرته، ثم أعد يديك إلى المقدمة.", "Wet your hands with fresh water. Wipe from the front of the head to the back, then return your hands to the front."],
  ["wudu_ears", "امسح أذنيك", "Wipe your ears", "امسح الأذنين مرة واحدة: بالسبابتين داخل الأذنين وبالإبهامين ظاهرهما، بما بقي من ماء مسح الرأس.", "Wipe the ears once: use the index fingers for the inner ears and the thumbs for the outer backs, with the water remaining after wiping the head."],
  ["wudu_feet", "اغسل قدميك", "Wash your feet", "اغسل القدم اليمنى ثم اليسرى من أطراف الأصابع إلى الكعبين، مع غسل الكعبين والعقبين وبين الأصابع.", "Wash the right foot then the left, from the toes through the ankles, including the ankles, heels and between the toes."],
  ["wudu_complete", "تم الوضوء", "Wudu complete", "أصبحت الآن جاهزًا للانتقال إلى الاستعداد للصلاة.", "You are now ready to continue preparing for prayer."],
] as const;

const wuduDetails: Record<string, Record<Lang, string>> = {
  wudu_intro: { ar: "الترتيب والموالاة مذكوران في المصدر: لا تقدم عضوًا على عضو ولا تؤخر الانتقال طويلًا. غسل الأعضاء مرة واحدة يجزئ؛ وتكرار غسل الوجه والمضمضة والاستنشاق واليدين والرجلين مرتين أو ثلاثًا مستحب، ولا ننقل ذلك إلى مسح الرأس والأذنين.", en: "The source specifies order and continuity: do not rearrange the parts or leave a long interruption. One complete washing suffices; washing the face, mouth, nose, arms and feet twice or three times is recommended. This repetition is not transferred to wiping the head and ears." },
  wudu_hands: { ar: "ابدأ بغسل الكفين بالماء كما يوضح التطبيق العملي في المصدر، ثم انتقل للمضمضة والاستنشاق.", en: "Start by washing both hands with water as shown in the source demonstration, then move to rinsing the mouth and nose." },
  wudu_mouth: { ar: "ضع الماء في الفم وحرّكه داخله، ثم أخرجه. لا تبتلعه. يذكر المصدر المبالغة في المضمضة والاستنشاق ما لم تكن صائمًا أو تخشى ضررًا.", en: "Put water in the mouth, move it around inside, then spit it out rather than swallowing it. The source recommends thorough mouth and nose rinsing except when fasting or fearing harm." },
  wudu_nose: { ar: "اجذب الماء إلى الأنف بالنفس، ثم أخرجه بالاستنثار. يذكر المصدر استثناء الصائم ومن يخشى الضرر من المبالغة.", en: "Draw water into the nose with the breath, then expel it. The source excludes someone fasting or fearing harm from stronger rinsing." },
  wudu_face: { ar: "اغسل ما على الوجه من شعر كالحاجبين. إذا كانت اللحية خفيفة يصل الماء إلى البشرة تحتها؛ وإن كانت كثيفة يُغسل ظاهرها، ويذكر المصدر استحباب تخليلها بالماء.", en: "Wash facial hair such as the eyebrows. With a thin beard, water reaches the skin underneath; with a thick beard wash its outside. The source recommends working water through a thick beard." },
  wudu_right_arm: { ar: "المرفق هو المفصل بين الذراع والعضد؛ يشمله الغسل. البداية باليمين موضحة في المصدر.", en: "The elbow is the joint between the forearm and upper arm; include it in the washing. The source begins with the right arm." },
  wudu_left_arm: { ar: "اغسل اليسرى كما غسلت اليمنى، ولا تترك المرفق خارج الغسل.", en: "Wash the left as you washed the right; do not leave the elbow out." },
  wudu_head: { ar: "هذه خطوة مسح باليدين المبتلتين، وليست غسل الرأس أو صب الماء عليه. الحركة من المقدمة إلى المؤخرة ثم العودة كما في التطبيق المرئي.", en: "This is wiping with wet hands, not washing the head or pouring water over it. Move front to back and return as demonstrated." },
  wudu_ears: { ar: "السبابة هي الإصبع بجوار الإبهام. يوضح المصدر مسح الداخل بالسبابتين والخارج بالإبهامين مرة واحدة، بعد الرأس وقبل القدمين.", en: "The index finger is next to the thumb. The source shows the index fingers wiping inside and the thumbs outside once, after the head and before the feet." },
  wudu_feet: { ar: "الكعبان هما العظمان البارزان عند اتصال القدم بالساق. اعتنِ بالعقبين، وهما مؤخر القدمين، وبوصول الماء بين الأصابع.", en: "The ankles are the prominent bones where the feet meet the legs. Pay attention to the heels at the backs of the feet and water reaching between the toes." },
  wudu_complete: { ar: "بعد الانتهاء يذكر المصدر استحباب قول: أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله؛ ويذكر زيادة: اللهم اجعلني من التوابين واجعلني من المتطهرين.", en: "After finishing, the source recommends the testimony of faith and the additional supplication asking to be among those who repent and purify themselves." },
};

const wuduSteps: Step[] = wuduRows.map(([id, arTitle, enTitle, arInstruction, enInstruction], index) => ({
  id,
  journeyId: "first_prayer",
  stageId: "wudu",
  type: id === "wudu_complete" ? "COMPLETION" : id === "wudu_intro" ? "INTRO" : "INSTRUCTION",
  title: { ar: arTitle, en: enTitle },
  instruction: { ar: arInstruction, en: enInstruction },
  explanation: wuduDetails[id],
  sourceIds: ["prh_wudu_001"],
  relatedGlossaryIds: ["wudu"],
  introducedTerms: ["wudu"],
  reviewStatus: "needs_review",
  guidanceType: "religious",
  next: wuduRows[index + 1]?.[0] ?? "prep_location",
}));

const prayerSteps: Step[] = [
  {
    id: "prayer_intro",
    journeyId: "first_prayer",
    stageId: "intro",
    type: "INTRO",
    title: { ar: "سنجهزك قبل الصلاة", en: "We will prepare you before prayer" },
    instruction: { ar: "سنراجع الوضوء والقبلة والخطوات الأساسية أولًا، حتى تعرف ما ستفعل قبل أن تبدأ.", en: "We will review Wudu, the Qiblah, and the core steps first, so you know what to do before you begin." },
    practicalNote: { ar: "إذا كنت تريد الصلاة قريبًا، استخدم بداية للمراجعة والاستعداد، ثم ضع الهاتف جانبًا عندما تكون مستعدًا.", en: "If you want to pray soon, use Bidayah to review and prepare, then put the phone aside when you are ready." },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
    next: "know_wudu",
  },
  {
    id: "know_wudu",
    journeyId: "first_prayer",
    stageId: "readiness",
    type: "QUESTION",
    title: { ar: "هل تعرف كيف تتوضأ؟", en: "Do you know how to perform Wudu?" },
    instruction: { ar: "الوضوء طهارة بالماء قبل الصلاة. إذا لم تتعلّمه من قبل، اختر الشرح.", en: "Wudu is purification with water before prayer. If you have not learned it, choose the lesson." },
    options: [
      { label: { ar: "نعم", en: "Yes" }, value: "yes", next: "in_wudu" },
      { label: { ar: "لا", en: "No" }, value: "no", next: "wudu_intro" },
      { label: { ar: "لست متأكدًا", en: "I'm not sure" }, value: "not_sure", next: "wudu_intro" },
    ],
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
  },
  {
    id: "in_wudu",
    journeyId: "first_prayer",
    stageId: "readiness",
    type: "QUESTION",
    title: { ar: "هل أنت متوضئ الآن؟", en: "Are you currently in Wudu?" },
    instruction: { ar: "هذا يحدد هل ننتقل للاستعداد للصلاة أو نبدأ الوضوء.", en: "This decides whether we continue to prayer preparation or start Wudu." },
    options: [
      { label: { ar: "نعم", en: "Yes" }, value: "yes", next: "prep_location" },
      { label: { ar: "لا", en: "No" }, value: "no", next: "wudu_intro" },
    ],
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
  },
  {
    id: "prep_location",
    journeyId: "first_prayer",
    stageId: "preparation",
    type: "QUESTION",
    title: { ar: "أين ستصلي؟", en: "Where will you pray?" },
    instruction: { ar: "سنستخدم الإجابة للسياق العملي فقط.", en: "We will use this only for practical context." },
    options: [
      { label: { ar: "في المنزل", en: "At home" }, value: "home", next: "prep_qiblah" },
      { label: { ar: "في المسجد", en: "At a mosque" }, value: "mosque", next: "prep_qiblah" },
      { label: { ar: "مكان آخر", en: "Somewhere else" }, value: "other", next: "prep_qiblah" },
    ],
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
  },
  {
    id: "prep_qiblah",
    journeyId: "first_prayer",
    stageId: "preparation",
    type: "CHECKLIST",
    title: { ar: "استقبل القبلة", en: "Face the Qiblah" },
    instruction: { ar: "توجّه إلى القبلة قبل أن تبدأ الصلاة.", en: "Face the Qiblah before beginning the prayer." },
    explanation: { ar: "القبلة هي اتجاه الكعبة.", en: "The Qiblah is the direction of the Ka'bah." },
    howToKnow: {
      ar: "للعرض التجريبي استخدم اتجاه القبلة الذي تعرفه من المكان أو من شخص موثوق في الموقع. لا يستخدم بداية موقعك الحقيقي الآن.",
      en: "For the demo, use the Qiblah direction known at your place or from a trusted local indication. Bidayah is not using your live location.",
    },
    practicalNote: {
      ar: "المطلوب في هذه الشاشة أن تفهم أنك ستبدأ الصلاة وأنت متوجه للقبلة.",
      en: "The point of this screen is to know that you begin prayer while facing the Qiblah.",
    },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["qiblah"],
    introducedTerms: ["qiblah"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_selection",
  },
  {
    id: "prayer_selection",
    journeyId: "first_prayer",
    stageId: "preparation",
    type: "QUESTION",
    title: { ar: "أي صلاة تستعد لها؟", en: "Which prayer are you preparing for?" },
    instruction: {
      ar: "اختر الصلاة التي تريد مراجعتها. المواقيت المعروضة مثال توضيحي؛ لا تحدد الصلاة الحالية في مكانك.",
      en: "Choose the prayer you want to review. The example timetable does not identify the current prayer where you are.",
    },
    practicalNote: {
      ar: "إذا كنت لا تعرف الصلاة الحالية في الواقع، اسأل شخصًا موثوقًا أو استخدم تقويم صلاة موثوق. بداية لا يحسب المواقيت الحية الآن.",
      en: "If you do not know the current prayer in real life, ask a trusted person or use a trusted prayer timetable. Bidayah does not calculate live prayer times yet.",
    },
    options: [
      { label: { ar: "الفجر — ركعتان", en: "Fajr — 2 units" }, value: "fajr", next: "rakah_intro" },
      { label: { ar: "الظهر — أربع ركعات", en: "Dhuhr — 4 units" }, value: "dhuhr", next: "rakah_intro" },
      { label: { ar: "العصر — أربع ركعات", en: "Asr — 4 units" }, value: "asr", next: "rakah_intro" },
      { label: { ar: "المغرب — ثلاث ركعات", en: "Maghrib — 3 units" }, value: "maghrib", next: "rakah_intro" },
      { label: { ar: "العشاء — أربع ركعات", en: "Isha — 4 units" }, value: "isha", next: "rakah_intro" },
    ],
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["rakah"],
    introducedTerms: ["rakah"],
    reviewStatus: "approved",
    guidanceType: "religious",
  },
  {
    id: "rakah_intro",
    journeyId: "first_prayer",
    stageId: "preparation",
    type: "INTRO",
    title: { ar: "ما معنى ركعة؟", en: "What is a rak'ah?" },
    instruction: {
      ar: "الركعة وحدة من الصلاة: قيام وقراءة، ثم ركوع، ثم وقوف، ثم سجود وجلوس وسجود ثانٍ. سنتعلّم ترتيب الوحدات قبل الصلاة.",
      en: "A rak'ah is one prayer unit: standing and recitation, bowing, standing again, prostration, sitting and a second prostration. We review the units before prayer.",
    },
    explanation: {
      ar: "سنعلّم الحركة وما تقوله خطوة بخطوة، ولن تحتاج إلى فهم كل المصطلحات مسبقًا.",
      en: "We will teach the movement and what to say step by step; you do not need to know every term beforehand.",
    },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["rakah", "ruku", "sujud"],
    introducedTerms: ["rakah", "ruku", "sujud"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "pre_prayer_review",
  },
  {
    id: "pre_prayer_review",
    journeyId: "first_prayer",
    stageId: "preparation",
    type: "CHECKLIST",
    title: { ar: "قبل أن تبدأ", en: "Before you begin" },
    instruction: {
      ar: "تأكد أنك على وضوء، متوجه للقبلة، وتعرف أن الرحلة ستبدأ بالتكبير ثم القيام والقراءة.",
      en: "Make sure you are in Wudu, facing the Qiblah, and know that the sequence begins with Takbir, then standing and recitation.",
    },
    practicalNote: {
      ar: "إذا كنت تريد الصلاة قريبًا، راجع هذه الشاشة ثم انتقل لشاشة الاستعداد.",
      en: "If you want to pray soon, review this screen and then move to the readiness screen.",
    },
    sourceIds: ["prh_prayer_binbaz_001", "prh_wudu_001"],
    relatedGlossaryIds: ["wudu", "qiblah", "takbir"],
    introducedTerms: ["wudu", "qiblah", "takbir"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_takbir",
  },
  {
    id: "prayer_ready",
    journeyId: "first_prayer",
    stageId: "ready",
    type: "TRANSITION",
    title: { ar: "أنت جاهز للصلاة", en: "You are ready to pray" },
    instruction: {
      ar: "راجعت الخطوات التي تحتاجها. عندما تكون مستعدًا، ضع الهاتف جانبًا وابدأ الصلاة.",
      en: "You reviewed the steps you need. When you are ready, put the phone aside and begin the prayer.",
    },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
    next: "phone_aside_start",
  },
  {
    id: "phone_aside_start",
    journeyId: "first_prayer",
    stageId: "ready",
    type: "COMPLETION",
    title: { ar: "ضع الهاتف جانبًا وابدأ الصلاة", en: "Put the phone aside and begin the prayer" },
    instruction: {
      ar: "ابدأ الصلاة عندما تكون مستعدًا. بعد أن تنتهي، ارجع إلى بداية وحدد أنك أنهيت الصلاة.",
      en: "Begin the prayer when you are ready. After you finish, return to Bidayah and mark the prayer complete.",
    },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
    options: [
      { label: { ar: "لم أبدأ؛ أرجع للمراجعة", en: "I have not started; return to review" }, value: "review_again", next: "pre_prayer_review" },
      { label: { ar: "رجعت بعد انتهاء الصلاة", en: "I returned after finishing prayer" }, value: "finished", next: "prayer_done" },
    ],
  },
  {
    id: "prayer_takbir",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "RECITATION",
    title: { ar: "تعلّم بداية الصلاة", en: "Learn the beginning of prayer" },
    instruction: { ar: "في الصلاة، تبدأ بتكبيرة الإحرام قائلًا: الله أكبر.", en: "In prayer, the sequence begins with the opening Takbir: Allahu Akbar." },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["takbir"],
    introducedTerms: ["takbir"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_stand",
  },
  {
    id: "prayer_stand",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "RECITATION",
    title: { ar: "القيام والقراءة", en: "Standing and recitation" },
    instruction: { ar: "تعلّم أن هذه الخطوة تكون للقيام والقراءة.", en: "Learn that this step is for standing and recitation." },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["rakah"],
    introducedTerms: ["rakah"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_ruku",
  },
  {
    id: "prayer_ruku",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "INSTRUCTION",
    title: { ar: "تعلّم الركوع", en: "Learn bowing" },
    instruction: { ar: "تعلّم حركة الركوع وما يقال فيها: سبحان ربي العظيم.", en: "Learn the bowing movement and what is said in it: Subhana Rabbiyal 'Azim." },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["ruku"],
    introducedTerms: ["ruku"],
    reviewStatus: "approved",
    guidanceType: "religious",
    knowledgeItemIds: ["prayer_current_next_001"],
    next: "prayer_rise",
  },
  {
    id: "prayer_rise",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "RECITATION",
    title: { ar: "تعلّم الرفع من الركوع", en: "Learn rising from bowing" },
    instruction: { ar: "تعلّم أن بعد الركوع يكون الرفع منه والوقوف باطمئنان.", en: "Learn that after bowing comes rising and standing calmly." },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["sujud"],
    introducedTerms: ["sujud"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_sujud",
  },
  {
    id: "prayer_sujud",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "INSTRUCTION",
    title: { ar: "تعلّم السجود", en: "Learn prostration" },
    instruction: { ar: "تعلّم خطوة السجود وما يقال فيها: سبحان ربي الأعلى.", en: "Learn the prostration step and what is said in it: Subhana Rabbiyal A'la." },
    sourceIds: ["prh_prayer_binbaz_001"],
    relatedGlossaryIds: ["sujud"],
    introducedTerms: ["sujud"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_sit",
  },
  {
    id: "prayer_sit",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "INSTRUCTION",
    title: { ar: "تعلّم الجلوس بين السجدتين", en: "Learn sitting between prostrations" },
    instruction: { ar: "تعلّم موضع الجلوس بين السجدتين في ترتيب الصلاة.", en: "Learn the sitting position between the two prostrations in the prayer sequence." },
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_second_sujud",
  },
  {
    id: "prayer_second_sujud",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "INSTRUCTION",
    title: { ar: "السجدة الثانية", en: "Second prostration" },
    instruction: { ar: "تعلّم أن السجدة الثانية تأتي بعد الجلوس بين السجدتين.", en: "Learn that the second prostration comes after sitting between the two prostrations." },
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_demo_transition",
  },
  {
    id: "prayer_demo_transition",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "TRANSITION",
    title: { ar: "إكمال الركعات", en: "Complete the rak'ahs" },
    instruction: { ar: "في مراجعة التعلم، تتكرر الركعات بترتيب القيام والركوع والسجود، ثم تتعلم ختام الصلاة.", en: "In this learning review, rak'ahs repeat through standing, bowing, and prostration, then you learn how the prayer closes." },
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "prayer_tashahhud",
  },
  {
    id: "prayer_taslim",
    journeyId: "first_prayer",
    stageId: "prayer",
    type: "COMPLETION",
    title: { ar: "تعلّم ختام الصلاة", en: "Learn the end of prayer" },
    instruction: { ar: "تعلّم أن ختام الصلاة يكون بالتسليم.", en: "Learn that the prayer closes with Taslim." },
    sourceIds: ["prh_prayer_binbaz_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "learning_ready",
  },
  {
    id: "learning_ready",
    journeyId: "first_prayer",
    stageId: "ready",
    type: "TRANSITION",
    title: { ar: "جاهز تبدأ؟", en: "Ready to begin?" },
    instruction: {
      ar: "راجعت خطوات الصلاة. يمكنك إعادة أي جزء تحتاجه، أو البدء عندما تشعر أنك مستعد.",
      en: "You reviewed the prayer steps. You can review again, or begin when you feel ready.",
    },
    practicalNote: {
      ar: "هذه مراجعة قبل الصلاة. أعد أي جزء لم تفهمه، ثم ضع الهاتف جانبًا عندما تبدأ الصلاة.",
      en: "This is review before prayer. Revisit anything unclear, then put the phone aside when prayer begins.",
    },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
    options: [
      { label: { ar: "مراجعة الخطوات", en: "Review steps" }, value: "review_steps", next: "pre_prayer_review" },
      { label: { ar: "راجعت التسلسل", en: "I reviewed the sequence" }, value: "ready", next: "prayer_ready" },
    ],
  },
  {
    id: "prayer_done",
    journeyId: "first_prayer",
    stageId: "completion",
    type: "COMPLETION",
    title: { ar: "تمت رحلتك الأولى", en: "Your first prayer journey is complete" },
    instruction: { ar: "أتممت رحلة أول صلاة خطوة بخطوة.", en: "You completed the first prayer journey step by step." },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
  },
];

const fastSteps: Step[] = [
  {
    id: "fast_intro",
    journeyId: "first_fast",
    stageId: "preparation",
    type: "INTRO",
    title: { ar: "أول صيام", en: "First Fast" },
    instruction: { ar: "الصيام عبادة بالإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس. ستراجع الاستعداد، ووجبة ما قبل الفجر، وبداية الصيام، والنهار، ثم الإفطار عند الغروب.", en: "Fasting is worship through abstention from invalidators from dawn to sunset. Review preparation, the pre-dawn meal, the beginning, daytime and Iftar at sunset." },
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "fast_intention",
  },
  {
    id: "fast_intention",
    journeyId: "first_fast",
    stageId: "before_fajr",
    type: "INSTRUCTION",
    title: { ar: "النية", en: "Intention" },
    instruction: { ar: "في صيام رمضان، تكون نية صيام اليوم التالي من الليل قبل الفجر. النية أن تعرف أنك تريد الصيام لله.", en: "For Ramadan fasting, intend during the night before dawn to fast the following day for Allah." },
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "suhoor",
  },
  {
    id: "suhoor",
    journeyId: "first_fast",
    stageId: "before_fajr",
    type: "INSTRUCTION",
    title: { ar: "السحور", en: "Suhoor" },
    instruction: { ar: "السحور وجبة قبل الفجر وقبل بداية الصيام. هو مستحب وليس شرطًا لصحة الصيام؛ لا تبطل صيامك لمجرد أنك لم تتسحر.", en: "Suhoor is a meal before dawn, before fasting begins. It is recommended, not a condition for a valid fast; skipping it alone does not invalidate fasting." },
    explanation: { ar: "إذا لم تتسحر، لا يعني ذلك أن صومك غير صحيح.", en: "If you skip Suhoor, that does not by itself make the fast invalid." },
    sourceIds: ["binbaz_suhoor_001", "prh_fasting_001"],
    relatedGlossaryIds: ["suhoor", "fajr"],
    introducedTerms: ["suhoor", "fajr"],
    knowledgeItemIds: ["fast_suhoor_requirement_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "fast_begin",
  },
  {
    id: "fast_begin",
    journeyId: "first_fast",
    stageId: "fajr",
    type: "TRANSITION",
    title: { ar: "بداية الصيام: مراجعة", en: "Review the start of fasting" },
    instruction: { ar: "يمتد الصيام من طلوع الفجر إلى غروب الشمس.", en: "The fast runs from the arrival of Fajr until sunset." },
    sourceIds: ["prh_fasting_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "fast_day",
  },
  {
    id: "fast_day",
    journeyId: "first_fast",
    stageId: "daytime",
    type: "CHECKLIST",
    title: { ar: "أثناء النهار", en: "During the day" },
    instruction: { ar: "أثناء وقت الصيام تتجنب الأكل والشرب المتعمدين. ويؤكد المصدر اجتناب الكذب والغيبة والشتم. الحالات الشخصية، ومنها المرض والأدوية، تحتاج سؤالًا مختصًا؛ لا نستنتج حكمها من هذا الملخص.", en: "During fasting hours, avoid deliberate eating and drinking. The source also stresses avoiding lying, backbiting and insults. Personal circumstances, including illness and medication, need qualified advice; this summary does not determine their ruling." },
    sourceIds: ["prh_fasting_001"],
    knowledgeItemIds: ["fast_safety_personal_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "approaching_iftar",
  },
  {
    id: "approaching_iftar",
    journeyId: "first_fast",
    stageId: "approaching_iftar",
    type: "TRANSITION",
    title: { ar: "قرب الإفطار في المحاكاة", en: "Approaching Iftar in the simulation" },
    instruction: {
      ar: "تعلّم ما تنتظره قبل الإفطار: في الواقع ينتهي وقت الصيام عند تحقق غروب الشمس في مكانك، لا عند وصول العدّاد التجريبي إلى الصفر.",
      en: "Learn what you wait for before Iftar: real fasting ends once sunset is confirmed where you are, not when the demo countdown reaches zero.",
    },
    explanation: {
      ar: "تنتقل المحاكاة تلقائيًا إلى مراجعة الإفطار عند 18:00 في ساعة العرض. هذا ليس تأكيدًا لدخول المغرب في مكانك.",
      en: "The simulation automatically opens the Iftar review at 18:00 on the demo clock. This does not confirm real Maghrib where you are.",
    },
    howToKnow: {
      ar: "اعتمد في الواقع على تقويم صلاة موثوق أو أذان محلي موثوق. هذا النموذج لا يحسب الوقت الحقيقي.",
      en: "In real life, rely on a trusted prayer timetable or trusted local adhan. This MVP does not calculate live time.",
    },
    sourceIds: ["prh_fasting_001"],
    relatedGlossaryIds: ["maghrib", "iftar"],
    introducedTerms: ["maghrib", "iftar"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "iftar",
  },
  {
    id: "iftar",
    journeyId: "first_fast",
    stageId: "iftar",
    type: "COMPLETION",
    title: { ar: "الإفطار", en: "Iftar" },
    instruction: { ar: "عند تحقق غروب الشمس في مكانك ينتهي وقت الصيام. فتح هذه الشاشة لا يعني أن وقت الإفطار دخل.", en: "Fasting ends once sunset is confirmed where you are. Opening this screen does not mean Iftar time has arrived." },
    explanation: {
      ar: "إذا دخل وقت المغرب في مكانك فقد انتهت مدة الصيام، ويمكنك الإفطار. في وضع العرض نعرض هذه الحالة يدويًا بدل الاعتماد على موقعك.",
      en: "When Maghrib time has entered where you are, the fasting period has ended and you may break your fast. In demo mode this state is simulated instead of using your location.",
    },
    howToKnow: {
      ar: "الإشارة العملية للمبتدئ هي دخول وقت المغرب في التقويم أو الأذان المحلي الموثوق. بداية لا يحسب الوقت الحقيقي في هذا النموذج.",
      en: "A practical beginner signal is the local Maghrib time or a trusted local adhan. This MVP does not calculate live prayer times.",
    },
    practicalNote: {
      ar: "ابدأ بشيء يسير للإفطار، ثم أكمل طعامك بهدوء. المستحبات أدناه اختيارية وليست شرطًا لإكمال الرحلة.",
      en: "Start with something simple to break the fast, then continue your meal calmly. The recommended practices below are optional and do not block the journey.",
    },
    recommendedPractices: [
      {
        id: "iftar_rutab_dates_water",
        title: { ar: "ما يُستحب أن تفطر عليه", en: "What is recommended to break the fast with" },
        body: {
          ar: "يدعم المصدر الإفطار على رُطَب إن تيسر، فإن لم توجد فعلى تمرات، فإن لم توجد فعلى ماء. المصدر المعتمد في بداية لا يحدد عددًا معينًا للتمرات هنا.",
          en: "The approved evidence supports breaking the fast with fresh dates if available, otherwise dates, otherwise water. Bidayah's approved source for this moment does not specify a number of dates.",
        },
        sourceIds: ["prh_fasting_001"],
        reviewStatus: "approved",
      },
    ],
    sourceIds: ["prh_fasting_001"],
    relatedGlossaryIds: ["iftar", "maghrib"],
    introducedTerms: ["iftar", "maghrib"],
    knowledgeItemIds: ["fast_when_break_001", "fast_iftar_number_unspecified_001", "fast_iftar_recommended_foods_001"],
    reviewStatus: "approved",
    guidanceType: "religious",
    next: "fast_done",
  },
  {
    id: "fast_done",
    journeyId: "first_fast",
    stageId: "completion",
    type: "COMPLETION",
    title: { ar: "أكملت مراجعة يوم الصيام", en: "Fasting-day review complete" },
    instruction: { ar: "راجعت المراحل من الاستعداد إلى الإفطار. تقدّمك هنا يسجل التعلّم؛ لا يثبت أنك صمت يومًا فعليًا.", en: "You reviewed preparation through Iftar. This progress records learning, not evidence that you performed a fast." },
    sourceIds: [],
    reviewStatus: "approved",
    guidanceType: "ui",
  },
];

const additionalPrayerSteps: Step[] = [
  {
    id: "prayer_final_dua", journeyId: "first_prayer", stageId: "prayer", type: "RECITATION",
    title: { ar: "الدعاء قبل التسليم", en: "Supplication before Taslim" },
    instruction: { ar: "بعد التشهد والصلاة على النبي، يوضح المصدر الاستعاذة بالله من أربع، ثم الدعاء بما تشاء من خير الدنيا والآخرة، قبل التسليم.", en: "After Tashahhud and the blessing on the Prophet, the source describes seeking refuge from four matters, then supplication for good in this life and the next, before Taslim." },
    sourceIds: ["prh_prayer_binbaz_001"], reviewStatus: "approved", guidanceType: "religious", next: "prayer_taslim",
  },
  {
    id: "prayer_tashahhud", journeyId: "first_prayer", stageId: "prayer", type: "RECITATION",
    title: { ar: "الجلوس بعد الركعة الثانية", en: "Sitting after the second unit" },
    instruction: { ar: "بعد السجدة الثانية من الركعة الثانية يأتي الجلوس للتشهد. في الفجر يكون هذا الجلوس الأخير؛ في الصلاة ذات ثلاث أو أربع ركعات يتبعه قيام للركعات الباقية.", en: "After the second prostration of unit two comes the sitting for Tashahhud. In Fajr this is the final sitting; in a three- or four-unit prayer, further units follow." },
    explanation: { ar: "التشهد ذكر يقال في الجلوس. نصه الكامل والصلاة على النبي يحتاجان مراجعة وحفظًا قبل الصلاة؛ هذا الملخص وحده لا يعلّمهما.", en: "Tashahhud is recitation while sitting. Its complete text and the blessing on the Prophet need review before prayer; this summary alone does not teach them." },
    sourceIds: ["prh_prayer_binbaz_001"], reviewStatus: "approved", guidanceType: "religious", next: "prayer_later_units",
  },
  {
    id: "prayer_later_units", journeyId: "first_prayer", stageId: "prayer", type: "INSTRUCTION",
    title: { ar: "الركعات الباقية والجلوس الأخير", en: "Remaining units and final sitting" },
    instruction: { ar: "الفجر ركعتان، المغرب ثلاث، والظهر والعصر والعشاء أربع. يوضح المصدر قراءة الفاتحة في الركعات التالية، ثم الجلوس الأخير بعد آخر ركعة قبل التسليم.", en: "Fajr has two units, Maghrib three, and Dhuhr, Asr and Isha four. The source explains Al-Fatihah in later units and the final sitting after the last unit, before Taslim." },
    sourceIds: ["prh_prayer_binbaz_001"], reviewStatus: "approved", guidanceType: "religious", next: "prayer_taslim",
  },
];
const approachingFajr: Step = {
  id: "approaching_fajr", journeyId: "first_fast", stageId: "before_fajr", type: "TRANSITION",
  title: { ar: "قبل بدء الصيام", en: "Before fasting begins" },
  instruction: { ar: "راجع وقت الفجر في تقويم محلي موثوق. يبدأ الصيام بطلوع الفجر؛ المواقيت التجريبية لا تخبرك أن الوقت دخل فعلًا.", en: "Check Fajr using a trusted local timetable. Fasting begins at dawn; the example times cannot establish that dawn has arrived." },
  sourceIds: ["prh_fasting_001"], reviewStatus: "approved", guidanceType: "religious", next: "fast_begin",
};
fastSteps.find((item) => item.id === "suhoor")!.next = "approaching_fajr";
export const steps = [...prayerSteps, ...additionalPrayerSteps, ...wuduSteps, ...fastSteps, approachingFajr];
