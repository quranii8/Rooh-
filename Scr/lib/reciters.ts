/** القراء المتاحون عبر EveryAyah.com */
export interface Reciter {
  id: string;
  name: string;
  country: string;
  style: string;
  bitrate: string;
}

export const RECITERS: Reciter[] = [
  { id: "Alafasy_128kbps",                       name: "مشاري راشد العفاسي",      country: "الكويت",     style: "مرتل",  bitrate: "128k" },
  { id: "Husary_128kbps",                        name: "محمود خليل الحصري",        country: "مصر",        style: "مرتل",  bitrate: "128k" },
  { id: "Husary_Muallim_128kbps",                name: "الحصري — المعلم",          country: "مصر",        style: "تعليمي", bitrate: "128k" },
  { id: "Abdul_Basit_Murattal_64kbps",           name: "عبد الباسط عبد الصمد",     country: "مصر",        style: "مرتل",  bitrate: "64k"  },
  { id: "Abdul_Basit_Mujawwad_128kbps",          name: "عبد الباسط — مجوّد",       country: "مصر",        style: "مجوّد",  bitrate: "128k" },
  { id: "Minshawi_Murattal_128kbps",             name: "محمد صديق المنشاوي",       country: "مصر",        style: "مرتل",  bitrate: "128k" },
  { id: "Minshawi_Mujawwad_64kbps",              name: "المنشاوي — مجوّد",         country: "مصر",        style: "مجوّد",  bitrate: "64k"  },
  { id: "Abdurrahmaan_As-Sudais_192kbps",        name: "عبد الرحمن السديس",        country: "السعودية",   style: "مرتل",  bitrate: "192k" },
  { id: "Saood_ash-Shuraym_128kbps",             name: "سعود الشريم",              country: "السعودية",   style: "مرتل",  bitrate: "128k" },
  { id: "Maher_AlMuaiqly_64kbps",                name: "ماهر المعيقلي",            country: "السعودية",   style: "مرتل",  bitrate: "64k"  },
  { id: "Hudhaify_128kbps",                      name: "علي بن عبد الرحمن الحذيفي", country: "السعودية",   style: "مرتل",  bitrate: "128k" },
  { id: "Ahmed_ibn_Ali_al-Ajamy_128kbps",        name: "أحمد بن علي العجمي",       country: "السعودية",   style: "مرتل",  bitrate: "128k" },
  { id: "Yasser_Ad-Dussary_128kbps",             name: "ياسر الدوسري",             country: "السعودية",   style: "مرتل",  bitrate: "128k" },
  { id: "Saad_al-Ghaamidi_40kbps",               name: "سعد الغامدي",              country: "السعودية",   style: "مرتل",  bitrate: "40k"  },
  { id: "Abu_Bakr_Ash-Shaatree_128kbps",         name: "أبو بكر الشاطري",          country: "السعودية",   style: "مرتل",  bitrate: "128k" },
  { id: "Mohammad_al_Tablaway_128kbps",          name: "محمد الطبلاوي",            country: "مصر",        style: "مرتل",  bitrate: "128k" },
  { id: "Hani_Rifai_192kbps",                    name: "هاني الرفاعي",             country: "السعودية",   style: "مرتل",  bitrate: "192k" },
  { id: "Khalifa_Taniji_64kbps",                 name: "خليفة الطنيجي",            country: "الإمارات",   style: "مرتل",  bitrate: "64k"  },
  { id: "Salaah_AbdulRahman_Bukhatir_128kbps",   name: "صلاح بوخاطر",              country: "الإمارات",   style: "مرتل",  bitrate: "128k" },
  { id: "Mishary_Rashid_al_Afasy_KFGQPC",        name: "العفاسي — مصحف المدينة",   country: "الكويت",     style: "مرتل",  bitrate: "—"    },
];

export const getReciter = (id: string): Reciter | undefined =>
  RECITERS.find((r) => r.id === id);

export const DEFAULT_RECITER_ID = "Alafasy_128kbps";
