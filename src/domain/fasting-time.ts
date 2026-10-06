export type FastingClockStage = "before_fajr" | "daytime" | "approaching_iftar" | "iftar";
export type FastingTimeContext = {
  mode: "simulation" | "real";
  target: "fajr" | "maghrib";
  targetTime: string;
  remainingTime: number;
  journeyStage: FastingClockStage;
  isAuthoritativeTime: boolean;
  labelAr: string;
  labelEn: string;
};
export type FastingSimulationState = {
  version: 1;
  secondsSinceMidnight: number;
  journeyStage: FastingClockStage;
};
export const DEMO_FAJR_SECONDS = 5 * 60 * 60;
export const DEMO_MAGHRIB_SECONDS = 18 * 60 * 60;
export const DEMO_APPROACHING_SECONDS = DEMO_MAGHRIB_SECONDS - 5 * 60;
export const DEMO_START_SECONDS = DEMO_FAJR_SECONDS - 15 * 60;

export function simulationStage(seconds: number): FastingClockStage {
  if (seconds < DEMO_FAJR_SECONDS) return "before_fajr";
  if (seconds < DEMO_APPROACHING_SECONDS) return "daytime";
  if (seconds < DEMO_MAGHRIB_SECONDS) return "approaching_iftar";
  return "iftar";
}
export function validSimulation(value: unknown): value is FastingSimulationState {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<FastingSimulationState>;
  return data.version === 1 && Number.isInteger(data.secondsSinceMidnight)
    && data.secondsSinceMidnight! >= 0 && data.secondsSinceMidnight! <= DEMO_MAGHRIB_SECONDS
    && data.journeyStage === simulationStage(data.secondsSinceMidnight!);
}
export function simulatedTimeContext(seconds: number): FastingTimeContext {
  const beforeFajr = seconds < DEMO_FAJR_SECONDS;
  return {
    mode: "simulation", target: beforeFajr ? "fajr" : "maghrib",
    targetTime: beforeFajr ? "05:00" : "18:00",
    remainingTime: Math.max(0, Math.ceil((beforeFajr ? DEMO_FAJR_SECONDS : DEMO_MAGHRIB_SECONDS) - seconds)),
    journeyStage: simulationStage(seconds), isAuthoritativeTime: false,
    labelAr: beforeFajr ? "متبقي على بدء الصيام" : "متبقي على الإفطار",
    labelEn: beforeFajr ? "Until fasting begins" : "Until Iftar",
  };
}
export function formatRemainingTime(seconds: number): string {
  const remaining = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60]
    .map((part) => String(part).padStart(2, "0")).join(":");
}
