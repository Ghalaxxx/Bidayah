import { readFile } from 'node:fs/promises';

const registry = JSON.parse(await readFile(new URL('../data/ask/journey-context.json', import.meta.url), 'utf8'));
export const INTENTS = ['DEFINITION', 'WHAT_DO_I_DO', 'HOW_TO', 'WHAT_DO_I_SAY', 'PRONUNCIATION', 'MEANING', 'REQUIREMENT_STATUS', 'RECOMMENDATION_STATUS', 'VALIDITY', 'REPETITION_COUNT', 'TIMING', 'NEXT_ACTION', 'PREVIOUS_ACTION', 'REASON', 'ALTERNATIVE', 'WHAT_IF_I_CANNOT', 'WHAT_IF_I_MISSED', 'SIMULATION_STATUS', 'SOURCE_REQUEST', 'CLARIFICATION', 'PERSONAL_CASE', 'UNSUPPORTED'];
export function normalize(text) {
  return String(text ?? '').toLowerCase().normalize('NFKC').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
const stepSubjects = {
  prayer_intro: 'wudu', know_wudu: 'wudu', in_wudu: 'wudu', wudu_intro: 'wudu', wudu_complete: 'wudu',
  prep_location: 'prayer_preparation', prep_qiblah: 'facing_qiblah', prayer_selection: 'rakah', rakah_intro: 'rakah', pre_prayer_review: 'prayer_intention',
  prayer_takbir: 'takbir', prayer_stand: 'standing', prayer_ruku: 'ruku', prayer_rise: 'rising', prayer_sujud: 'sujud', prayer_second_sujud: 'sujud', prayer_sit: 'sitting', prayer_tashahhud: 'tashahhud', prayer_later_units: 'blessing', prayer_final_dua: 'final_dua', prayer_taslim: 'taslim',
  fast_intro: 'fasting', fast_intention: 'fast_intention', suhoor: 'suhoor', approaching_fajr: 'fajr', fast_begin: 'fajr', fast_day: 'fasting', approaching_iftar: 'iftar', iftar: 'iftar', fast_done: 'fasting',
};
export function journeyContext(state = {}) {
  const selection = state.answers?.prayer_selection;
  const nodes = state.journeyId === 'first_fast' ? registry.first_fast : Object.hasOwn(registry.first_prayer, selection ?? '') ? registry.first_prayer[selection] : registry.first_prayer.maghrib;
  const node = nodes.find(node => node.id === state.stepId) ?? nodes.find(node => node.subjectStep === state.stepId);
  const subjectStep = node?.subjectStep ?? state.stepId?.replace(/^unit_\d+_/, '').replace(/_final$/, '');
  const previousId = Array.isArray(state.stepHistory) ? state.stepHistory.at(-1) : undefined;
  const previous = nodes.find(candidate => candidate.id === previousId);
  const next = nodes.find(candidate => candidate.id === node?.next);
  return { journeyId: state.journeyId, mode: state.mode, language: state.language, stepId: state.stepId, stageId: node?.stageId, subjectStep, subject: stepSubjects[subjectStep] ?? (subjectStep?.startsWith('wudu_') ? subjectStep : undefined), previous, next, unitNumber: node?.unitNumber, totalUnits: node?.totalUnits, key: [state.sessionId, state.journeyId, state.mode, state.language, state.stepId, selection].join(':') };
}
const topics = [
  ['iftar', /تمر|تمرة|تمرات|رطب|افطار|افطر|iftar|dates?\b|break.*fast/u],
  ['suhoor', /سحور|تسحر|suhoor|suhur/u], ['fast_intention', /نية|نيه|intention|intend/u],
  ['facing_qiblah', /قبلة|قبله|كعبة|كعبه|qiblah|kaaba|where.*face/u],
  ['tashahhud', /تشهد|tashahhud/u], ['taslim', /تسليم|taslim/u], ['ruku', /ركوع|اركع|ruku|bowing/u], ['sujud', /سجود|سجدة|سجده|سجدات|sujud|prostrat/u],
  ['takbir', /تكبير|الله اكبر|takbir|allahu akbar/u], ['rakah', /ركعة|ركعه|ركعات|rak.?ah|units?\b/u],
  ['wudu_head', /راسي|راس|شعر|head|hair/u], ['wudu_ears', /اذن|اذني|اذان|\bear\b|\bears\b/u], ['wudu_face', /وجهي|(?:^|\s)(?:الوجه|وجه)(?:$|\s)|my face|the face/u],
  ['wudu_feet', /قدمي|قدمين|قدمان|رجلين|feet|foot/u], ['wudu_hands', /(?:^|\s)(?:كفي|كفين|كفوف)(?:$|\s)|hands/u],
  ['wudu', /وضوء|وضو|اتوضا|wudu|ablution/u], ['fasting', /صيام|صوم|fasting|\bfast\b/u],
];
const requirementContextWords = new Set(normalize('لازم ضروري واجب واجبة شرط طيب هل هي هو هذي هذه هذا ذي اذا ما لو سويتها سويت اسويها اسوي وش يصير اقدر اتركها اترك عادي ارجع يدي الرجوع اقولها انطقها بصوت ثلاث عدد فردي مرة استغني عنها اكلت is are this that it required necessary mandatory must obligatory do i have to can leave out skip omit eat my hands returning return move back say speaking speak aloud repetitions three an odd number of the then').split(' '));
export function resolveQuestion(question, state, memory) {
  const q = normalize(question);
  const context = journeyContext(state);
  const explicit = topics.find(([, pattern]) => pattern.test(q))?.[0];
  const followup = /(?:^طيب|فيه|فيها|عنها|عنه|لها|لو ما اكلت|then|\bit\b|\bthat\b)/u.test(q) || /^(?:كيف|لازم|وش المصدر|وش الدليل|how|required|mandatory|source|what source)$/u.test(q);
  let subject = explicit ?? (followup && memory?.contextKey === context.key ? memory.lastSubject : undefined) ?? context.subject;
  if (subject === 'fast_intention' && state.journeyId === 'first_prayer') subject = 'prayer_intention';
  if (context.subject === 'wudu_head' && explicit === 'wudu_hands' && /return|back|ارجع|اعيد/u.test(q)) subject = 'wudu_head';
  if (/نية|نيه|intention/u.test(q) && !explicit) subject = state.journeyId === 'first_fast' ? 'fast_intention' : 'prayer_intention';
  // A mention of the displayed instrument is a different subject from the religious direction/boundary.
  if (/بوصلة|بوصله|compass/u.test(q)) subject = 'displayed_compass';
  if (/عداد|محاكاة|محاكاه|simulation|countdown|demo clock/u.test(q)) subject = 'displayed_clock';
  let intent = 'UNSUPPORTED';
  const rules = [
    ['PERSONAL_CASE', /دواء|مريض|حامل|مسافر|مرض|حمل|سكري|انسولين|صليت|صمت|medicine|sick|pregnan|travel|diabet|i prayed|i fasted/u],
    ['WHAT_IF_I_MISSED', /نسيت|نسيان|فاتني|forgot|missed/u],
    ['WHAT_IF_I_CANNOT', /ما قدرت|ما اقدر|لا استطيع|cannot|can.t manage|unable/u],
    ['SIMULATION_STATUS', /حقيقي|حقيقية|حقيقيه|تجريبي|محاكاة|محاكاه|simulation|simulated|real\b|accurate/u],
    ['SOURCE_REQUEST', /مصدر|دليل|من وين جبت|source|evidence/u],
    ['PRONUNCIATION', /انطق|نطق|الفظ|كيف اقول|pronounc|how.*say it/u],
    ['REQUIREMENT_STATUS', /لازم|ضروري|واجب|واجبة|واجبه|شرط|ما سويتها|ما سويت|اترك|تركها|لو تركت|استغني|لو ما اكلت|must|required|necessary|have to|mandatory|obligatory|skip|leave.*out|omit/u],
    ['VALIDITY', /يبطل|باطل|يصح|صحيح.*صيام|صيام.*صحيح|valid|invalid/u],
    ['RECOMMENDATION_STATUS', /سنة|سنه|مستحب|افضل|احسن|recommended|sunnah|better/u],
    ['REPETITION_COUNT', /كم|مرة وحدة|مره وحده|مرة|مره|ثلاث|واحدة|واحده|عدد|سبع|اعيدها|how many|how often|once|three|seven|odd number|one date|repeat it/u],
    ['NEXT_ACTION', /بعده|بعدها|وبعدين|بعدين|التالي|next|after that|^then$/u],
    ['PREVIOUS_ACTION', /قبلها|قبل هذا|السابق|previous|before this/u],
    ['REASON', /ليش|ليه|لماذا|why/u],
    ['ALTERNATIVE', /لو ما عندي|ما عندي|ما فيه|بديل|لا يوجد|without dates|no dates|alternative|don.t have/u],
    ['TIMING', /متي|وقت|الحين اكل|الحين افطر|اوقف|الفجر|المغرب|when|time|eat now|stop eating/u],
    ['WHAT_DO_I_SAY', /وش اقول|ايش اقول|ماذا اقول|وش اقرا|اقولها|بصوت|what.*say|what.*recit|aloud|loudly/u],
    ['HOW_TO', /كيف|وين|ارجع يدي|ماء جديد|مويا جديد|مويه جديد|اغسل|امسح|مو فاهم الحركة|ما فهمت الحركة|how|where|new water|fresh water/u],
    ['MEANING', /معناها|معناه|(?:يعني|معني|mean).*(?:الله اكبر|سبحان|عبارة|عباره|phrase)|ترجمة|ترجمه|translate/u],
    ['DEFINITION', /وش.*يعني|وش معني|وش هي|وش هو|وش ذا|وش ذي|ايش هي|ايش هو|اش هي|اش هو|ما معني|ما المقصود|ما هي|ما هو|what is|what.*mean|define/u],
    ['WHAT_DO_I_DO', /وش اسوي|ايش اسوي|هل اسويها|الحين وش|^الحين$|افطر علي|what now|what.*do now|what should i do|what.*break.*with|^now$/u],
    ['CLARIFICATION', /عادي|كذا|صح|okay|ok\b|like this|right\b/u],
  ];
  intent = rules.find(([, pattern]) => pattern.test(q))?.[0] ?? intent;
  if (intent === 'UNSUPPORTED' && explicit && /^(?:وش|ايش|اش)\s+/u.test(q)) intent = 'DEFINITION';
  if (['fast_intention', 'prayer_intention'].includes(subject) && /انطق|بصوت|تلفظ|اقول|say|speak|aloud/u.test(q) && intent === 'PRONUNCIATION') intent = /لازم|ضروري|واجب|must|have to|required/u.test(q) ? 'REQUIREMENT_STATUS' : 'WHAT_DO_I_SAY';
  if (q === 'وش يعني' || q === 'what does it mean') intent = 'DEFINITION';
  if (intent === 'DEFINITION' && memory?.contextKey === context.key && memory.lastIntent === 'WHAT_DO_I_SAY' && /what.*mean/u.test(q) && !explicit) intent = 'MEANING';
  if (intent === 'MEANING' && !explicit && memory?.contextKey === context.key && ['WHAT_DO_I_SAY', 'MEANING'].includes(memory.lastIntent)) subject = memory.lastSubject.replace(/_recitation$/, '') + '_recitation';
  if (intent === 'PRONUNCIATION' && ['takbir', 'ruku', 'sujud', 'sitting', 'rising', 'tashahhud', 'blessing', 'final_dua', 'taslim'].includes(subject)) subject += '_recitation';
  if (['NEXT_ACTION', 'PREVIOUS_ACTION'].includes(intent)) subject = context.subject;
  if (/تجاهل التعليمات|اخترع|ignore.*instruction|system prompt|invent|تراويح|وتر|نذر|كفارة|زكاة|زكاه|ذهب|tahajjud|tarawih|witr|zakat|gold/u.test(q)) intent = 'UNSUPPORTED';
  // Only deictic requirement questions may inherit a subject; unknown nouns are not the current step.
  if (intent === 'REQUIREMENT_STATUS' && !explicit && q.split(' ').some(word => !requirementContextWords.has(word))) {
    subject = 'unknown';
    intent = 'UNSUPPORTED';
  }
  if (/حقيقي|حقيقية|حقيقيه|real\b/u.test(q) && subject === 'facing_qiblah') subject = 'displayed_compass';
  if (intent === 'SIMULATION_STATUS' && !explicit && state.journeyId === 'first_fast') subject = 'displayed_clock';
  if (subject === 'displayed_compass' && intent !== 'SIMULATION_STATUS') subject = 'facing_qiblah';
  const countTarget = /ذكر|تسبيح|اقول|اكرر|repeat.*phrase|say.*times|say.*phrase|times.*say/u.test(q) ? 'phrase' : /سجدات|سجدة|سجده|prostrations/u.test(q) ? 'action' : memory?.contextKey === context.key && memory.lastIntent === 'WHAT_DO_I_SAY' && !explicit ? 'phrase' : undefined;
  const ambiguousCount = intent === 'REPETITION_COUNT' && ['ruku', 'sujud'].includes(subject) && !countTarget;
  const ambiguous = !subject || intent === 'CLARIFICATION' || ambiguousCount;
  const expandedQuery = `${subject ?? 'unknown'} ${intent} ${countTarget ?? ''} ${q}`;
  const sourceKnowledgeIds = intent === 'SOURCE_REQUEST' && memory?.contextKey === context.key && memory.lastSubject.replace(/_recitation$/, '') === subject ? memory.lastKnowledgeItems : undefined;
  return { subject, intent, confidence: ambiguous ? 0.45 : intent === 'UNSUPPORTED' ? 0 : 0.96, expandedQuery, countTarget, sourceKnowledgeIds, clarificationNeeded: ambiguous, context };
}
