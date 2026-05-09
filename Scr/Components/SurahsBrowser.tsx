"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SURAHS } from "@/lib/surahs";
import { useQuranStore } from "@/lib/store";
import { toArabicNum } from "@/lib/utils";
import { Search } from "lucide-react";

type Filter = "all" | "makki" | "madani" | "bookmarked";

export function SurahsBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const bookmarks = useQuranStore((s) => s.bookmarks);

  const bookmarkedSurahs = useMemo(
    () => new Set(bookmarks.map((b) => b.surah)),
    [bookmarks]
  );

  const list = useMemo(() => {
    let arr = SURAHS;
    if (filter === "makki") arr = arr.filter((s) => s.t === "makki");
    else if (filter === "madani") arr = arr.filter((s) => s.t === "madani");
    else if (filter === "bookmarked") arr = arr.filter((s) => bookmarkedSurahs.has(s.n));

    if (q.trim()) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (s) => s.a.includes(q) || s.e.toLowerCase().includes(ql) || String(s.n) === q
      );
    }
    return arr;
  }, [filter, q, bookmarkedSurahs]);

  return (
    <>
      {/* فلاتر + بحث */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex flex-wrap gap-2 flex-1">
          {([
            ["all", "الكل"],
            ["makki", "🕋 المكية"],
            ["madani", "🕌 المدنية"],
            ["bookmarked", "★ المحفوظة"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as Filter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === key ? "var(--primary)" : "var(--surface)",
                color: filter === key ? "white" : "var(--text-muted)",
                border: `1px solid ${filter === key ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث في السور..."
            className="w-full py-2 pr-10 pl-4 rounded-full text-sm outline-none border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* عدد النتائج */}
      <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(list.length)} سورة
      </div>

      {/* الشبكة */}
      {list.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p style={{ color: "var(--text-muted)" }}>لا توجد سور مطابقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((s) => (
            <Link
              key={s.n}
              href={`/surah/${s.n}`}
              className="card p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md group"
              style={{ borderColor: bookmarkedSurahs.has(s.n) ? "var(--gold)" : undefined }}
            >
              {/* رقم السورة في نجمة */}
              <div
                className="w-12 h-12 grid place-items-center font-extrabold text-sm shrink-0 transition-transform group-hover:scale-110"
                style={{
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              >
                {toArabicNum(s.n)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-quran text-xl font-bold">{s.a}</span>
                  {bookmarkedSurahs.has(s.n) && <span style={{ color: "var(--gold)" }}>★</span>}
                </div>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <span>{s.e}</span>
                  <span>•</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      background: s.t === "makki" ? "rgba(234,142,0,.12)" : "rgba(0,102,179,.12)",
                      color: s.t === "makki" ? "#b97a00" : "#0066b3",
                    }}
                  >
                    {s.t === "makki" ? "مكية" : "مدنية"}
                  </span>
                  <span>{toArabicNum(s.v)} آية</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
