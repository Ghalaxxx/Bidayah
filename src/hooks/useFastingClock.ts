import { useCallback, useSyncExternalStore } from "react";
import type { FastingClockProvider } from "../services/fasting-clock";
import type { FastingTimeContext } from "../domain/fasting-time";

export function useFastingClock(provider: FastingClockProvider, enabled: boolean, onTimeChange: (context: FastingTimeContext, phaseChanged: boolean) => void) {
  const subscribe = useCallback((notify: () => void) => {
    if (!enabled) return () => {};
    let lastPhase = provider.getSnapshot().journeyStage;
    const unsubscribe = provider.subscribe(() => {
      const context = provider.getSnapshot();
      onTimeChange(context, lastPhase !== context.journeyStage);
      lastPhase = context.journeyStage;
      notify();
    });
    onTimeChange(provider.getSnapshot(), false);
    return unsubscribe;
  }, [provider, enabled, onTimeChange]);
  const getSnapshot = useCallback(() => provider.getSnapshot(), [provider]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
