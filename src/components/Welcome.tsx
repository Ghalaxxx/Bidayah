import { ArrowRight, Sparkles } from "lucide-react";
import reference from "../../photo_2026-10-04_18-58-01.jpg";
import type { Lang } from "../domain/content";

export function Welcome({ lang, onBegin, onResume }: { lang: Lang; onBegin: () => void; onResume: () => void }) {
  return <section className="welcome" aria-label={lang === "ar" ? "أهلًا بك في بداية" : "Welcome to Bidayah"}>
    <div className="welcome-art" aria-hidden="true"><img src={reference} alt="" /></div>
    <div className="welcome-content">
      <p className="welcome-eyebrow"><Sparkles size={12} />{lang === "ar" ? "بدايتك، بوضوح وطمأنينة" : "YOUR BEGINNING, MADE CLEAR"}</p>
      <h1>{lang === "ar" ? <>أول خطوة إلى الإسلام،<br />بلطف وطمأنينة.</> : <>A gentle first step into<br />Islam.</>}</h1>
      <p className="welcome-description">{lang === "ar" ? "تعلّم ما تحتاجه، خطوة هادئة وعملية في كل مرة. بلا ضغط أو ارتباك." : "Learn what matters, one calm and practical step at a time. No pressure. No overwhelm."}</p>
      <button className="welcome-primary" onClick={onBegin}>{lang === "ar" ? "أبدأ رحلتي" : "Begin my journey"}<ArrowRight size={17} /></button>
      <button className="welcome-resume" onClick={onResume}>{lang === "ar" ? "بدأت رحلتي من قبل" : "I've already started"}</button>
      <div className="welcome-pagination" aria-hidden="true"><span className="active" /><span /><span /></div>
    </div>
  </section>;
}

export function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><img src={reference} alt="" /></span>;
}
