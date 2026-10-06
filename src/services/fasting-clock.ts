import {
  DEMO_APPROACHING_SECONDS, DEMO_FAJR_SECONDS, DEMO_MAGHRIB_SECONDS,
  DEMO_START_SECONDS, simulatedTimeContext,
  type FastingTimeContext,
} from "../domain/fasting-time";

export interface FastingClockProvider {
  getSnapshot(): FastingTimeContext;
  subscribe(listener: () => void): () => void;
}
export type FastingDemoAction = "fajr" | "approaching_maghrib" | "maghrib";

// The clock never consults a timezone, GPS, system date, or religious time API.
export class SimulatedFastingClockProvider implements FastingClockProvider {
  private seconds: number;
  private anchor: number;
  private listeners = new Set<() => void>();
  private timer?: ReturnType<typeof setInterval>;
  private snapshot: FastingTimeContext;
  private now: () => number;

  constructor(seconds = DEMO_START_SECONDS, now = () => performance.now()) {
    this.now = now;
    this.seconds = Number.isFinite(seconds) ? Math.max(0, Math.min(DEMO_MAGHRIB_SECONDS, Math.floor(seconds))) : DEMO_START_SECONDS;
    this.anchor = now();
    this.snapshot = simulatedTimeContext(this.seconds);
  }
  getSeconds(): number {
    const elapsed = this.timer ? Math.max(0, Math.floor((this.now() - this.anchor) / 1000)) : 0;
    return Math.min(DEMO_MAGHRIB_SECONDS, this.seconds + elapsed);
  }
  getSnapshot = (): FastingTimeContext => {
    const next = simulatedTimeContext(this.getSeconds());
    if (next.remainingTime !== this.snapshot.remainingTime || next.journeyStage !== this.snapshot.journeyStage) this.snapshot = next;
    return this.snapshot;
  };
  private notify = () => { this.getSnapshot(); this.listeners.forEach((listener) => listener()); };
  subscribe = (listener: () => void) => {
    if (!this.listeners.size) {
      this.anchor = this.now();
      this.timer = setInterval(this.notify, 1000);
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size) {
        this.seconds = this.getSeconds();
        clearInterval(this.timer); this.timer = undefined;
        this.getSnapshot();
      }
    };
  };
  reset() {
    this.seconds = DEMO_START_SECONDS; this.anchor = this.now(); this.notify();
  }
  simulate(action: FastingDemoAction) {
    const target = { fajr: DEMO_FAJR_SECONDS, approaching_maghrib: DEMO_APPROACHING_SECONDS, maghrib: DEMO_MAGHRIB_SECONDS }[action];
    this.seconds = Math.max(this.getSeconds(), target); this.anchor = this.now(); this.notify();
  }
}
