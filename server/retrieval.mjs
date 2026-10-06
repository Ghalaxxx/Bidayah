import { readFile } from 'node:fs/promises';
import { normalize, resolveQuestion, journeyContext, INTENTS } from './ask-context.mjs';
export { normalize, resolveQuestion } from './ask-context.mjs';

const read = async file => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
export const knowledge = [...await read('../data/knowledge/knowledge.json'), ...await read('../data/knowledge/ask-knowledge.json')];
export const sources = await read('../public/data/sources/sources.json');
export const facets = await read('../data/knowledge/ask-facets.json');
const tokens = text => [...new Set(normalize(text).split(' ').filter(Boolean))];
export function embeddingDocument(item, lang) {
  return item[lang] + ' ' + item.questions.filter(question => /[\u0600-\u06ff]/u.test(question) === (lang === 'ar')).join(' ');
}
export function validMemory(memory, state) {
  const context = journeyContext(state);
  if (!memory || memory.contextKey !== context.key || !INTENTS.includes(memory.lastIntent) || !Array.isArray(memory.lastKnowledgeItems) || memory.lastKnowledgeItems.length > 3) return undefined;
  if (typeof memory.lastSubject !== 'string') return undefined;
  const subject = memory.lastSubject.replace(/_recitation$/, '');
  const ids = memory.lastKnowledgeItems.filter(id => knowledge.some(item => item.id === id && item.status === 'approved' && item.journey === state.journeyId) && facets.some(facet => facet.knowledgeId === id && facet.subjects.includes(subject)));
  if (!ids.length || ids.length !== memory.lastKnowledgeItems.length) return undefined;
  return { contextKey: context.key, lastSubject: memory.lastSubject, lastIntent: memory.lastIntent, lastKnowledgeItems: ids };
}
function qualifierMatches(facet, resolution, question) {
  const q = normalize(question);
  if (facet.qualifier === 'tasbih') return /تسبيح|tasbih|glorification/u.test(q);
  if (facet.qualifier === 'phrase_count') return resolution.intent === 'RECOMMENDATION_STATUS' || resolution.countTarget === 'phrase';
  if (facet.qualifier === 'action_count') return resolution.countTarget === 'action';
  if (facet.qualifier === 'date_count') return /تمرة|تمرات|تمر|عدد|واحد|ثلاث|سبع|dates?|odd|three|seven|one/u.test(q);
  if (facet.qualifier === 'voice_intention') return /اقول|انطق|بصوت|لفظ|say|speak|aloud/u.test(q);
  if (facet.qualifier === 'volume') return /بصوت|صوتي|صوت|aloud|loud/u.test(q);
  return true;
}
export function eligibleEvidence(question, state, resolution) {
  if (resolution.clarificationNeeded || ['PERSONAL_CASE', 'WHAT_IF_I_CANNOT', 'UNSUPPORTED', 'PRONUNCIATION', 'MEANING', 'SIMULATION_STATUS'].includes(resolution.intent)) return [];
  let subject = resolution.subject;
  let intents = [resolution.intent];
  if (['NEXT_ACTION', 'PREVIOUS_ACTION'].includes(resolution.intent)) {
    const node = resolution.intent === 'NEXT_ACTION' ? resolution.context.next : resolution.context.previous;
    if (!node) return [];
    subject = journeyContext({ ...state, stepId: node.id }).subject;
    intents = ['HOW_TO', 'WHAT_DO_I_DO', 'DEFINITION', 'WHAT_DO_I_SAY'];
  }
  const candidates = facets.filter(facet => facet.subjects.includes(subject) && (!resolution.sourceKnowledgeIds || resolution.sourceKnowledgeIds.includes(facet.knowledgeId)) && (resolution.intent === 'SOURCE_REQUEST' || facet.intents.some(intent => intents.includes(intent))) && qualifierMatches(facet, resolution, question))
    .map(facet => ({ facet, item: knowledge.find(item => item.id === facet.knowledgeId) }))
    .filter(({ item }) => item?.status === 'approved' && item.journey === state.journeyId && sources.some(source => source.id === item.sourceId && source.verified));
  const voiceQuestion = /اقول|انطق|بصوت|لفظ|say|speak|aloud/u.test(normalize(question));
  return candidates.filter(({ facet }) => {
    if (!['REQUIREMENT_STATUS', 'VALIDITY'].includes(resolution.intent)) return true;
    if (voiceQuestion && facet.qualifier !== 'voice_intention') return false;
    return facet.guidanceType === 'religious_requirement' || facet.qualifier === 'date_count';
  });
}
export function retrieve(question, state, resolution = resolveQuestion(question, state)) {
  const query = normalize(question);
  if (!query) return [];
  const queryTokens = tokens(query);
  return eligibleEvidence(question, state, resolution).map(({ facet, item }) => {
    const exact = item.questions.map(normalize).includes(query);
    const overlap = queryTokens.filter(token => tokens(item.questions.join(' ')).includes(token)).length / queryTokens.length;
    const score = 5 + (facet.qualifier ? 8 : 0) + (exact ? 3 : overlap);
    return { item, facet, score, inStep: item.steps.includes(resolution.context.subjectStep) };
  }).sort((a, b) => b.score - a.score || Number(b.inStep) - Number(a.inStep)).slice(0, 3);
}
export function safetyReason(question, state) {
  const q = normalize(question);
  if (state.stepId === 'phone_aside_start') return 'phone_aside';
  if (/(اثناء الصلاة|داخل الصلاة|وانا اصلي|during prayer|while praying|live prayer)/u.test(q) && /(جوال|هاتف|خطوة|تابع|phone|step|guide)/u.test(q)) return 'phone_aside';
  if (/(تجاهل التعليمات|ignore.*instruction|system prompt|اخترع|invent)/u.test(q)) return 'unsupported';
  return undefined;
}
