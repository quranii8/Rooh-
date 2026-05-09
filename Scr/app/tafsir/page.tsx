import type { Metadata } from "next";
import Link from "next/link";
import { TAFASIR } from "@/lib/tafasir";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "التفاسير المعتمدة",
  description: "8 تفاسير معتمدة للقرآن الكريم: الميسر، الجلالين، القرطبي، الطبري، البغوي، ابن كثير، الوسيط، تنوير المقباس",
};

export default function TafsirPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-1.5 h-8 rounded" style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }} />
        <h1 className="text-2xl md:text-3xl font-extrabold">📚 التفاسير المعتمدة</h1>
      </div>
      <p className="mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
        مجموعة منتقاة من أعظم تفاسير القرآن الكريم عبر التاريخ الإسلامي — من تفاسير المأثور للسلف، إلى التفاسير المعاصرة الميسّرة. اختر تفسيراً للتعرف عليه أكثر، أو استخدم خاصية <strong style={{ color: "var(--primary)" }}>المقارنة</strong> داخل أي آية لرؤية كل التفاسير جنباً إلى جنب.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TAFASIR.map((t) => (
          <Link
            key={t.id}
            href={`/tafsir/${encodeURIComponent(t.id)}`}
            className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
            style={{ borderRight: `4px solid ${t.color}` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl grid place-items-center text-3xl shrink-0 transition-transform group-hover:scale-110"
                style={{ background: `${t.color}15`, color: t.color }}
              >
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg mb-0.5">{t.name}</h2>
                <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  {t.author}
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                  {t.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: `${t.color}15`, color: t.color }}
                  >
                    {t.approach}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-soft)" }}>
                    {t.era}
                  </span>
                  <span
                    className="mr-auto text-sm font-semibold flex items-center gap-1"
                    style={{ color: t.color }}
                  >
                    استكشاف
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
