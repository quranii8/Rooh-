import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** دمج classes مع tailwind-merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تحويل الأرقام إلى عربية (٠١٢٣٤٥٦٧٨٩) */
export function toArabicNum(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

/** تنسيق الوقت بصيغة m:ss */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** بناء URL لملف صوتي من EveryAyah */
export function getAyahAudioUrl(reciter: string, surah: number, ayah: number): string {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
}

/** debounce */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** إزالة البسملة من بداية أول آية (لكل السور عدا الفاتحة والتوبة) */
export function stripBismillah(text: string, surahNum: number): string {
  if (surahNum === 1 || surahNum === 9) return text;
  return text.replace(/^بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ\s*/, "");
}
