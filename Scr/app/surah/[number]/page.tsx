import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurah, SURAHS } from "@/lib/surahs";
import { getSurahMultiEdition } from "@/lib/quran-api";
import { stripBismillah, toArabicNum } from "@/lib/utils";
import { SurahReader } from "@/components/SurahReader";

interface PageProps {
  params: { number: string };
}

export async function generateStaticParams() {
  return SURAHS.map((s) => ({ number: String(s.n) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const num = parseInt(params.number);
  const s = getSurah(num);
  if (!s) return { title: "السورة غير موجودة" };
  return {
    title: `سورة ${s.a}`,
    description: `قراءة واستماع وتفسير سورة ${s.a} (${s.e}) — ${s.v} آية، ${s.t === "makki" ? "مكية" : "مدنية"}`,
    openGraph: {
      title: `سورة ${s.a} | منصة القرآن`,
      description: `${s.v} آية • ${s.t === "makki" ? "مكية" : "مدنية"}`,
    },
  };
}

export default async function SurahPage({ params }: PageProps) {
  const num = parseInt(params.number);
  const surah = getSurah(num);
  if (!surah) return notFound();

  // جلب النص العثماني + الترجمة الإنجليزية الافتراضية
  let verses: Array<{ num: number; text: string; trans: string }> = [];
  try {
    const editions = await getSurahMultiEdition(num, ["quran-uthmani", "en.sahih"]);
    const arData = editions[0];
    const enData = editions[1];

    verses = arData.ayahs.map((a, i) => ({
      num: a.numberInSurah,
      text: i === 0 ? stripBismillah(a.text, num) : a.text,
      trans: enData?.ayahs[i]?.text ?? "",
    }));
  } catch (err) {
    console.error("Failed to load surah:", err);
  }

  const prev = getSurah(num - 1);
  const next = getSurah(num + 1);

  return (
    <article className="max-w-5xl mx-auto px-5 py-6">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `سورة ${surah.a}`,
            description: `سورة ${surah.a} (${surah.e}) — ${surah.v} آية`,
            inLanguage: "ar",
          }),
        }}
      />

      <SurahReader surah={surah} verses={verses} prev={prev} next={next} />
    </article>
  );
}
