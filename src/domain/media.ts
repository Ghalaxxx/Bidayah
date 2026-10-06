import type { Lang } from "./content";

export type InstructionalVisual = {
  id: string;
  src: string;
  cell: number;
  sourceId: string;
  locator: string;
  alt: Record<Lang, string>;
  origin: "original_generated";
  framing?: "upper_body";
};
const wudu = (id: string, cell: number, locator: string, ar: string, en: string): InstructionalVisual => ({ id, cell, locator, src: "/media/wudu-atlas.png", sourceId: "prh_wudu_001", alt: { ar, en }, origin: "original_generated" });
export const wuduVisuals = [
  wudu("wudu_hands", 0, "video 0-17s", "غسل الكفين بالماء", "Washing both hands with water"),
  wudu("wudu_mouth", 1, "video 17-43s", "أخذ الماء بالكف إلى الفم للمضمضة", "Bringing water in a cupped hand to rinse the mouth"),
  wudu("wudu_nose", 2, "video 17-43s", "أخذ الماء إلى الأنف ثم إخراجه", "Drawing water into the nose and expelling it"),
  wudu("wudu_face", 3, "video 48-78s", "غسل الوجه من منابت الشعر إلى الذقن", "Washing the face from the hairline to the chin"),
  wudu("wudu_right_arm", 4, "video 86-100s", "غسل الذراع مع المرفق؛ ابدأ باليمنى", "Washing the forearm and elbow; start with the right"),
  wudu("wudu_left_arm", 5, "video 86-100s", "غسل الذراع الأخرى مع المرفق", "Washing the other forearm including its elbow"),
  wudu("wudu_head", 6, "video 100-128s", "مسح الرأس باليدين المبتلتين من الأمام للخلف والعودة", "Wiping the head front to back and returning with wet hands"),
  wudu("wudu_ears", 7, "video 128-153s", "مسح داخل الأذن بالسبابة وخارجها بالإبهام", "Wiping inside the ear with the index finger and outside with the thumb"),
  wudu("wudu_feet", 8, "video 153-182s", "غسل القدمين والكعبين والعقبين وبين الأصابع", "Washing feet, ankles, heels and between the toes"),
];
const prayer = (id: string, cell: number, locator: string, ar: string, en: string): InstructionalVisual => ({ id, cell, locator, src: "/media/prayer-atlas-v2.png", sourceId: "prh_prayer_binbaz_001", alt: { ar, en }, origin: "original_generated" });
export const prayerVisuals = [
  prayer("prayer_takbir", 0, "paragraphs 3-4", "القيام ورفع اليدين عند التكبير", "Standing and raising the hands for Takbir"),
  prayer("prayer_stand", 1, "paragraphs 5-6", "القيام واليد اليمنى فوق اليسرى على الصدر", "Standing with the right hand over the left on the chest"),
  prayer("prayer_ruku", 2, "paragraph 7", "الركوع واليدان على الركبتين والرأس بمحاذاة الظهر", "Bowing with hands on knees and head aligned with the back"),
  prayer("prayer_rise", 3, "paragraph 8", "العودة للوقوف بعد الركوع ورفع اليدين ثم وضعهما على الصدر", "Rising from bowing, raising the hands then placing them on the chest"),
  prayer("prayer_sujud", 4, "paragraph 9", "السجود والجبهة والأنف على الأرض والمرفقان مرفوعان", "Prostration with forehead and nose on the ground and elbows raised"),
  prayer("prayer_sit", 5, "paragraph 10", "الجلوس بين السجدتين واليدان على الفخذين", "Sitting between prostrations with hands resting on the thighs"),
  prayer("prayer_second_sujud", 4, "paragraph 11", "السجدة الثانية، مثل السجدة الأولى", "Second prostration, performed like the first"),
  prayer("prayer_tashahhud", 6, "paragraph 13", "الجلوس للتشهد مع اليد على الفخذ والإشارة بالسبابة", "Sitting for Tashahhud with the hand on the thigh and index finger extended"),
  prayer("prayer_later_units", 6, "paragraphs 13-14", "الجلوس الأخير للتشهد والصلاة على النبي", "Final sitting for Tashahhud and blessing on the Prophet"),
  prayer("prayer_final_dua", 6, "paragraph 13", "الدعاء في الجلوس الأخير قبل التسليم", "Supplication in the final sitting before Taslim"),
  prayer("prayer_taslim", 8, "paragraph 13", "التسليم بتحريك الرأس إلى اليمين ثم اليسار", "Taslim by turning the head right, then left"),
];
export function visualForPrayer(stepId: string, unit?: number, total?: number): InstructionalVisual | undefined {
  const visual = prayerVisuals.find((item) => item.id === stepId);
  const finalSitting = ["prayer_tashahhud", "prayer_later_units", "prayer_final_dua", "prayer_taslim"].includes(stepId);
  if (visual && finalSitting && total && total > 2 && unit === total && stepId !== "prayer_taslim") {
    return { ...visual, cell: 7, locator: "paragraph 14; final sitting in three/four-unit prayer", alt: { ar: "التورك في الجلوس الأخير للصلاة ذات ثلاث أو أربع ركعات", en: "Tawarruk in the final sitting of a three- or four-unit prayer" } };
  }
  return visual?.id === "prayer_taslim" ? { ...visual, framing: "upper_body" } : visual;
}
