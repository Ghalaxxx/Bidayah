import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { canReview, journeyEntry, restoreSession, transitionTarget } from "./domain/journey";
import { prayerTimesService, qiblahService } from "./services/pilot";
import { prayerMovements } from "./domain/prayer";
import { Welcome, BrandMark } from "./components/Welcome";
import { Moon, PersonStanding, X } from "lucide-react";

import { sources, glossary, steps as templates, type Lang, type JourneyId, type JourneyState, type Source } from "./domain/content";
import { buildPrayerSequence } from "./domain/prayer-sequence";
import { FastingTimeContext } from "./components/FastingTimeContext";
import { InstructionalVisual } from "./components/InstructionalVisual";
import { WuduOverview } from "./components/WuduOverview";
import { wuduVisuals, visualForPrayer } from "./domain/media";
import { RecitationPlayer } from "./components/RecitationPlayer";
import { SimulatedFastingClockProvider } from "./services/fasting-clock";
import { useFastingClock } from "./hooks/useFastingClock";
import { canNavigateFastingNext, synchronizeFastingSimulation } from "./domain/fasting-journey";
import { DEMO_FAJR_SECONDS, DEMO_MAGHRIB_SECONDS, validSimulation, type FastingTimeContext as ClockContext } from "./domain/fasting-time";

const demoControlsEnabled = import.meta.env.DEV || (import.meta.env.MODE === "demo" && import.meta.env.VITE_DEMO_CONTROLS === "true");


const copy = {
  ar: {
    tagline: "أول مرة؟ نبدأ معك خطوة بخطوة.",
    chooseLanguage: "اختر اللغة",
    homeTitle: "ماذا ستفعل لأول مرة؟",
    homeSub: "اختر تجربتك، وسنبدأ من المكان المناسب لك.",
    firstPrayer: "أصلي لأول مرة",
    firstPrayerDesc: "استعد للصلاة وتعلّمها خطوة بخطوة.",
    firstFast: "أصوم لأول مرة",
    firstFastDesc: "من قبل الفجر حتى الإفطار، خطوة بخطوة.",
    next: "تم",
    ask: "اسأل بداية",
    reset: "ابدأ من جديد",
    verified: "مصدر موثوق",
    unsupported: "لا أملك إجابة موثقة كافية لهذه الحالة حاليًا.",
    previous: "السابق",
    nextStep: "التالي",
    howToKnow: "كيف أعرف؟",
    recommended: "سنن ومستحبات",
    optional: "اختياري",
  },
  en: {
    tagline: "First time? We'll guide you step by step.",
    chooseLanguage: "Choose language",
    homeTitle: "What are you doing for the first time?",
    homeSub: "Choose your experience and we'll start from the right place.",
    firstPrayer: "First Prayer",
    firstPrayerDesc: "Learn and prepare step by step before prayer.",
    firstFast: "First Fast",
    firstFastDesc: "From before Fajr to Iftar, step by step.",
    next: "Done",
    ask: "Ask Bidayah",
    reset: "Start over",
    verified: "Verified source",
    unsupported: "I don't currently have enough verified information for this situation.",
    previous: "Previous",
    nextStep: "Next",
    howToKnow: "How do I know?",
    recommended: "Recommended practices",
    optional: "Optional",
  },
};

function defaultState(): JourneyState {
  return {
    version: 2,
    sessionId: crypto.randomUUID(),
    language: "en",
    completedSteps: [],
    stepHistory: [],
    answers: {},
    prerequisites: {},
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


type AskMemory = { contextKey: string; lastSubject: string; lastIntent: string; lastKnowledgeItems: string[] };
type AskAnswer = { answer: string; sources: Source[]; escalated: boolean; mode?: string; memory?: AskMemory; citations?: { knowledgeId: string; sourceId: string; locator: string }[] };
async function resolveAnswer(question: string, state: JourneyState, recentContext?: AskMemory): Promise<AskAnswer> {
  try {
    const response = await fetch("/api/ask", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, state, recentContext }), signal: AbortSignal.timeout(65000),
    });
    if (!response.ok) throw new Error("Ask unavailable");
    return await response.json();
  } catch {
    return { answer: state.language === "ar" ? "تعذر الاتصال بخدمة الأسئلة. حاول مرة أخرى؛ لم يتم توليد إجابة دون مصادر." : "The question service is unavailable. Try again; no answer was generated without evidence.", sources: [], escalated: true };
  }
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<JourneyState>(() => {
    const allNodes = ["fajr", "dhuhr", "asr", "maghrib", "isha"].flatMap((prayer) => buildPrayerSequence(templates, prayer));
    return restoreSession(localStorage.getItem("bidayah_state"), defaultState(), allNodes);
  });
  const [fastingClock] = useState(() => new SimulatedFastingClockProvider(validSimulation(state.fastingSimulation) ? state.fastingSimulation.secondsSinceMidnight : undefined));
  const fastingClockActive = entered && state.journeyId === "first_fast" && Boolean(state.mode) && state.stepId !== "fast_done";
  const [showAsk, setShowAsk] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Awaited<ReturnType<typeof resolveAnswer>> | null>(null);
  const [asking, setAsking] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const requestRevision = useRef(0);
  const askMemory = useRef<AskMemory | undefined>(undefined);
  const closeAsk = useCallback(() => {
    requestRevision.current++;
    askMemory.current = undefined;
    setAsking(false);
    setShowAsk(false);
  }, []);
  const onFastingTimeChange = useCallback((context: ClockContext, phaseChanged: boolean) => {
    const seconds = (context.target === "fajr" ? DEMO_FAJR_SECONDS : DEMO_MAGHRIB_SECONDS) - context.remainingTime;
    setState((current) => synchronizeFastingSimulation(current, context, seconds, templates));
    if (phaseChanged) {
      requestRevision.current++;
      askMemory.current = undefined;
      setAsking(false); setShowAsk(false); setAnswer(null); setSourceOpen(false);
    }
  }, []);
  const fastingTime = useFastingClock(fastingClock, fastingClockActive, onFastingTimeChange);
  const lang = state.language;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const steps = buildPrayerSequence(templates, state.answers.prayer_selection);
  const findStep = (id?: string) => steps.find((item) => item.id === id);
  const step = findStep(state.stepId);
  const subjectId = step?.templateId ?? step?.id;
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [state.stepId]);
  const nextAllowed = !step || state.journeyId !== "first_fast" || canNavigateFastingNext(step.id, step.next, fastingTime);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("bidayah_state", JSON.stringify(state));
  }, [state, lang, dir]);

  useEffect(() => {
    if (!showAsk) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAsk();
      if (event.key !== "Tab") return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, a[href]') ?? []);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, [showAsk, closeAsk]);

  const stageOrder = state.journeyId === "first_prayer" ? ["intro", "readiness", "wudu", "preparation", "prayer", "ready", "completion"] : ["preparation", "before_fajr", "fajr", "daytime", "approaching_iftar", "iftar", "completion"];
  const stageIndex = Math.max(0, stageOrder.indexOf(step?.stageId ?? ""));
  const progress = ((stageIndex + 1) / stageOrder.length) * 100;
  const progressLabel = lang === "ar" ? `مرحلة المراجعة ${stageIndex + 1} من ${stageOrder.length}` : `Review stage ${stageIndex + 1} of ${stageOrder.length}`;

  function patch(next: Partial<JourneyState>) {
    requestRevision.current++;
    askMemory.current = undefined;
    setAsking(false);
    setShowAsk(false);
    setAnswer(null);
    setSourceOpen(false);
    setState((current) => ({ ...current, ...next, updatedAt: new Date().toISOString() }));
  }

  function startJourney(journeyId: JourneyId) {
    const entry = journeyEntry(journeyId, steps);
    if (!entry) return;
    fastingClock.reset();
    patch({ journeyId, ...entry, completedSteps: [], stepHistory: [], answers: {}, prerequisites: {}, fastingSimulation: undefined });
  }

  function go(nextId?: string) {
    if (!step) return;
    if (state.journeyId === "first_fast" && !canNavigateFastingNext(step.id, nextId ?? step.next, fastingTime)) return;
    const target = transitionTarget(step, steps, nextId);
    if (!target) return;
    const targetId = target.id;
    patch({
      stepId: targetId,
      stageId: findStep(targetId)?.stageId,
      stepHistory: step ? [...state.stepHistory, step.id] : state.stepHistory,
      completedSteps: step ? Array.from(new Set([...state.completedSteps, step.id])) : state.completedSteps,
    });
  }

  function previous() {
    if (!canReview(state.stepId)) return;
    const prior = state.stepHistory.at(-1);
    if (!prior) return;
    patch({
      stepId: prior,
      stageId: findStep(prior)?.stageId,
      stepHistory: state.stepHistory.slice(0, -1),
    });
  }

  function answerOption(value: string, next?: string) {
    if (!step) return;
    if (!step.options?.some((option) => option.value === value && option.next === next)) return;
    const target = transitionTarget(step, steps, next);
    if (!target) return;
    const context = step.id === "prep_location" ? { locationContext: value as JourneyState["locationContext"] } : {};
    patch({ answers: { ...state.answers, [step.id]: value }, ...context, stepId: target.id, stageId: target.stageId, stepHistory: [...state.stepHistory, step.id], completedSteps: Array.from(new Set([...state.completedSteps, step.id])) });
  }

  function resetJourney() {
    fastingClock.reset();
    patch({ journeyId: undefined, stageId: undefined, stepId: undefined, mode: undefined, completedSteps: [], stepHistory: [], answers: {}, prerequisites: {}, fastingSimulation: undefined });
  }

  async function ask(text: string) {
    if (asking) return;
    const revision = ++requestRevision.current;
    setQuestion(text);
    setShowAsk(true);
    setAnswer(null);
    setAsking(true);
    const resolved = await resolveAnswer(text, state, askMemory.current);
    if (revision !== requestRevision.current) return;
    setAnswer(resolved);
    if (resolved.memory) askMemory.current = resolved.memory;
    setAsking(false);
  }

  function submitQuestion(event: React.FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <main className="shell" dir={dir}>
      <header className="topbar">
        <button className="brand" onClick={() => setEntered(false)} aria-label="Bidayah home">
          <BrandMark />
        </button>
        <div className="toolbar">
          <button className="ghost language-toggle" title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"} onClick={() => patch({ language: lang === "ar" ? "en" : "ar" })}>{lang === "ar" ? "AR" : "EN"}</button>
        </div>
      </header>

      {!entered ? <Welcome lang={lang} onBegin={() => { resetJourney(); setEntered(true); }} onResume={() => setEntered(true)} /> : !state.journeyId ? (
        <section className="home">
          <div className="journey-list">
            <h2>{copy[lang].homeTitle}</h2>
            <p>{copy[lang].homeSub}</p>
            <div className="cards">
              <button className="journey-card prayer" onClick={() => startJourney("first_prayer")}>
                <PersonStanding className="icon" size={25} aria-hidden="true" />
                <strong>{copy[lang].firstPrayer}</strong>
                <small>{copy[lang].firstPrayerDesc}</small>
              </button>
              <button className="journey-card fast" onClick={() => startJourney("first_fast")}>
                <Moon className="icon" size={25} aria-hidden="true" />
                <strong>{copy[lang].firstFast}</strong>
                <small>{copy[lang].firstFastDesc}</small>
              </button>
            </div>
          </div>
        </section>
      ) : step ? (
        <section className={`journey ${state.mode} ${canReview(step.id) ? "" : "phone-aside"}`} data-journey-stage={state.stageId} data-journey-step={step.id}>
          <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <p className="progress-text">{progressLabel}</p>
          <p className="eyebrow">{state.journeyId === "first_prayer" ? copy[lang].firstPrayer : copy[lang].firstFast}</p>
          {state.journeyId === "first_fast" && (step.id !== "fast_done" || state.fastingSimulation?.journeyStage === "iftar") && <FastingTimeContext {...fastingTime} language={lang} showDemoControls={demoControlsEnabled && step.id !== "fast_done"} onSimulate={(action) => fastingClock.simulate(action)} />}
          {state.journeyId === "first_prayer" && canReview(step.id) && (
            <div className="learning-banner">
              <strong>{lang === "ar" ? "وضع التعلّم" : "Learning mode"}</strong>
              <span>{lang === "ar" ? "هذه مراجعة وتدريب قبل الصلاة" : "Practice and review before prayer"}</span>
            </div>
          )}
          <h1>{step.title[lang]}</h1>
          {step.unitNumber && <p className="eyebrow">{lang === "ar" ? `الركعة ${step.unitNumber} من ${step.totalUnits}` : `Unit ${step.unitNumber} of ${step.totalUnits}`}</p>}
          {wuduVisuals.find((asset) => asset.id === subjectId) && <><p className="visual-step-number">{lang === "ar" ? `الخطوة ${wuduVisuals.findIndex((asset) => asset.id === subjectId) + 1} من ${wuduVisuals.length}` : `Step ${wuduVisuals.findIndex((asset) => asset.id === subjectId) + 1} of ${wuduVisuals.length}`}</p><InstructionalVisual asset={wuduVisuals.find((asset) => asset.id === subjectId)!} lang={lang} /></>}
          {visualForPrayer(subjectId ?? "", step.unitNumber, step.totalUnits) && <InstructionalVisual asset={visualForPrayer(subjectId!, step.unitNumber, step.totalUnits)!} lang={lang} />}
          <p className="instruction">{step.instruction[lang]}</p>
          {step.stageId === "wudu" && <WuduOverview lang={lang} steps={steps} />}
          {prayerMovements.find((movement) => movement.stepId === subjectId) && <PrayerMovementDetail key={step.id} stepId={subjectId!} lang={lang} unit={step.unitNumber} total={step.totalUnits} />}
          {step.explanation && <details className="info-detail"><summary>{lang === "ar" ? "تفاصيل أكثر" : "More detail"}</summary><p>{step.explanation[lang]}</p></details>}
          {state.journeyId === "first_prayer" && canReview(step.id) && step.stageId !== "wudu" && <PrayerTimes lang={lang} />}
          {step.id === "prep_qiblah" && <QiblahCompass lang={lang} />}
          {step.id === "rakah_intro" && <p>{lang === "ar" ? "الصلاة المختارة" : "Selected prayer"}: {steps.find((item) => item.id === "prayer_selection")?.options?.find((option) => option.value === state.answers.prayer_selection)?.label[lang]}</p>}
          {step.relatedGlossaryIds && step.relatedGlossaryIds.length > 0 && (
            <div className="term-row" aria-label="Related terms">
              {step.relatedGlossaryIds.map((id) => {
                const item = glossary.find((entry) => entry.id === id);
                if (!item) return null;
                return (
                  <button key={id} className="term-chip" onClick={() => {
                    const fakeQuestion = lang === "ar" ? `وش يعني ${item.terms.ar[0]}؟` : `What is ${item.terms.en[0]}?`;
                    void ask(fakeQuestion);
                  }}>
                    {lang === "ar" ? `ما معنى ${item.terms.ar[0]}؟` : `What is ${item.terms.en[0]}?`}
                  </button>
                );
              })}
            </div>
          )}
          {step.howToKnow && (
            <details className="info-detail">
              <summary>{copy[lang].howToKnow}</summary>
              <p>{step.howToKnow[lang]}</p>
            </details>
          )}
          {step.practicalNote && <p className="practical-note">{step.practicalNote[lang]}</p>}
          {step.recommendedPractices && step.recommendedPractices.length > 0 && (
            <details className="recommended-card">
              <summary>{copy[lang].recommended} <span>{copy[lang].optional}</span></summary>
              {step.recommendedPractices.map((practice) => (
                <div key={practice.id} className="recommended-item">
                  <strong>{practice.title[lang]}</strong>
                  <p>{practice.body[lang]}</p>
                  <SourcePanel ids={practice.sourceIds} lang={lang} compact />
                </div>
              ))}
            </details>
          )}
          <QuestionChips stepId={subjectId ?? step.id} journeyId={state.journeyId!} lang={lang} onAsk={(text) => {
            void ask(text);
          }} />

          {step.options ? (
            <div className="option-list">
              {step.options?.map((option) => (
                <button key={option.value} onClick={() => answerOption(option.value, option.next)}>{option.label[lang]}</button>
              ))}
            </div>
          ) : (
            <div className="cta-row">
              {step.next && <button className="primary" disabled={!nextAllowed} onClick={() => go()}>{step.id === "prayer_ready" ? (lang === "ar" ? "راجعت الخطوات" : "I reviewed the steps") : wuduVisuals.some((asset) => asset.id === subjectId) ? (lang === "ar" ? "فهمت الخطوة" : "I understand this step") : (lang === "ar" ? "تابع المراجعة" : "Continue review")}</button>}
              {!nextAllowed && <p className="fasting-wait-note">{lang === "ar" ? "تفتح المرحلة التالية عندما تصل ساعة المحاكاة إلى وقتها، وليس بناءً على الوقت الحقيقي." : "The next stage opens when the simulation reaches its boundary, not based on real-world time."}</p>}
            </div>
          )}

          {canReview(step.id) && <div className="secondary-actions">
            {step.sourceIds.length > 0 && <button className="linkish" onClick={() => setSourceOpen(!sourceOpen)}>✓ {copy[lang].verified}</button>}
            <button className="linkish" onClick={() => { requestRevision.current++; askMemory.current = undefined; setQuestion(""); setAnswer(null); setShowAsk(true); }}>{copy[lang].ask}</button>
          </div>}

          {sourceOpen && <SourcePanel ids={step.sourceIds} lang={lang} />}
          {canReview(step.id) && <div className="journey-nav">
            <button className="ghost" onClick={previous} disabled={state.stepHistory.length === 0}>{copy[lang].previous}</button>
            {step.next && <button className="ghost" disabled={!nextAllowed} onClick={() => go()}>{copy[lang].nextStep}</button>}
          </div>}
        </section>
      ) : (
        <section className="mode-screen"><h1>{copy[lang].unsupported}</h1><button onClick={resetJourney}>{copy[lang].reset}</button></section>
      )}

      {showAsk && (
        <div className="dialog" role="dialog" aria-modal="true" aria-label={copy[lang].ask}>
          <div className="ask-box" ref={dialogRef}>
            <button className="close" onClick={closeAsk} aria-label={lang === "ar" ? "إغلاق" : "Close"} title={lang === "ar" ? "إغلاق" : "Close"}><X size={20} /></button>
            <h2>{copy[lang].ask}</h2>
            <p className="context">{step?.title[lang]}</p>
            <form onSubmit={submitQuestion}>
              <input aria-label={lang === "ar" ? "سؤالك" : "Your question"} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={lang === "ar" ? "اكتب سؤالك مثل: طيب لازم؟" : "Ask, for example: Do I have to?"} />
              <button disabled={asking || !question.trim()}>{asking ? (lang === "ar" ? "جارٍ البحث…" : "Searching…") : copy[lang].ask}</button>
            </form>
            {answer && (
              <div className={answer.escalated ? "answer escalated" : "answer"}>
                <p>{answer.answer}</p>
                {answer.sources.length > 0 && <SourcePanel ids={answer.sources.map((source) => source.id)} lang={lang} compact />}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function SourcePanel({ ids, lang, compact = false }: { ids: string[]; lang: Lang; compact?: boolean }) {
  const list = ids.map((id) => sources.find((source) => source.id === id)).filter(Boolean) as Source[];
  return (
    <aside className={compact ? "sources compact" : "sources"}>
      {list.map((source) => (
        <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
          <span>✓ {copy[lang].verified}</span>
          <strong>{lang === "ar" ? source.titleAr : source.titleEn}</strong>
          <small>{lang === "ar" ? source.organizationAr : source.organizationEn}</small>
        </a>
      ))}
    </aside>
  );
}

function QuestionChips({ stepId, journeyId, lang, onAsk }: { stepId: string; journeyId: JourneyId; lang: Lang; onAsk: (text: string) => void }) {
  const [result, setResult] = useState<{ key: string; questions: string[] }>();
  const key = `${journeyId}:${stepId}:${lang}`;
  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ journeyId, stepId, language: lang });
    fetch(`/api/ask/suggestions?${query}`, { signal: controller.signal }).then(response => response.ok ? response.json() : { suggestions: [] }).then(data => {
      if (!controller.signal.aborted) setResult({ key, questions: Array.isArray(data.suggestions) ? data.suggestions.map((entry: { question: string }) => entry.question).filter((question: unknown) => typeof question === "string") : [] });
    }).catch(() => {});
    return () => controller.abort();
  }, [key, journeyId, stepId, lang]);
  const chips = result?.key === key ? result.questions : [];
  if (!chips.length) return null;
  return (
    <div className="ask-examples" aria-label={lang === "ar" ? "أسئلة مقترحة" : "Suggested questions"}>
      {chips.map((chip) => (
        <button key={chip} onClick={() => onAsk(chip)}>{chip}</button>
      ))}
    </div>
  );
}

function PrayerTimes({ lang }: { lang: Lang }) {
  const schedule = prayerTimesService.getTimes();
  const names = lang === "ar" ? ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"] : ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  return <details className="prayer-times">
    <summary>{lang === "ar" ? "مواقيت توضيحية — ليست مواقيت مكانك" : "Example timetable — not your local times"}</summary>
    <dl>{Object.entries(schedule.times).map(([name, time], index) => <div key={name}><dt>{names[index]}</dt><dd>{time}</dd></div>)}</dl>
  </details>;
}

function PrayerMovementDetail({ stepId, lang, unit, total }: { stepId: string; lang: Lang; unit?: number; total?: number }) {
  const movement = prayerMovements.find((item) => item.stepId === stepId)!;
  return <section className="movement-detail">
    <p>{stepId === "prayer_stand" && unit && unit > 1 ? (lang === "ar" ? "توضع اليد اليمنى على اليسرى على الصدر. راجع القراءة الموضحة لهذه الركعة." : "Place the right hand over the left on the chest. Review the recitation described for this unit.") : stepId === "prayer_tashahhud" && unit && unit > 2 ? (lang === "ar" ? "هذا التشهد في الجلوس الأخير بعد آخر ركعة من الصلاة المختارة." : "This is Tashahhud in the final sitting after the selected prayer's last unit.") : movement.position[lang]}</p>
    {total && total > 2 && unit === total && ["prayer_tashahhud", "prayer_later_units", "prayer_final_dua"].includes(stepId) && <p>{lang === "ar" ? "في الجلوس الأخير من الصلاة ذات ثلاث أو أربع ركعات يوضح المصدر التورك: الجلوس على المقعدة، والقدم اليسرى تحت اليمنى مع نصب اليمنى." : "For the final sitting of a three- or four-unit prayer, the source describes Tawarruk: sit on the hips, with the left foot under the right and the right foot upright."}</p>}
    {movement.recitation && <RecitationPlayer key={movement.recitation.id} recitation={movement.recitation} lang={lang} />}
    <SourcePanel ids={[movement.sourceId]} lang={lang} compact />
  </section>;
}

function QiblahCompass({ lang }: { lang: Lang }) {
  const direction = qiblahService.getDirection();
  return <figure className="qiblah-compass">
    <div className="compass-face" aria-hidden="true"><span className="north">N</span><span className="compass-needle" style={{ transform: `rotate(${direction.bearingDegrees}deg)` }}>↑</span></div>
    <figcaption>{lang === "ar" ? "بوصلة تجريبية؛ لا تحدد اتجاه القبلة الحقيقي" : "Simulated compass; does not show your real Qiblah"}</figcaption>
  </figure>;
}
