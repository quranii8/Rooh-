"use client";

import Link from "next/link";
import { Trash2, BookOpen } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

export function BookmarksList() {
  const bookmarks = useQuranStore((s) => s.bookmarks);
  const removeBookmark = useQuranStore((s) => s.removeBookmark);

  if (bookmarks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-lg font-bold mb-2">لا توجد آيات محفوظة بعد</h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          اضغط على أي آية أثناء القراءة ثم اختر &quot;حفظ&quot; لتظهر هنا.
        </p>
        <Link href="/surahs" className="btn btn-primary">
          <BookOpen className="w-4 h-4" />
          ابدأ القراءة
        </Link>
      </div>
    );
  }

  // ترتيب حسب تاريخ الإضافة الأحدث
  const sorted = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(bookmarks.length)} آية محفوظة
      </div>

      <div className="space-y-3">
        {sorted.map((b) => {
          const surah = getSurah(b.surah);
          if (!surah) return null;
          return (
            <div
              key={`${b.surah}:${b.verse}`}
              className="card p-5"
              style={{ borderRight: "4px solid var(--gold)" }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <Link
                    href={`/surah/${b.surah}#verse-${b.verse}`}
                    className="font-bold text-base hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    سورة {surah.a} — الآية {toArabicNum(b.verse)}
                  </Link>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {new Date(b.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
                <button
                  onClick={() => removeBookmark(b.surah, b.verse)}
                  className="icon-btn"
                  aria-label="حذف"
                  title="حذف من المحفوظات"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Link
                href={`/surah/${b.surah}#verse-${b.verse}`}
                className="block font-quran text-xl md:text-2xl leading-loose hover:opacity-80 transition-opacity"
              >
                {b.text}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
