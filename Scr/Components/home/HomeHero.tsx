"use client";

import Link from "next/link";
import { Play, Headphones, BookOpen } from "lucide-react";
import { SearchBar } from "../SearchBar";

export function HomeHero() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 pt-12 pb-8 text-center">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
        style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "var(--primary)" }}
          />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--primary)" }} />
        </span>
        منصة متكاملة للقرآن الكريم
      </div>

      <h1
        className="font-extrabold leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--primary), var(--gold-dark))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        رحلتك مع كتاب الله تبدأ هنا
      </h1>

      <p
        className="max-w-2xl mx-auto text-base md:text-lg mb-7"
        style={{ color: "var(--text-muted)" }}
      >
        اقرأ القرآن الكريم بالخط العثماني، استمع لأشهر القراء، اطلع على{" "}
        <strong style={{ color: "var(--primary)" }}>8 تفاسير معتمدة</strong>،
        وترجمات بـ <strong style={{ color: "var(--primary)" }}>10 لغات</strong> — كل ذلك في مكان واحد.
      </p>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/surah/1" className="btn btn-primary">
          <Play className="w-4 h-4" />
          ابدأ القراءة
        </Link>
        <Link href="/reciters" className="btn btn-outline">
          <Headphones className="w-4 h-4" />
          استمع الآن
        </Link>
        <Link href="/tafsir" className="btn btn-outline">
          <BookOpen className="w-4 h-4" />
          استكشف التفاسير
        </Link>
      </div>
    </section>
  );
}
