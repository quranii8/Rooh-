/** قائمة التفاسير المتاحة عبر AlQuran.cloud API
 * كل تفسير له identifier فريد + معلومات للعرض
 * المصدر: https://api.alquran.cloud/v1/edition?format=text&type=tafsir
 */

export interface Tafsir {
  id: string;          // identifier في API
  name: string;        // اسم التفسير بالعربية
  author: string;      // المؤلف
  shortName: string;   // اسم مختصر للعرض
  description: string; // وصف موجز
  era: string;         // العصر / القرن
  approach: string;    // المنهج (سلفي، صوفي، عقلي، ميسر…)
  color: string;       // لون مميز للواجهة
  icon: string;        // emoji
}

export const TAFASIR: Tafsir[] = [
  {
    id: "ar.muyassar",
    name: "التفسير الميسّر",
    author: "نخبة من العلماء — مجمع الملك فهد",
    shortName: "الميسّر",
    description: "تفسير ميسّر بأسلوب سهل وواضح، يبيّن المعنى الإجمالي للآية. مثالي للمبتدئين والقارئ العادي.",
    era: "معاصر (1430هـ)",
    approach: "ميسّر",
    color: "#16a34a",
    icon: "✨",
  },
  {
    id: "ar.jalalayn",
    name: "تفسير الجلالين",
    author: "جلال الدين المحلي وجلال الدين السيوطي",
    shortName: "الجلالين",
    description: "تفسير مختصر شهير، يجمع بين الإيجاز والشمول. بدأه المحلي (ت 864هـ) وأكمله السيوطي (ت 911هـ).",
    era: "القرن 9هـ",
    approach: "مختصر بالمأثور",
    color: "#0ea5e9",
    icon: "📜",
  },
  {
    id: "ar.qurtubi",
    name: "تفسير القرطبي",
    author: "أبو عبد الله محمد بن أحمد القرطبي (ت 671هـ)",
    shortName: "القرطبي",
    description: "الجامع لأحكام القرآن. تفسير موسوعي يهتم بالأحكام الفقهية واللغة وأسباب النزول.",
    era: "القرن 7هـ",
    approach: "فقهي شامل",
    color: "#8b5cf6",
    icon: "⚖️",
  },
  {
    id: "ar.tabari",
    name: "تفسير الطبري",
    author: "أبو جعفر محمد بن جرير الطبري (ت 310هـ)",
    shortName: "الطبري",
    description: "جامع البيان عن تأويل آي القرآن. أقدم وأشمل التفاسير بالمأثور، مرجع رئيسي لمن جاء بعده.",
    era: "القرن 4هـ",
    approach: "بالمأثور (موسوعي)",
    color: "#dc2626",
    icon: "📚",
  },
  {
    id: "ar.baghawi",
    name: "تفسير البغوي",
    author: "أبو محمد الحسين بن مسعود البغوي (ت 516هـ)",
    shortName: "البغوي",
    description: "معالم التنزيل. تفسير معتدل بالمأثور مختصر من الثعلبي، يجمع بين الرواية والدراية.",
    era: "القرن 6هـ",
    approach: "بالمأثور (معتدل)",
    color: "#ea580c",
    icon: "🌿",
  },
  {
    id: "ar.ibnkatheer",
    name: "تفسير ابن كثير",
    author: "أبو الفداء إسماعيل بن عمر بن كثير (ت 774هـ)",
    shortName: "ابن كثير",
    description: "تفسير القرآن العظيم. من أعظم تفاسير المأثور، يعتمد القرآن والسنة وأقوال السلف.",
    era: "القرن 8هـ",
    approach: "بالمأثور (السلفي)",
    color: "#0d9488",
    icon: "🕌",
  },
  {
    id: "ar.waseet",
    name: "التفسير الوسيط",
    author: "د. محمد سيد طنطاوي",
    shortName: "الوسيط",
    description: "تفسير معاصر متوسط الحجم، يعرض المعاني بأسلوب سلس مع التعليق على القضايا المعاصرة.",
    era: "معاصر",
    approach: "معاصر متوسط",
    color: "#7c3aed",
    icon: "📖",
  },
  {
    id: "ar.miqbas",
    name: "تنوير المقباس",
    author: "ينسب لابن عباس رضي الله عنه — جمع الفيروزآبادي",
    shortName: "ابن عباس",
    description: "تنوير المقباس من تفسير ابن عباس. تفسير مختصر جداً بأسلوب رمزي بليغ.",
    era: "القرن 1هـ (الجمع: 9هـ)",
    approach: "بالمأثور (مختصر)",
    color: "#be185d",
    icon: "💎",
  },
];

export const getTafsir = (id: string): Tafsir | undefined =>
  TAFASIR.find((t) => t.id === id);

export const DEFAULT_TAFSIR_ID = "ar.muyassar";

/** الترجمات المتاحة */
export interface Translation {
  id: string;
  language: string;
  name: string;
  flag: string;
  direction: "rtl" | "ltr";
}

export const TRANSLATIONS: Translation[] = [
  { id: "en.sahih",      language: "English",    name: "Sahih International", flag: "🇸🇦", direction: "ltr" },
  { id: "en.pickthall",  language: "English",    name: "Pickthall",           flag: "🇬🇧", direction: "ltr" },
  { id: "en.yusufali",   language: "English",    name: "Yusuf Ali",           flag: "🇬🇧", direction: "ltr" },
  { id: "fr.hamidullah", language: "Français",   name: "Hamidullah",          flag: "🇫🇷", direction: "ltr" },
  { id: "tr.diyanet",    language: "Türkçe",     name: "Diyanet İşleri",      flag: "🇹🇷", direction: "ltr" },
  { id: "ur.jalandhry",  language: "اردو",        name: "جالندہری",            flag: "🇵🇰", direction: "rtl" },
  { id: "id.indonesian", language: "Indonesia",  name: "Bahasa Indonesia",    flag: "🇮🇩", direction: "ltr" },
  { id: "es.cortes",     language: "Español",    name: "Julio Cortés",        flag: "🇪🇸", direction: "ltr" },
  { id: "ru.kuliev",     language: "Русский",    name: "Эльмир Кулиев",       flag: "🇷🇺", direction: "ltr" },
  { id: "de.aburida",    language: "Deutsch",    name: "Abu Rida",            flag: "🇩🇪", direction: "ltr" },
];
