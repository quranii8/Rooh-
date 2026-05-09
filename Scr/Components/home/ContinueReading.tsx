"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

export function ContinueReading() {
  const lastRead = useQuranStore((s) => s.lastRead);
  const history = useQuranStore((s) => s.history);

  if (!lastRead && history.length === 0) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-7 rounded" style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }} />
        <h2 className="text-xl md:text-2xl font-extrabold">📚 تابع القراءة</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {lastRead && (() => {
          const s = getSurah(lastRead.surah);
          if (!s) return null;
          return (
            <Link
              href={`/surah/${s.n}${lastRead.verse ? `#verse-${lastRead.verse}` : ""}`}
              className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
              style={{ borderColor: "var(--primary)" }}
            >
              <div
                className="w-14 h-14 rounded-xl grid place-items-center text-white shrink-0"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
              >
                <Play className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--gold-dark)" }}>
                  آخر قراءة
                </div>
                <div className="font-bold truncate">سورة {s.a}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {lastRead.verse ? `الآية ${toArabicNum(lastRead.verse)}` : "البداية"}
                </div>
              </div>
            </Link>
          );
        })()}

        {history.slice(0, 3).filter(h => !lastRead || h.surah !== lastRead.surah).slice(0, 2).map((h) => {
          const s = getSurah(h.surah);
          if (!s) return null;
          return (
            <Link
              key={h.surah}
              href={`/surah/${s.n}`}
              className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
            >
              <div
                className="w-14 h-14 rounded-xl grid place-items-center font-bold text-lg shrink-0"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {toArabicNum(s.n)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-soft)" }}>
                  من السجل
                </div>
                <div className="font-bold truncate">سورة {s.a}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {toArabicNum(s.v)} آية
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
