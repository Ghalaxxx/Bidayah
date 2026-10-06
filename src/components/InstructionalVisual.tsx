import type { InstructionalVisual as VisualAsset } from "../domain/media";
import type { Lang } from "../domain/content";

export function InstructionalVisual({ asset, lang }: { asset: VisualAsset; lang: Lang }) {
  const column = asset.cell % 3;
  const row = Math.floor(asset.cell / 3);
  return <figure className="instructional-visual" data-visual-id={asset.id} data-visual-cell={asset.cell}>
    <div className={`visual-window${asset.framing === "upper_body" ? " upper-body" : ""}`} dir="ltr">
      <img src={asset.src} alt={asset.alt[lang]} width={1536} height={1536} decoding="async" style={{ transform: `translate(${-column * 100 / 3}%, ${-row * 100 / 3}%)` }} />
    </div>
    <figcaption>{asset.alt[lang]}</figcaption>
  </figure>;
}
