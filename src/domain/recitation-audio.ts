import type { Recitation } from "./prayer";

export type RecitationAudioAsset = {
  id: string;
  phrase: string;
  sourceId: string;
  url: string;
  sha256: string;
  pronunciationReview: { status: "approved" | "needs_review"; reviewer?: string; date?: string };
  rights: { status: "cleared" | "unknown"; evidence?: string };
  transliteration?: { text: string; reviewStatus: "approved" | "needs_review" };
  meaning?: { text: string; reviewStatus: "approved" | "needs_review" };
};
export function audioMatchesPhrase(asset: RecitationAudioAsset, recitation: Recitation): boolean {
  return asset?.id === recitation.id && asset?.phrase === recitation.arabic && asset?.sourceId === recitation.sourceId;
}
export function publishableAudio(asset: RecitationAudioAsset): boolean {
  return asset?.pronunciationReview?.status === "approved" && typeof asset.pronunciationReview.reviewer === "string" && Boolean(asset.pronunciationReview.reviewer.trim())
    && typeof asset.pronunciationReview.date === "string" && Boolean(asset.pronunciationReview.date) && asset.rights?.status === "cleared" && typeof asset.rights.evidence === "string" && Boolean(asset.rights.evidence.trim())
    && /^[a-f0-9]{64}$/.test(asset.sha256) && /^\/media\/audio\/[a-z_]+\.mp3$/.test(asset.url);
}
export function audioForRecitation(recitation: Recitation, assets: RecitationAudioAsset[]): RecitationAudioAsset | undefined {
  return assets.find((asset) => audioMatchesPhrase(asset, recitation) && publishableAudio(asset));
}
