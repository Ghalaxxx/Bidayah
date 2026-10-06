import fs from "node:fs";
import path from "node:path";
import { INTENTS } from "../server/ask-context.mjs";

const root = process.cwd();
const sourcesPath = path.join(root, "public", "data", "sources", "sources.json");
const evaluationPath = path.join(root, "data", "evaluation", "evaluation-cases.json");
const glossaryArPath = path.join(root, "data", "glossary", "glossary.ar.json");
const glossaryEnPath = path.join(root, "data", "glossary", "glossary.en.json");

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const evaluation = JSON.parse(fs.readFileSync(evaluationPath, "utf8"));
const glossary = [
  ...JSON.parse(fs.readFileSync(glossaryArPath, "utf8")),
  ...JSON.parse(fs.readFileSync(glossaryEnPath, "utf8")),
];
const sourceIds = new Set(sources.map((source) => source.id));
const errors = [];
const knowledge = ["knowledge.json", "ask-knowledge.json"].flatMap(file => JSON.parse(fs.readFileSync(path.join(root, "data/knowledge", file), "utf8")));
const knowledgeIds = new Set();
for (const item of knowledge) {
  if (!item.id || knowledgeIds.has(item.id)) errors.push(`Duplicate/missing KnowledgeItem: ${item.id}`);
  knowledgeIds.add(item.id);
  if (!sourceIds.has(item.sourceId) || !item.locator) errors.push(`Missing approved source/locator: ${item.id}`);
  if (!["first_prayer", "first_fast"].includes(item.journey) || !Array.isArray(item.steps) || !Array.isArray(item.questions) || !item.questions.length) errors.push(`Invalid retrieval scope: ${item.id}`);
  if (!["approved", "NEEDS_REVIEW"].includes(item.status)) errors.push(`Invalid review state: ${item.id}`);
  if (item.status === "approved" && (!item.ar?.trim() || !item.en?.trim())) errors.push(`Missing bilingual answer: ${item.id}`);
}

const facets = JSON.parse(fs.readFileSync(path.join(root, "data/knowledge/ask-facets.json"), "utf8"));
for (const facet of facets) {
  if (!knowledgeIds.has(facet.knowledgeId) || !facet.subjects?.length || !facet.intents?.length || facet.intents.some(intent => !INTENTS.includes(intent))) errors.push(`Invalid Ask facet: ${facet.knowledgeId}`);
  if (!["religious_requirement", "recommended", "practical", "definition"].includes(facet.guidanceType)) errors.push(`Invalid guidance type: ${facet.knowledgeId}`);
  if (facet.intents.some(intent => ["REQUIREMENT_STATUS", "VALIDITY"].includes(intent)) && facet.guidanceType !== "religious_requirement" && facet.qualifier !== "date_count") errors.push(`Definition cannot establish requirement: ${facet.knowledgeId}`);
  for (const [intent, answer] of Object.entries(facet.answers ?? {})) if (!INTENTS.includes(intent) || !answer.ar?.trim() || !answer.en?.trim()) errors.push(`Incomplete bilingual facet: ${facet.knowledgeId}/${intent}`);
}
const contextual = JSON.parse(fs.readFileSync(path.join(root, "data/evaluation/ask-contextual-cases.json"), "utf8"));
for (const group of contextual) if (!group.step || !group.subject || !INTENTS.includes(group.intent) || !group.ar?.length || !group.en?.length || !Array.isArray(group.ids) || group.ids.some(id => !knowledgeIds.has(id))) errors.push(`Invalid contextual case group: ${group.step}`);

for (const source of sources) {
  for (const field of ["id", "titleAr", "url", "verified"]) {
    if (source[field] === undefined || source[field] === "") {
      errors.push(`Source ${source.id ?? "(missing id)"} is missing ${field}`);
    }
  }
  if (!String(source.url).startsWith("https://")) {
    errors.push(`Source ${source.id} must use a canonical https URL`);
  }
}

for (const test of evaluation) {
  if (!test.id || !test.language || !test.journeyState || !test.question) {
    errors.push(`Evaluation case is missing required fields: ${JSON.stringify(test)}`);
  }
  for (const sourceId of test.expectedSourceIds ?? []) {
    if (!sourceIds.has(sourceId)) {
      errors.push(`Evaluation ${test.id} references unknown source ${sourceId}`);
    }
  }
}

for (const entry of glossary) {
  if (!entry.id || !entry.definition || !entry.beginnerExplanation || entry.reviewStatus !== "approved") {
    errors.push(`Glossary entry ${entry.id ?? "(missing id)"} is incomplete or not approved`);
  }
  for (const sourceId of entry.sourceIds ?? []) {
    if (!sourceIds.has(sourceId)) {
      errors.push(`Glossary ${entry.id} references unknown source ${sourceId}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${sources.length} sources, ${knowledge.length} KnowledgeItems, ${facets.length} Ask facets, ${glossary.length} glossary entries, ${evaluation.length} legacy evaluation cases, and ${contextual.length} bilingual contextual groups.`);
