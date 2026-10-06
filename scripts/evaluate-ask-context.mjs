import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { answerQuestion, suggestedQuestions, suggestionCatalog } from '../server/api.mjs';
import { knowledge, sources, normalize, validMemory } from '../server/retrieval.mjs';
import { INTENTS } from '../server/ask-context.mjs';

delete process.env.OPENAI_API_KEY;
delete process.env.BIDAYAH_LOCAL_EMBEDDINGS;
delete process.env.BIDAYAH_SEMANTIC;
const groups = JSON.parse(await readFile(new URL('../data/evaluation/ask-contextual-cases.json', import.meta.url), 'utf8'));
const rows = [];
const failures = [];
const stateFor = (step, language, history = []) => ({ sessionId: 'evaluation-session', journeyId: /^(?:fast_|suhoor|iftar)/u.test(step) ? 'first_fast' : 'first_prayer', language, mode: 'LEARN', stepId: step, stepHistory: history, answers: { prayer_selection: 'maghrib' } });
function checkCitation(answer) {
  return answer.citations.every(citation => {
    const item = knowledge.find(item => item.id === citation.knowledgeId);
    return item?.status === 'approved' && item.sourceId === citation.sourceId && item.locator === citation.locator && sources.some(source => source.id === item.sourceId && source.verified);
  });
}
async function test(question, state, expected, memory, kind = 'contextual') {
  const answer = await answerQuestion(question, state, memory);
  const ids = answer.citations.map(citation => citation.knowledgeId);
  const behavior = expected.behavior ?? 'retrieval-only';
  const result = {
    question, JourneyState: state, expectedSubject: expected.subject, expectedIntent: expected.intent,
    expectedKnowledgeItemIds: expected.ids, expectedSourceIds: [...new Set(expected.ids.map(id => knowledge.find(item => item.id === id)?.sourceId))], expectedBehavior: behavior,
    actualSubject: answer.resolution.subject, actualIntent: answer.resolution.intent, actualKnowledgeItemIds: ids, actualSourceIds: answer.citations.map(citation => citation.sourceId), actualBehavior: answer.mode,
    answer: answer.answer, expandedQuery: answer.resolution.expandedQuery, kind,
    notStoredQuestionVariant: !knowledge.some(item => item.questions.map(normalize).includes(normalize(question))),
    subjectCorrect: answer.resolution.subject === expected.subject,
    intentCorrect: answer.resolution.intent === expected.intent,
    retrievalCorrect: expected.ids.length ? ids.length > 0 && ids.every(id => expected.ids.includes(id)) : ids.length === 0,
    citationIntegrity: checkCitation(answer),
    behaviorCorrect: answer.mode === behavior && answer.escalated === ['abstention', 'product_boundary'].includes(behavior),
    contentCorrect: (!expected.contains || answer.answer.includes(expected.contains)) && (!expected.containsByLanguage?.[state.language] || answer.answer.includes(expected.containsByLanguage[state.language])) && (!expected.nextStepId || answer.resolution.context.next?.id === expected.nextStepId),
  };
  result.passed = result.subjectCorrect && result.intentCorrect && result.retrievalCorrect && result.citationIntegrity && result.behaviorCorrect && result.contentCorrect;
  rows.push(result);
  if (!result.passed) failures.push(result);
  return answer;
}
for (const group of groups) for (const lang of ['ar', 'en']) for (const question of group[lang]) await test(question, stateFor(group.step, lang, group.history), group);

const chipExpected = {
  prep_qiblah: [['facing_qiblah','DEFINITION','qiblah_definition'],['facing_qiblah','HOW_TO','qiblah_definition'],['facing_qiblah','REQUIREMENT_STATUS','qiblah_requirement']],
  suhoor: [['suhoor','DEFINITION','suhoor_definition'],['suhoor','REQUIREMENT_STATUS','suhoor_requirement'],['suhoor','TIMING','fajr_boundary']],
  iftar: [['iftar','TIMING','iftar_boundary'],['iftar','WHAT_DO_I_DO','iftar_food'],['iftar','REPETITION_COUNT','iftar_count']],
  prayer_ruku: [['ruku','DEFINITION','ruku_instruction'],['ruku','WHAT_DO_I_DO','ruku_instruction'],['ruku','WHAT_DO_I_SAY','ruku_instruction']],
  prayer_sujud: [['sujud','DEFINITION','sujud_instruction'],['sujud','WHAT_DO_I_DO','sujud_instruction'],['sujud','WHAT_DO_I_SAY','sujud_instruction']],
  rakah_intro: [['rakah','DEFINITION','rakah_definition'],['rakah','REPETITION_COUNT','rakah_definition']],
  wudu_hands: [['wudu_hands','REPETITION_COUNT','wudu_wash_count']], wudu_head: [['wudu_head','HOW_TO','wudu_head_how']], wudu_ears: [['wudu_ears','HOW_TO','wudu_ears_water']],
};
for (const [step, languages] of Object.entries(suggestionCatalog)) for (const lang of ['ar', 'en']) {
  const state = stateFor(step, lang);
  const visible = suggestedQuestions(state);
  // These reviewed catalog chips must all work; filtering must not conceal a solvable failure.
  if (visible.length !== languages[lang].length) failures.push({ kind: 'suggestions', step, language: lang, visible: visible.map(row => row.question), expected: languages[lang] });
  for (let index = 0; index < languages[lang].length; index++) {
    const [subject, intent, id] = chipExpected[step][index];
    await test(languages[lang][index], state, { subject, intent, ids: [id] }, undefined, 'chip');
  }
}
for (const lang of ['ar', 'en']) {
  const ruku = stateFor('unit_1_prayer_ruku', lang);
  let answer = await test(lang === 'ar' ? 'وش الركوع؟' : 'What is Ruku?', ruku, { subject: 'ruku', intent: 'DEFINITION', ids: ['ruku_instruction'] }, undefined, 'followup');
  answer = await test(lang === 'ar' ? 'طيب وش أقول فيه؟' : 'Then what do I say in it?', ruku, { subject: 'ruku', intent: 'WHAT_DO_I_SAY', ids: ['ruku_instruction'], contains: 'سبحان ربي العظيم' }, answer.memory, 'followup');
  const phraseMemory = answer.memory;
  await test(lang === 'ar' ? 'وش معناها؟' : 'What does it mean?', ruku, { subject: 'ruku_recitation', intent: 'MEANING', ids: [], behavior: 'abstention' }, phraseMemory, 'followup');
  await test(lang === 'ar' ? 'وبعدين؟' : 'What next?', ruku, { subject: 'ruku', intent: 'NEXT_ACTION', ids: ['prayer_rise_phrase'] }, phraseMemory, 'followup');
  await test(lang === 'ar' ? 'كم مرة؟' : 'How many times?', ruku, { subject: 'ruku', intent: 'REPETITION_COUNT', ids: ['tasbih_ruku'] }, phraseMemory, 'followup');
  const qiblah = stateFor('prep_qiblah', lang);
  const requirement = await test(lang === 'ar' ? 'لازم؟' : 'Is it required?', qiblah, { subject: 'facing_qiblah', intent: 'REQUIREMENT_STATUS', ids: ['qiblah_requirement'] }, undefined, 'followup');
  await test(lang === 'ar' ? 'وش المصدر؟' : 'What source?', qiblah, { subject: 'facing_qiblah', intent: 'SOURCE_REQUEST', ids: ['qiblah_requirement'] }, requirement.memory, 'followup');
  const offStep = await test(lang === 'ar' ? 'وش الركوع؟' : 'What is Ruku?', qiblah, { subject: 'ruku', intent: 'DEFINITION', ids: ['ruku_instruction'] }, undefined, 'followup');
  await test(lang === 'ar' ? 'كيف؟' : 'How?', qiblah, { subject: 'ruku', intent: 'HOW_TO', ids: ['ruku_instruction'] }, offStep.memory, 'followup');
  await test(lang === 'ar' ? 'طيب وش أقول فيه؟' : 'Then what do I say in it?', qiblah, { subject: 'ruku', intent: 'WHAT_DO_I_SAY', ids: ['ruku_instruction'] }, offStep.memory, 'followup');
  await test(lang === 'ar' ? 'طيب لازم؟' : 'Do I have to?', stateFor('unit_1_prayer_takbir', lang), { subject: 'takbir', intent: 'REQUIREMENT_STATUS', ids: [], behavior: 'abstention' }, offStep.memory, 'memory-reset');
  const suhoor = stateFor('suhoor', lang);
  answer = await test(lang === 'ar' ? 'السحور لازم؟' : 'Is Suhoor required?', suhoor, { subject: 'suhoor', intent: 'REQUIREMENT_STATUS', ids: ['suhoor_requirement'] }, undefined, 'followup');
  await test(lang === 'ar' ? 'طيب لو ما أكلت؟' : 'Then can I skip it?', suhoor, { subject: 'suhoor', intent: 'REQUIREMENT_STATUS', ids: ['suhoor_requirement'] }, answer.memory, 'followup');
  for (const mutation of [{ stepId: 'iftar' }, { journeyId: 'first_prayer' }, { language: lang === 'ar' ? 'en' : 'ar' }, { mode: 'PREPARE_TO_PERFORM' }, { sessionId: 'new-session' }, { answers: { prayer_selection: 'fajr' } }]) assert.equal(validMemory(answer.memory, { ...suhoor, ...mutation }), undefined);
  assert.equal(validMemory({ ...answer.memory, lastKnowledgeItems: ['invented'] }, suhoor), undefined);
  assert.equal(validMemory({ ...answer.memory, lastSubject: 'facing_qiblah' }, suhoor), undefined);
}
assert.equal(new Set(rows.map(row => row.expectedIntent)).size, INTENTS.length, 'All beginner intents covered');
const ratio = (items, field) => ({ passed: items.filter(row => row[field]).length, total: items.length, percent: items.length ? Number((items.filter(row => row[field]).length / items.length * 100).toFixed(2)) : null });
const summary = items => ({ questions: items.length, subject: ratio(items,'subjectCorrect'), intent: ratio(items,'intentCorrect'), retrieval: ratio(items,'retrievalCorrect'), behavior: ratio(items,'behaviorCorrect') });
const citationRows = rows.filter(row => row.actualKnowledgeItemIds.length);
const escalations = rows.filter(row => ['abstention','product_boundary'].includes(row.expectedBehavior));
const report = { totalQuestions: rows.length, ...summary(rows), arabic: summary(rows.filter(row => row.JourneyState.language === 'ar')), english: summary(rows.filter(row => row.JourneyState.language === 'en')), citationIntegrity: ratio(citationRows,'citationIntegrity'), safeEscalation: ratio(escalations,'behaviorCorrect'), followups: summary(rows.filter(row => ['followup','memory-reset'].includes(row.kind))), unseenParaphrases: summary(rows.filter(row => row.notStoredQuestionVariant)), chips: summary(rows.filter(row => row.kind === 'chip')), failures, liveLLMTested: false, results: rows };
await mkdir(new URL('../docs/evaluation/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/evaluation/ask-contextual-results.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, results: undefined, failures: failures.map(row => ({ question: row.question, step: row.JourneyState?.stepId ?? row.step, subject: [row.expectedSubject,row.actualSubject], intent: [row.expectedIntent,row.actualIntent], ids: [row.expectedKnowledgeItemIds,row.actualKnowledgeItemIds], mode: [row.expectedBehavior,row.actualBehavior], contentCorrect: row.contentCorrect })) }, null, 2));
if (failures.length) process.exitCode = 1;
