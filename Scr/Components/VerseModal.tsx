"use client";

import { useEffect, useState } from "react";
import { X, Play, Bookmark, Copy, Share2, BookOpen, GitCompare, Languages } from "lucide-react";
import { Surah } from "@/lib/surahs";
import { useQuranStore } from "@/lib/store";
import { TAFASIR, TRANSLATIONS } from "@/lib/tafasir";
import { toArabicNum } from "@/lib/utils";
import Link from "next/link";

interface Verse {
  num: number;
  text: string;
  trans: string;
}

interface Props {
  surah: Surah;
  verse: Verse;
  onClose: () => void;
  onPlay: () => void;
}

type Tab = "tafsir" | "compare" | "translations";

export function VerseModal({ surah, verse, onClose, onPlay }: Props) {
  const { selectedTafsir, setTafsir, isBookmarked, toggleBookmark } = useQuranStore();
  const [tab, setTab] = useState<Tab>("tafsir");
  const [tafsirText, setTafsirText] = useState<string>("");
  const [tafsirLoading, setTafsirLoading] = useState(true);
  const [compareData, setCompareData] = useState<Array<{ id: string; text: string }>>([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [translationsData, setTranslationsData] = useState<Array<{ id: string; text: string }>>([]);
  const [transLoading, setTransLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const bookmarked = isBookmarked(surah.n, verse.num);
  const reference = `${surah.a} : ${toArabicNum(verse.num)}`;

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // تحميل التفسير الحالي
  useEffect(() => {
    if (tab !== "tafsir") return;
    let cancel = false;
    setTafsirLoading(true);
    fetch(`https://api.alquran.cloud/v1/ayah/${surah.n}:${verse.num}/${selectedTafsir}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        setTafsirText(d?.data?.text || "تعذّر تحميل التفسير.");
      })
      .catch(() => !cancel && setTafsirText("تعذّر تحميل التفسير."))
      .finally(() => !cancel && setTafsirLoading(false));
    return () => { cancel = true; };
  }, [tab, surah.n, verse.num, selectedTafsir]);

  // تحميل مقارنة التفاسير
  useEffect(() => {
    if (tab !== "compare") return;
    let cancel = false;
    setCompareLoading(true);
    const editions = TAFASIR.map((t) => t.id).join(",");
    fetch(`https://api.alquran.cloud/v1/ayah/${surah.n}:${verse.num}/editions/${editions}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        const arr = (d?.data || []).map((x: any) => ({
          id: x.edition.identifier,
          text: x.text,
        }));
        setCompareData(arr);
      })
      .catch(() => !cancel && setCompareData([]))
      .finally(() => !cancel && setCompareLoading(false));
    return () => { cancel = true; };
  }, [tab, surah.n, verse.num]);

  // تحميل الترجمات
  useEffect(() => {
    if (tab !== "translations") return;
    let cancel = false;
    setTransLoading(true);
    const editions = TRANSLATIONS.map((t) => t.id).join(",");
    fetch(`https://api.alquran.cloud/v1/ayah/${surah.n}:${verse.num}/editions/${editions}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        const arr = (d?.data || []).map((x: any) => ({
          id: x.edition.identifier,
          text: x.text,
        }));
        setTranslationsData(arr);
      })
      .catch(() => !cancel && setTranslationsData([]))
      .finally(() => !cancel && setTransLoading(false));
    return () => { cancel = true; };
  }, [tab, surah.n, verse.num]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleBookmark = () => {
    const added = toggleBookmark({
      surah: surah.n,
      verse: verse.num,
      text: verse.text,
      reference,
    });
    showToast(added ? "✦ تم الحفظ" : "تمت الإزالة من المحفوظات");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${verse.text}\n\n﴿ ${reference} ﴾`);
    showToast("تم النسخ ✓");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: reference, text: `${verse.text}\n\n﴿ ${reference} ﴾` });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${verse.text}\n﴿ ${reference} ﴾\n${location.href}`);
      showToast("تم نسخ الآية للمشاركة");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
        style={{ background: "var(--bg-elev)", boxShadow: "0 20px 50px rgba(0,0,0,.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--primary)" }}>
              سورة {surah.a}
            </h3>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              الآية {toArabicNum(verse.num)} من {toArabicNum(surah.v)}
            </div>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* نص الآية */}
          <div
            className="font-quran text-2xl md:text-3xl leading-[2.4] text-center p-6 m-4 rounded-2xl"
            style={{ background: "var(--bg-soft)" }}
          >
            {verse.text}
            <span className="verse-end-mark">{toArabicNum(verse.num)}</span>
          </div>

          {/* أزرار سريعة */}
          <div className="grid grid-cols-4 gap-2 px-4 mb-4">
            <ActionBtn icon={<Play className="w-4 h-4" />} label="استماع" onClick={onPlay} />
            <ActionBtn
              icon={<Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />}
              label={bookmarked ? "محفوظة ★" : "حفظ"}
              onClick={handleBookmark}
              active={bookmarked}
            />
            <ActionBtn icon={<Copy className="w-4 h-4" />} label="نسخ" onClick={handleCopy} />
            <ActionBtn icon={<Share2 className="w-4 h-4" />} label="مشاركة" onClick={handleShare} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 border-b" style={{ borderColor: "var(--border)" }}>
            <TabBtn active={tab === "tafsir"} onClick={() => setTab("tafsir")} icon={<BookOpen className="w-4 h-4" />}>
              التفسير
            </TabBtn>
            <TabBtn active={tab === "compare"} onClick={() => setTab("compare")} icon={<GitCompare className="w-4 h-4" />}>
              مقارنة التفاسير
            </TabBtn>
            <TabBtn active={tab === "translations"} onClick={() => setTab("translations")} icon={<Languages className="w-4 h-4" />}>
              الترجمات
            </TabBtn>
          </div>

          {/* Tab content */}
          <div className="p-4">
            {tab === "tafsir" && (
              <div>
                {/* اختيار التفسير */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {TAFASIR.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTafsir(t.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: selectedTafsir === t.id ? t.color : "var(--surface)",
                        color: selectedTafsir === t.id ? "white" : "var(--text-muted)",
                        border: `1px solid ${selectedTafsir === t.id ? t.color : "var(--border)"}`,
                      }}
                    >
                      {t.icon} {t.shortName}
                    </button>
                  ))}
                </div>

                <TafsirCard
                  loading={tafsirLoading}
                  text={tafsirText}
                  tafsirId={selectedTafsir}
                />
              </div>
            )}

            {tab === "compare" && (
              <div className="space-y-3">
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  مقارنة بين {toArabicNum(TAFASIR.length)} تفاسير معتمدة
                </div>
                {compareLoading ? (
                  <div className="text-center py-10">
                    <div className="spinner mx-auto" />
                  </div>
                ) : (
                  TAFASIR.map((t) => {
                    const item = compareData.find((c) => c.id === t.id);
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl"
                        style={{ background: "var(--bg-soft)", borderRight: `4px solid ${t.color}` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{t.icon}</span>
                          <div className="font-bold text-sm" style={{ color: t.color }}>{t.shortName}</div>
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.era}</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {item?.text || "—"}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {tab === "translations" && (
              <div className="space-y-3">
                {transLoading ? (
                  <div className="text-center py-10"><div className="spinner mx-auto" /></div>
                ) : (
                  TRANSLATIONS.map((t) => {
                    const item = translationsData.find((x) => x.id === t.id);
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl"
                        style={{ background: "var(--bg-soft)", borderRight: "3px solid var(--primary)" }}
                      >
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                          <span className="text-base">{t.flag}</span>
                          {t.language} — {t.name}
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ direction: t.direction, textAlign: t.direction === "rtl" ? "right" : "left" }}
                        >
                          {item?.text || "—"}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-32 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg z-[110] animate-slide-up"
          style={{ background: "var(--primary)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all"
      style={{
        background: active ? "var(--primary-soft)" : "var(--surface)",
        border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
        color: active ? "var(--primary)" : "var(--text-muted)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all border-b-2 -mb-px"
      style={{
        color: active ? "var(--primary)" : "var(--text-muted)",
        borderColor: active ? "var(--primary)" : "transparent",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

function TafsirCard({ loading, text, tafsirId }: { loading: boolean; text: string; tafsirId: string }) {
  const tafsir = TAFASIR.find((t) => t.id === tafsirId);
  if (!tafsir) return null;

  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: "var(--bg-soft)", borderRight: `4px solid ${tafsir.color}` }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-2xl">{tafsir.icon}</span>
        <div>
          <div className="font-bold" style={{ color: tafsir.color }}>{tafsir.name}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{tafsir.author}</div>
        </div>
        <Link
          href={`/tafsir/${encodeURIComponent(tafsir.id)}`}
          className="mr-auto text-xs font-semibold"
          style={{ color: tafsir.color }}
        >
          عن هذا التفسير ←
        </Link>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-4/6" />
        </div>
      ) : (
        <p className="text-sm md:text-base leading-loose">{text}</p>
      )}
    </div>
  );
}
