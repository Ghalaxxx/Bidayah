import { FlaskConical, Moon, Sunrise } from "lucide-react";
import { formatRemainingTime, type FastingTimeContext as TimeContext } from "../domain/fasting-time";
import type { Lang } from "../domain/content";
import type { FastingDemoAction } from "../services/fasting-clock";

export type FastingTimeContextProps = TimeContext & {
  language: Lang;
  showDemoControls?: boolean;
  onSimulate?: (action: FastingDemoAction) => void;
};
export function FastingTimeContext({ language, showDemoControls = false, onSimulate, ...context }: FastingTimeContextProps) {
  const ar = language === "ar";
  const simulated = context.mode === "simulation";
  const notice = simulated ? (ar ? "وقت تجريبي للعرض" : "Demo time only") : context.isAuthoritativeTime ? (ar ? "وقت موثّق" : "Verified time") : (ar ? "وقت غير متحقق منه" : "Unverified time");
  const phaseLabels = { before_fajr: { ar: "قبل الفجر", en: "Before dawn" }, daytime: { ar: "خلال النهار", en: "During the day" }, approaching_iftar: { ar: "قرب الإفطار", en: "Approaching Iftar" }, iftar: { ar: "مراجعة الإفطار", en: "Iftar review" } };
  const timeReached = simulated && context.journeyStage === "iftar";
  return <section className="fasting-time-context" aria-label={ar ? "توقيت رحلة الصيام" : "Fasting time context"} data-mode={context.mode} data-authoritative={context.isAuthoritativeTime} data-stage={context.journeyStage}>
    <div className="fasting-time-top"><span>{simulated ? (ar ? "محاكاة يوم الصيام" : "Fasting-day simulation") : (ar ? "توقيت الصيام" : "Fasting time")}</span>{context.target === "fajr" ? <Sunrise size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}</div>
    <p className="fasting-time-label">{ar ? context.labelAr : context.labelEn}</p>
    <time className="fasting-countdown" role="timer" aria-live="off" aria-label={ar ? "الوقت المتبقي" : "Time remaining"} dateTime={`PT${Math.max(0, context.remainingTime)}S`} dir="ltr">{formatRemainingTime(context.remainingTime)}</time>
    <div className="fasting-time-target"><span>{context.target === "fajr" ? (ar ? "الفجر" : "Fajr") : (ar ? "المغرب" : "Maghrib")}</span><span dir="ltr">{context.targetTime}</span></div>
    <p className="fasting-time-notice"><FlaskConical size={13} aria-hidden="true" />{notice}</p>
    <p className="fasting-time-phase" aria-live="polite">{phaseLabels[context.journeyStage][language]}{timeReached && <span>{ar ? "في المحاكاة وصلنا إلى وقت الإفطار" : "In the simulation, we have reached Iftar time"}</span>}</p>
    {simulated && <p className="fasting-time-safety">{ar ? "المحاكاة لا تثبت دخول الفجر أو غروب الشمس في مكانك." : "This simulation does not confirm real dawn or sunset where you are."}</p>}
    {showDemoControls && simulated && onSimulate && <details className="fasting-demo-controls">
      <summary>{ar ? "أدوات محاكاة العرض" : "Demo simulation controls"}</summary>
      <div>
        <button type="button" disabled={context.journeyStage !== "before_fajr"} onClick={() => onSimulate("fajr")}>{ar ? "محاكاة الفجر" : "Simulate Fajr"}</button>
        <button type="button" disabled={["approaching_iftar", "iftar"].includes(context.journeyStage)} onClick={() => onSimulate("approaching_maghrib")}>{ar ? "محاكاة قرب المغرب" : "Simulate approaching Maghrib"}</button>
        <button type="button" disabled={context.journeyStage === "iftar"} onClick={() => onSimulate("maghrib")}>{ar ? "محاكاة المغرب" : "Simulate Maghrib"}</button>
      </div>
    </details>}
  </section>;
}
