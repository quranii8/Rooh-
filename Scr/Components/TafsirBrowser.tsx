"use client";

import { useState, useEffect } from "react";
import { SURAHS } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";
import Link from "next/link";

interface Props {
  tafsirId: string;
  tafsirColor: string;
}

export function TafsirBrowser({ tafsirId, tafsirColor }: Props) {
  const [surahNum, setSurahNum] = useState(1);
  const [verses, setVerses] = useState<Array<{ num: number; ar: string; tafsir: string }>>([]);
  const [loading, setLoading] = useState(true);

  const surah = SURAHS[surahNum - 1];

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setVerses([]);

    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${tafsirId}`).then((r) => r.json()),
    ])
      .then(([ar, tafsir]) => {
        if (cancel) return;
        const merged = ar.data.ayahs.map((a: any, i: number) => ({
          num: a.numberInSurah,
          ar: a.text,
          tafsir: tafsir?.data?.ayahs?.[i]?.text || "—",
        }));
        setVerses(merged);
      })
      .catch(() => {})
      .finally(() => !cancel && setLoading(false));

    return () => { cancel = true; };
  }, [surahNum, tafsirId]);

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b" style={{ borderColor: "var(--border)" }}>
        <label className="text-sm font-semibold">تصفّح التفسير حسب السورة:</label>
        <select
          value={surahNum}
          onChange={(e) => setSurahNum(parseInt(e.target.value))}
          className="px-4 py-2 rounded-lg text-sm font-medium outline-none"
          style={{ background: "var(--bg-soft)", border: `1px solid var(--border)`, color: "var(--text)" }}
        >
          {SURAHS.map((s) => (
            <option key={s.n} value={s.n}>
              {toArabicNum(s.n)}. {s.a} ({toArabicNum(s.v)} آية)
            </option>
          ))}
        </select>
        <Link
          href={`/surah/${surahNum}`}
          className="text-sm font-semibold mr-auto"
          style={{ color: tafsirColor }}
        >
          فتح السورة كاملة ←
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="skeleton h-8 w-2/3 mb-2" />
              <div className="skeleton h-4 w-full mb-1" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="font-quran text-2xl">{surah.a}</span>
            <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>
              ({toArabicNum(surah.v)} آية — {surah.t === "makki" ? "مكية" : "مدنية"})
            </span>
          </h2>

          {verses.slice(0, 30).map((v) => (
            <div
              key={v.num}
              className="pb-5 border-b last:border-0"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="w-7 h-7 grid place-items-center rounded-full text-xs font-bold shrink-0 mt-1"
                  style={{ background: `${tafsirColor}15`, color: tafsirColor }}
                >
                  {toArabicNum(v.num)}
                </span>
                <p className="font-quran text-xl md:text-2xl leading-loose flex-1">
                  {v.ar}
                </p>
              </div>
              <div
                className="text-sm md:text-base leading-relaxed pr-10"
                style={{ color: "var(--text-muted)" }}
              >
                {v.tafsir}
              </div>
            </div>
          ))}

          {verses.length > 30 && (
            <div className="text-center pt-4">
              <Link
                href={`/surah/${surahNum}`}
                className="btn btn-primary"
                style={{ background: tafsirColor }}
              >
                اقرأ السورة كاملة مع التفسير
              </Link>
              <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                عرض أول {toArabicNum(30)} آية فقط — يمكنك رؤية تفسير كل الآيات داخل صفحة السورة
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
