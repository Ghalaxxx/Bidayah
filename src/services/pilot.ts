export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type SimulatedDirection = { bearingDegrees: number; simulated: true };
export interface QiblahDirectionService { getDirection(): SimulatedDirection }
export interface PrayerTimesService { getTimes(): { simulated: true; times: Record<PrayerName, string> } }

export class SimulatedQiblahDirectionService implements QiblahDirectionService {
  getDirection(): SimulatedDirection { return { bearingDegrees: 250, simulated: true }; }
}

export class SimulatedPrayerTimesService implements PrayerTimesService {
  getTimes() {
    return { simulated: true as const, times: { fajr: "05:00", dhuhr: "12:15", asr: "15:30", maghrib: "18:00", isha: "19:30" } };
  }
}

export const qiblahService: QiblahDirectionService = new SimulatedQiblahDirectionService();
export const prayerTimesService: PrayerTimesService = new SimulatedPrayerTimesService();
