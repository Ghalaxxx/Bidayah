import type { Step } from "./content";

export const prayerUnitCounts: Record<string, number> = { fajr: 2, dhuhr: 4, asr: 4, maghrib: 3, isha: 4 };

// Paragraphs 12-14 explicitly repeat the movements and distinguish later recitation.
export function buildPrayerSequence(templates: Step[], prayer: unknown): Step[] {
  const count = typeof prayer === "string" ? prayerUnitCounts[prayer] ?? 2 : 2;
  const byId = new Map(templates.map((step) => [step.id, step]));
  const sequence: Step[] = [];
  const append = (templateId: string, unit: number, suffix = "") => {
    const template = byId.get(templateId)!;
    const node: Step = { ...template, id: `unit_${unit}_${templateId}${suffix}`, templateId, unitNumber: unit, totalUnits: count, next: undefined };
    sequence.push(node);
    return node;
  };
  append("prayer_takbir", 1);
  for (let unit = 1; unit <= count; unit++) {
    const standing = append("prayer_stand", unit);
    if (unit > 1) standing.instruction = unit === 2
      ? { ar: "في الركعة الثانية تقرأ الفاتحة وما تيسر من القرآن، ثم تراجع الحركات نفسها بالترتيب.", en: "In the second unit, recite Al-Fatihah and further Quran, then review the same movements in order." }
      : { ar: "في هذه الركعة يوضح المصدر قراءة الفاتحة، ثم يتكرر ترتيب الركوع والسجود.", en: "In this later unit, the source describes Al-Fatihah, then the repeated bowing and prostration sequence." };
    for (const movement of ["prayer_ruku", "prayer_rise", "prayer_sujud", "prayer_sit", "prayer_second_sujud"]) append(movement, unit);
    if (unit === 2 || unit === count) {
      const tashahhud = append("prayer_tashahhud", unit);
      if (unit > 2) {
        tashahhud.title = { ar: "التشهد الأخير", en: "Final Tashahhud" };
        tashahhud.instruction = { ar: "بعد السجدة الثانية من آخر ركعة، يكون الجلوس الأخير للتشهد، ثم الصلاة على النبي والدعاء قبل التسليم.", en: "After the second prostration of the last unit comes the final sitting for Tashahhud, then the blessing on the Prophet and supplication before Taslim." };
      }
      if (unit === count) {
        const blessing = append("prayer_later_units", unit, "_final");
        blessing.title = { ar: "الجلوس الأخير والصلاة على النبي", en: "Final sitting and blessing on the Prophet" };
        blessing.instruction = { ar: "بعد التشهد في الجلوس الأخير، راجع الصلاة على النبي والدعاء قبل التسليم كما يوضحهما المصدر.", en: "After Tashahhud in the final sitting, review the blessing on the Prophet and supplication before Taslim, as described in the source." };
        append("prayer_final_dua", unit);
      }
    }
  }
  append("prayer_taslim", count);
  sequence.forEach((node, index) => { node.next = sequence[index + 1]?.id ?? "learning_ready"; });
  const nodes = templates.map((step) => step.id === "pre_prayer_review" ? { ...step, next: sequence[0].id } : step);
  return [...nodes, ...sequence];
}
