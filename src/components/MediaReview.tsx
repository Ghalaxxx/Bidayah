import { useEffect, useState } from "react";
import { prayerMovements } from "../domain/prayer";
import type { RecitationAudioAsset } from "../domain/recitation-audio";
import { RecitationPlayer } from "./RecitationPlayer";

export function MediaReview() {
  const [assets, setAssets] = useState<RecitationAudioAsset[]>([]);
  useEffect(() => {
    let active = true;
    fetch("/api/media-review/manifest").then((response) => response.ok ? response.json() : []).then((rows) => { if (active && Array.isArray(rows)) setAssets(rows); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return <main className="shell" dir="rtl"><section className="journey"><h1>لوحة مراجعة داخلية</h1><p>تسجيلات مرشحة للمقارنة، ليست معتمدة للنشر أو تعليم المستخدم. لا يمنح الناشر ترخيص إعادة استخدامها؛ لا تُنشر قبل إذن الحقوق ومراجعة النطق وحدود القص.</p>{assets.map((asset) => {
    const recitation = prayerMovements.find((movement) => movement.recitation?.id === asset.id)?.recitation;
    return recitation && <section key={asset.id} className="info-detail"><h2>{asset.id}</h2><RecitationPlayer recitation={recitation} lang="ar" internalReviewAsset={asset} /></section>;
  })}<a href="/">العودة إلى بداية</a></section></main>;
}
