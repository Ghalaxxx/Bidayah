export type Recitation = {
  id: string;
  arabic: string;
  sourceId: "prh_prayer_binbaz_001";
  locator: string;
  transliterationStatus: "NEEDS_REVIEW";
  audioStatus: "NEEDS_REVIEW";
};
export type PrayerMovement = {
  stepId: string;
  position: { ar: string; en: string };
  recitation?: Recitation;
  sourceId: "prh_prayer_binbaz_001";
  locator: string;
};
const recitation = (id: string, arabic: string, locator: string): Recitation => ({ id, arabic, locator, sourceId: "prh_prayer_binbaz_001", transliterationStatus: "NEEDS_REVIEW", audioStatus: "NEEDS_REVIEW" });
export const prayerMovements: PrayerMovement[] = [
  { stepId: "prayer_final_dua", position: { ar: "راجع هذه العبارة في الجلوس الأخير قبل التسليم.", en: "Review this phrase for the final sitting before Taslim." }, recitation: recitation("final_dua", "اللهم إني أعوذ بك من عذاب جهنم، ومن عذاب القبر، ومن فتنة المحيا والممات، ومن شر فتنة المسيح الدجال", "paragraph 13"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 13" },
  { stepId: "prayer_takbir", position: { ar: "في بداية الصلاة يكون المصلي قائمًا، ويرفع يديه عند التكبير إلى حذو الكتفين أو الأذنين.", en: "At the beginning, the person stands and raises the hands to shoulder or ear level with the opening Takbir." }, recitation: recitation("takbir", "الله أكبر", "paragraphs 3-4"), sourceId: "prh_prayer_binbaz_001", locator: "paragraphs 3-4" },
  { stepId: "prayer_stand", position: { ar: "في القيام توضع اليد اليمنى على اليسرى على الصدر. يوضح المصدر دعاء الاستفتاح ثم الاستعاذة والبسملة والفاتحة وما تيسر من القرآن.", en: "When standing, the right hand is placed over the left on the chest. The source describes an opening supplication, seeking refuge, Basmala, Al-Fatihah and further Quran recitation." }, sourceId: "prh_prayer_binbaz_001", locator: "paragraphs 5-6" },
  { stepId: "prayer_ruku", position: { ar: "الركوع انحناء مع وضع اليدين على الركبتين، وجعل الرأس بمحاذاة الظهر، والطمأنينة في الحركة.", en: "Bowing involves hands on the knees, the head aligned with the back, and settling calmly in the position." }, recitation: recitation("ruku", "سبحان ربي العظيم", "paragraph 7"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 7" },
  { stepId: "prayer_rise", position: { ar: "بعد الركوع يعود المصلي إلى الوقوف ويطمئن. يوضح المصدر أن الإمام والمنفرد يقولان عند الرفع: سمع الله لمن حمده، ثم الثناء عند القيام.", en: "After bowing, the person returns to standing and settles. The source specifies the rising phrase for an imam or someone praying alone, followed by praise when standing." }, recitation: recitation("rise", "سمع الله لمن حمده\nربنا ولك الحمد", "paragraph 8; standing praise has a longer source form"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 8" },
  { stepId: "prayer_sujud", position: { ar: "السجود على الجبهة مع الأنف، واليدين، والركبتين، وبطون أصابع القدمين. توجَّه أصابع اليدين والقدمين نحو القبلة.", en: "Prostration is on the forehead with the nose, hands, knees and undersides of the toes, with fingers and toes toward Qiblah." }, recitation: recitation("sujud", "سبحان ربي الأعلى", "paragraph 9"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 9" },
  { stepId: "prayer_sit", position: { ar: "بين السجدتين يجلس المصلي على قدمه اليسرى مع نصب اليمنى، ويضع يديه على فخذيه وركبتيه ويطمئن في الجلوس.", en: "Between prostrations, the person sits on the left foot with the right upright, hands on thighs and knees, and settles calmly." }, recitation: recitation("sitting", "رب اغفر لي وارحمني واهدني وارزقني وعافني واجبرني", "paragraph 10"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 10" },
  { stepId: "prayer_second_sujud", position: { ar: "بعد الجلوس تأتي السجدة الثانية، وتؤدى كما في السجدة الأولى. هاتان السجدتان داخل ركعة واحدة.", en: "After sitting comes a second prostration performed as the first. Both prostrations belong to one unit." }, recitation: recitation("second_sujud", "سبحان ربي الأعلى", "paragraph 11"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 11" },
  { stepId: "prayer_tashahhud", position: { ar: "التشهد ذكر يُقرأ في الجلوس بعد الركعة الثانية؛ راجع النص قبل الصلاة.", en: "Tashahhud is recited sitting after the second unit; review the text before prayer." }, recitation: recitation("tashahhud", "التحيات لله والصلوات والطيبات، السلام عليك أيها النبي ورحمة الله وبركاته، السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله وأشهد أن محمدًا عبده ورسوله", "paragraph 13"), sourceId: "prh_prayer_binbaz_001", locator: "paragraphs 13-14" },
  { stepId: "prayer_later_units", position: { ar: "بعد الركعات الباقية يكون الجلوس الأخير، والتشهد والصلاة على النبي، ثم الدعاء كما يوضح المصدر قبل التسليم.", en: "After the remaining units comes the final sitting, Tashahhud, blessing on the Prophet, and supplication as described in the source, before Taslim." }, recitation: recitation("blessing", "اللهم صل على محمد وعلى آل محمد، كما صليت على إبراهيم وعلى آل إبراهيم؛ إنك حميد مجيد، وبارك على محمد وعلى آل محمد، كما باركت على إبراهيم وعلى آل إبراهيم؛ إنك حميد مجيد", "paragraph 13; final sitting"), sourceId: "prh_prayer_binbaz_001", locator: "paragraphs 13-14" },
  { stepId: "prayer_taslim", position: { ar: "تختتم الصلاة بالتسليم إلى اليمين ثم إلى اليسار، بالعبارة نفسها في كل جهة.", en: "Prayer closes with Taslim to the right then the left, using the same greeting on each side." }, recitation: recitation("taslim", "السلام عليكم ورحمة الله", "paragraph 13"), sourceId: "prh_prayer_binbaz_001", locator: "paragraph 13" },
];
