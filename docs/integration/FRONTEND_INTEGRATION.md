# Frontend Integration Contract

## Goal

The future designer frontend should replace visual components without reimplementing religious logic.

## Required Interfaces

### Journey API

```ts
type JourneyClient = {
  getState(): JourneyState;
  startJourney(journeyId: "first_prayer" | "first_fast"): JourneyState;
  chooseMode(mode: "doing_now" | "learning_first"): JourneyState;
  answerOption(value: string): JourneyState;
  go(nextStepId?: string): JourneyState;
  previous(): JourneyState;
  reset(): JourneyState;
};
```

### Ask API

```ts
type AskClient = {
  ask(input: {
    question: string;
    state: JourneyState;
    language: "ar" | "en";
  }): Promise<AskBidayahAnswer>;
};
```

### Content API

```ts
type ContentClient = {
  getStep(stepId: string, language: "ar" | "en"): AtomicStep;
  getSources(sourceIds: string[]): Source[];
  getGlossary(termId: string, language: "ar" | "en"): GlossaryItem;
};
```

## Frontend Rules

- Show source-backed badges only when source IDs are present and approved.
- Do not render arbitrary LLM text as trusted religious guidance unless `status === "answered"` and source IDs exist.
- Show `NEEDS_REVIEW` visibly when returned.
- Preserve RTL Arabic and LTR English.
- Do Now must end with putting the phone aside before prayer.
- Learn First may be interactive, but must be labeled as practice/review before prayer.

## Designer Frontend Handoff

The designer frontend can freely change:

- layout
- typography
- colors
- animation
- card design
- mobile shell

It must not change:

- journey transitions
- source policy
- answer status semantics
- supported scope
- prayer phone-use behavior
