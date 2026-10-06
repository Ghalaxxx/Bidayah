export type ExperienceMode = "PREPARE_TO_PERFORM" | "LEARN";
export type JourneyNode = {
  id: string;
  journeyId: string;
  stageId: string;
  next?: string;
  options?: { value: string; next?: string }[];
};

export function journeyEntry(journeyId: string, nodes: JourneyNode[]) {
  const stepId = journeyId === "first_prayer" ? "prayer_intro" : journeyId === "first_fast" ? "fast_intro" : undefined;
  const node = nodes.find((item) => item.id === stepId && item.journeyId === journeyId);
  return node ? { mode: "LEARN" as const, stepId: node.id, stageId: node.stageId } : undefined;
}

export function transitionTarget(
  node: JourneyNode,
  nodes: JourneyNode[],
  requested?: string,
): JourneyNode | undefined {
  const targetId = requested ?? node.next;
  const allowed = [node.next, ...(node.options ?? []).map((option) => option.next)];
  if (!targetId || !allowed.includes(targetId)) return undefined;
  return nodes.find((target) => target.id === targetId && target.journeyId === node.journeyId);
}

export function isPhoneAside(stepId?: string): boolean {
  return stepId === "phone_aside_start";
}

export function canReview(stepId?: string): boolean {
  return !isPhoneAside(stepId) && stepId !== "prayer_done";
}

export function restoreSession<T extends { stepId?: string; mode?: ExperienceMode }>(
  serialized: string | null,
  initial: T,
  nodes: JourneyNode[],
): T {
  if (!serialized) return initial;
  try {
    const saved = JSON.parse(serialized);
    if (!saved || saved.version !== 2 || !Array.isArray(saved.stepHistory) || !Array.isArray(saved.completedSteps)) return initial;
    if (saved.mode && !["LEARN", "PREPARE_TO_PERFORM"].includes(saved.mode)) return initial;
    const entry = journeyEntry(saved.journeyId, nodes);
    if (entry) {
      const removedEntry = !saved.stepId || ["mode_selection", "choose_mode", "prayer_mode_selection", "fast_mode_selection"].includes(saved.stepId);
      const node = removedEntry ? nodes.find((item) => item.id === entry.stepId) : nodes.find((item) => item.id === saved.stepId && item.journeyId === saved.journeyId);
      if (!node) return initial;
      const validId = (id: unknown) => typeof id === "string" && nodes.some((item) => item.id === id && item.journeyId === saved.journeyId);
      return { ...initial, ...saved, mode: entry.mode, stepId: node.id, stageId: node.stageId, stepHistory: removedEntry ? [] : saved.stepHistory.filter(validId), completedSteps: saved.completedSteps.filter(validId) };
    }
    if (saved.stepId && !nodes.some((node) => node.id === saved.stepId && node.journeyId === saved.journeyId)) return initial;
    return { ...initial, ...saved };
  } catch {
    return initial;
  }
}
