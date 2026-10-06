import type { JourneyState, Step } from "./content";
import { DEMO_MAGHRIB_SECONDS, simulationStage, validSimulation, type FastingTimeContext } from "./fasting-time";

export function synchronizeFastingSimulation(state: JourneyState, context: FastingTimeContext, seconds: number, nodes: Step[]): JourneyState {
  if (state.journeyId !== "first_fast" || !state.mode || context.mode !== "simulation" || context.isAuthoritativeTime !== false) return state;
  if (!Number.isInteger(seconds) || seconds < 0 || seconds > DEMO_MAGHRIB_SECONDS || context.journeyStage !== simulationStage(seconds)) return state;
  const previous = validSimulation(state.fastingSimulation) ? state.fastingSimulation : undefined;
  if (previous && seconds < previous.secondsSinceMidnight) return state;
  if (previous?.secondsSinceMidnight === seconds) return state;
  const simulation = { version: 1 as const, secondsSinceMidnight: seconds, journeyStage: context.journeyStage };
  const phaseChanged = (previous?.journeyStage ?? "before_fajr") !== context.journeyStage;
  const phaseSteps = { before_fajr: "approaching_fajr", daytime: "fast_day", approaching_iftar: "approaching_iftar", iftar: "iftar" };
  const target = nodes.find((node) => node.id === phaseSteps[context.journeyStage] && node.journeyId === "first_fast");
  // Clock transitions change the lesson, never mark skipped lessons or worship complete.
  if (phaseChanged && target && state.stepId && state.stepId !== "fast_done" && state.stepId !== target.id) {
    return { ...state, fastingSimulation: simulation, stepId: target.id, stageId: target.stageId, stepHistory: [...state.stepHistory, state.stepId] };
  }
  return { ...state, fastingSimulation: simulation };
}

export function canNavigateFastingNext(stepId: string, targetId: string | undefined, context: FastingTimeContext): boolean {
  if (context.mode !== "simulation") return false;
  if (stepId === "approaching_fajr" && targetId === "fast_begin") return context.journeyStage !== "before_fajr";
  if (stepId === "fast_day" && targetId === "approaching_iftar") return ["approaching_iftar", "iftar"].includes(context.journeyStage);
  if (stepId === "approaching_iftar" && targetId === "iftar") return context.journeyStage === "iftar";
  return true;
}
