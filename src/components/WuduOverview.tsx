import { Images } from "lucide-react";
import type { Lang, Step } from "../domain/content";
import { wuduVisuals } from "../domain/media";
import { InstructionalVisual } from "./InstructionalVisual";

export function WuduOverview({ lang, steps }: { lang: Lang; steps: Step[] }) {
  return <details className="wudu-overview">
    <summary><Images size={17} aria-hidden="true" />{lang === "ar" ? "شاهد الوضوء كاملًا" : "See the complete Wudu sequence"}</summary>
    <ol>{wuduVisuals.map((asset, index) => {
      const lesson = steps.find((step) => step.id === asset.id)!;
      return <li key={asset.id}><p className="visual-step-number">{lang === "ar" ? `الخطوة ${index + 1} من ${wuduVisuals.length}` : `Step ${index + 1} of ${wuduVisuals.length}`}</p><h2>{lesson.title[lang]}</h2><InstructionalVisual asset={asset} lang={lang} /><p>{lesson.instruction[lang]}</p></li>;
    })}</ol>
  </details>;
}
