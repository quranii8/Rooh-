"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Play, Languages, Type, BookOpen } from "lucide-react";
import { Surah } from "@/lib/surahs";
import { useQuranStore } from "@/lib/store";
import { useAudioStore, AudioQueueItem } from "@/lib/audio-store";
import { toArabicNum, getAyahAudioUrl } from "@/lib/utils";
import { VerseModal } from "./VerseModal";

interface Verse {
  num: number;
  text: string;
  trans: string;
}

interface Props {
  surah: Surah;
  verses: Verse[];
  prev?: Surah;
  next?: Surah;
}

export function SurahReader({ surah, verses, prev, next }: Props) {
  const { fontSize, setFontSize, readMode, setReadMode, showTranslation, toggleTranslation, reciter } = useQuranStore();
  const { setLastRead, addToHistory, isBookmarked } = useQuranStore();
  const setQueue = useAudioStore((s) => s.setQueue);
  const [openVerse, setOpenVerse] = useState<number | null>(null);

  useEffect(() => {
    setLastRead(surah.n);
    addToHistory(surah.n);
  }, [surah.n, setLastRead, addToHistory]);

  const playSurah = (fromVerse: number = 1) => {
    const queue: AudioQueueItem[] = verses.map((v) => ({
      surah: surah.n,
      verse: v.num,
      url: getAyahAudioUrl(reciter, surah.n, v.num),
      title: `سورة ${surah.a} — آية ${toArabicNum(v.num)}`,
      subtitle: surah.e,
    }));
    const startIndex = Math.max(0, fromVerse - 1);
    setQueue(queue, startIndex);
  };

  const showBismillah = surah.n !== 1 && surah.n !== 9;

  return (
    <>
      <Link href="/surahs" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        قائمة السور
      </Link>

      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,169,81,.15), transparent 50%)",
          }}
        />
        <div className="relative">
          <div className="text-sm opacity-90">سورة</div>
          <h1 className="font-quran text-5xl md:text-6xl font-bold mt-1">{surah.a}</h1>
          <div className="opacity-90 mt-2 text-base">
            {surah.e} — <em>{surah.trans}</em>
          </div>
          <div className="inline-flex gap-3 mt-4 px-5 py-1.5 rounded-full text-sm bg-white/15 backdrop-blur">
            <span>{surah.t === "makki" ? "🕋 مكية" : "🕌 مدنية"}</span>
            <span>•</span>
            <span>{toArabicNum(surah.v)} آية</span>
            <span>•</span>
            <span>السورة {toArabicNum(surah.n)}</span>
          </div>
        </div>
      </header>

      {/* Reading Controls */}
      <div
        className="card p-3 mb-5 flex flex-wrap gap-2 items-center sticky top-[72px] z-30"
        style={{ backdropFilter: "blur(10px)", background: "var(--surface)" }}
      >
        <ControlGroup label="عرض">
          <button
            onClick={() => setReadMode("page")}
            className={`px-3 py-1.5 rounded-md text-sm transition ${readMode === "page" ? "text-white" : ""}`}
            style={{ background: readMode === "page" ? "var(--primary)" : "transparent", color: readMode === "page" ? "white" : "var(--text-muted)" }}
          >
            صفحة
          </button>
          <button
            onClick={() => setReadMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm transition`}
            style={{ background: readMode === "list" ? "var(--primary)" : "transparent", color: readMode === "list" ? "white" : "var(--text-muted)" }}
          >
            قائمة
          </button>
        </ControlGroup>

        <ControlGroup label={<><Type className="w-3.5 h-3.5 inline" /> الخط</>}>
          <input
            type="range"
            min="1.2"
            max="2.6"
            step="0.1"
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="w-24 accent-primary"
            style={{ accentColor: "var(--primary)" }}
          />
        </ControlGroup>

        <ControlGroup label={<><Languages className="w-3.5 h-3.5 inline" /> الترجمة</>}>
          <button
            onClick={toggleTranslation}
            className="px-3 py-1.5 rounded-md text-sm transition"
            style={{
              background: showTranslation ? "var(--primary)" : "transparent",
              color: showTranslation ? "white" : "var(--text-muted)",
            }}
          >
            {showTranslation ? "إخفاء" : "إظهار"}
          </button>
        </ControlGroup>

        <button
          onClick={() => playSurah()}
          className="btn btn-primary mr-auto !py-1.5 !px-4 !text-sm"
        >
          <Play className="w-4 h-4" />
          استمع للسورة
        </button>
      </div>

      {/* البسملة */}
      {showBismillah && (
        <div className="bismillah-decorated text-2xl md:text-3xl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* الآيات */}
      {verses.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <p style={{ color: "var(--text-muted)" }}>تعذّر تحميل الآيات. تحقق من الاتصال بالإنترنت.</p>
        </div>
      ) : (
        <div
          className="card p-6 md:p-10 font-quran text-justify"
          style={{
            fontSize: `${fontSize}rem`,
            lineHeight: 2.6,
          }}
        >
          {readMode === "list" ? (
            verses.map((v) => (
              <div
                key={v.num}
                id={`verse-${v.num}`}
                data-verse-key={`${surah.n}:${v.num}`}
                className="block mb-6 pb-5 border-b border-dashed cursor-pointer transition-colors rounded-lg p-2"
                style={{ borderColor: "var(--border)" }}
                onClick={() => setOpenVerse(v.num)}
              >
                <span className={isBookmarked(surah.n, v.num) ? "bg-amber-100/40 dark:bg-amber-900/20 rounded-md px-1" : ""}>
                  {v.text}
                  <span className="verse-end-mark">{toArabicNum(v.num)}</span>
                </span>
                {showTranslation && v.trans && (
                  <p
                    className="font-arabic text-sm mt-3 pr-3 border-r-[3px]"
                    style={{ color: "var(--text-muted)", borderColor: "var(--gold)", direction: "ltr", textAlign: "left", lineHeight: 1.7 }}
                  >
                    {v.trans}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div>
              {verses.map((v, i) => (
                <span
                  key={v.num}
                  id={`verse-${v.num}`}
                  data-verse-key={`${surah.n}:${v.num}`}
                  className={`cursor-pointer transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 ${isBookmarked(surah.n, v.num) ? "bg-amber-100/40 dark:bg-amber-900/20" : ""}`}
                  onClick={() => setOpenVerse(v.num)}
                >
                  {v.text}
                  <span className="verse-end-mark">{toArabicNum(v.num)}</span>
                  {i < verses.length - 1 ? " " : ""}
                </span>
              ))}
              {showTranslation && (
                <div className="mt-6 pt-6 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                  {verses.map((v) => (
                    <p
                      key={`t-${v.num}`}
                      className="font-arabic text-sm mb-2"
                      style={{ color: "var(--text-muted)", direction: "ltr", textAlign: "left", lineHeight: 1.7 }}
                    >
                      <strong style={{ color: "var(--gold-dark)" }}>{v.num}.</strong> {v.trans}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* تنقل */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {prev ? (
          <Link href={`/surah/${prev.n}`} className="card p-4 flex items-center gap-3 hover:border-green-600 transition">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابقة</small>
              <div className="font-bold">{prev.a}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/surah/${next.n}`} className="card p-4 flex items-center gap-3 justify-end text-right hover:border-green-600 transition">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالية</small>
              <div className="font-bold">{next.a}</div>
            </div>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : <div />}
      </div>

      {/* Modal */}
      {openVerse !== null && (
        <VerseModal
          surah={surah}
          verse={verses.find((v) => v.num === openVerse)!}
          onClose={() => setOpenVerse(null)}
          onPlay={() => {
            playSurah(openVerse);
            setOpenVerse(null);
          }}
        />
      )}
    </>
  );
}

function ControlGroup({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 border-l last:border-0" style={{ borderColor: "var(--border)" }}>
      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}:</span>
      {children}
    </div>
  );
}
