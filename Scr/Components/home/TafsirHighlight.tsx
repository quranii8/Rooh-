import Link from "next/link";
import { TAFASIR } from "@/lib/tafasir";
import { ChevronLeft } from "lucide-react";

export function TafsirHighlight() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-7 rounded"
            style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }}
          />
          <h2 className="text-xl md:text-2xl font-extrabold">📚 ٨ تفاسير معتمدة بين يديك</h2>
        </div>
        <Link
          href="/tafsir"
          className="text-sm font-semibold flex items-center gap-1 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          استعرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <p className="mb-5 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
        من تفسير الطبري الموسوعي مروراً بابن كثير والقرطبي، وصولاً للتفسير الميسّر المعاصر — قارن بين التفاسير لتدبّر أعمق.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TAFASIR.map((t) => (
          <Link
            key={t.id}
            href={`/tafsir/${encodeURIComponent(t.id)}`}
            className="card p-5 transition-all hover:-translate-y-1 hover:shadow-lg group"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <div
              className="w-12 h-12 rounded-xl grid place-items-center text-2xl mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${t.color}15`, color: t.color }}
            >
              {t.icon}
            </div>
            <div className="font-bold text-base mb-1">{t.shortName}</div>
            <div className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
              {t.era}
            </div>
            <div
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: `${t.color}15`, color: t.color }}
            >
              {t.approach}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
