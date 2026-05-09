import { getAyah } from "@/lib/quran-api";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";
import Link from "next/link";

const VERSE_POOL = [
  "2:255", "59:22", "59:23", "1:1", "94:5", "65:3",
  "13:28", "2:286", "3:8", "112:1", "55:13", "39:53",
  "2:152", "94:6", "3:185", "65:2", "8:46",
];

async function loadDailyVerse() {
  const seed = Math.floor(Date.now() / 86400000);
  const verseId = VERSE_POOL[seed % VERSE_POOL.length];
  const [s, v] = verseId.split(":").map(Number);

  try {
    const [ar, en] = await Promise.all([
      getAyah(s, v, "quran-uthmani"),
      getAyah(s, v, "en.sahih"),
    ]);
    const surah = getSurah(s)!;
    return { ar: ar.text, en: en.text, surah, verseNum: v };
  } catch {
    return null;
  }
}

export async function DailyVerse() {
  const data = await loadDailyVerse();

  return (
    <section className="relative max-w-5xl mx-auto px-5">
      <div
        className="card relative overflow-hidden p-8 md:p-12"
        style={{ borderRadius: "28px" }}
      >
        {/* زخارف خلفية */}
        <div
          className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-10 pointer-events-none"
          style={{ background: "var(--gold)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full opacity-10 pointer-events-none"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative">
          <div
            className="inline-flex items-center gap-1.5 text-sm font-bold mb-4"
            style={{ color: "var(--gold-dark)" }}
          >
            ✦ آية اليوم
          </div>

          {data ? (
            <>
              <p
                className="font-quran text-2xl md:text-4xl leading-[2.2] mb-5"
                style={{ color: "var(--text)" }}
              >
                {data.ar}
              </p>
              <div className="text-sm md:text-base mb-4" style={{ color: "var(--text-muted)" }}>
                📖 سورة <strong>{data.surah.a}</strong> — الآية {toArabicNum(data.verseNum)}
              </div>
              <div
                className="pt-4 border-t border-dashed text-sm md:text-base italic leading-relaxed"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                &ldquo;{data.en}&rdquo;
              </div>

              <Link
                href={`/surah/${data.surah.n}#verse-${data.verseNum}`}
                className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition-colors"
                style={{ color: "var(--primary)" }}
              >
                اقرأ السورة كاملة ←
              </Link>
            </>
          ) : (
            <p className="font-quran text-3xl text-center" style={{ color: "var(--primary)" }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
