import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Repeat } from "lucide-react";
import type { Lang } from "../domain/content";
import type { Recitation } from "../domain/prayer";
import { audioForRecitation, audioMatchesPhrase, type RecitationAudioAsset } from "../domain/recitation-audio";

export function RecitationPlayer({ recitation, lang, internalReviewAsset }: { recitation: Recitation; lang: Lang; internalReviewAsset?: RecitationAudioAsset }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [assets, setAssets] = useState<RecitationAudioAsset[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState(false);
  const ar = lang === "ar";
  useEffect(() => {
    let active = true;
    fetch("/data/media/audio.json").then((response) => response.ok ? response.json() : []).then((rows) => { if (active && Array.isArray(rows)) setAssets(rows); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const asset = audioForRecitation(recitation, assets) ?? (import.meta.env.DEV && internalReviewAsset && audioMatchesPhrase(internalReviewAsset, recitation) ? internalReviewAsset : undefined);
  useEffect(() => {
    const element = audio.current;
    return () => { element?.pause(); };
  }, [asset?.url]);
  async function play(restart = false) {
    if (!audio.current) return;
    if (restart) audio.current.currentTime = 0;
    setError(false);
    try { await audio.current.play(); } catch { setError(true); setPlaying(false); }
  }
  return <section className="recitation-player" aria-label={ar ? "ما يقال" : "Recitation"} data-recitation-id={recitation.id}>
    <h2>{ar ? "ما يقال" : "What to say"}</h2>
    <p className="recitation-text" lang="ar" dir="rtl">{recitation.arabic}</p>
    {asset && <>
      <audio ref={audio} src={asset.url} preload="metadata" loop={loop} onPlay={() => { document.querySelectorAll<HTMLAudioElement>("audio").forEach((other) => { if (other !== audio.current) other.pause(); }); setPlaying(true); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setError(true); setPlaying(false); }} />
      <div className="recitation-controls">
        <button type="button" onClick={() => playing ? audio.current?.pause() : void play()}>{playing ? <Pause size={17} /> : <Play size={17} />}{playing ? (ar ? "إيقاف مؤقت" : "Pause") : (ar ? "استمع" : "Listen")}</button>
        <button type="button" onClick={() => void play(true)}><RotateCcw size={17} />{ar ? "أعد الاستماع" : "Play again"}</button>
        <button type="button" aria-pressed={loop} title={ar ? "تكرار التسجيل" : "Loop recording"} aria-label={ar ? "تكرار التسجيل" : "Loop recording"} onClick={() => setLoop(!loop)}><Repeat size={17} /></button>
      </div>
      {error && <p className="audio-error" role="status">{ar ? "تعذر تشغيل التسجيل. حاول مجددًا." : "The recording could not play. Try again."}</p>}
      {asset.transliteration?.reviewStatus === "approved" && <p dir="ltr">{asset.transliteration.text}</p>}
      {asset.meaning?.reviewStatus === "approved" && <p>{asset.meaning.text}</p>}
    </>}
  </section>;
}
