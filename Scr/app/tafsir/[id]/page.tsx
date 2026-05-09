import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TAFASIR, getTafsir } from "@/lib/tafasir";
import { TafsirBrowser } from "@/components/TafsirBrowser";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return TAFASIR.map((t) => ({ id: encodeURIComponent(t.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = getTafsir(decodeURIComponent(params.id));
  if (!t) return { title: "تفسير غير موجود" };
  return {
    title: t.name,
    description: t.description,
  };
}

export default function TafsirDetailPage({ params }: PageProps) {
  const tafsir = getTafsir(decodeURIComponent(params.id));
  if (!tafsir) return notFound();

  return (
    <article className="max-w-5xl mx-auto px-5 py-8">
      <Link href="/tafsir" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل التفاسير
      </Link>

      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: `linear-gradient(135deg, ${tafsir.color}, ${tafsir.color}cc)` }}
      >
        <div className="flex items-start gap-5 relative">
          <div
            className="w-20 h-20 rounded-2xl grid place-items-center text-5xl bg-white/15 backdrop-blur shrink-0"
          >
            {tafsir.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm opacity-90 mb-1">{tafsir.approach} • {tafsir.era}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-1">{tafsir.name}</h1>
            <div className="text-base opacity-90">{tafsir.author}</div>
          </div>
        </div>
        <p className="mt-5 text-base leading-relaxed opacity-95 relative">
          {tafsir.description}
        </p>
      </header>

      {/* تصفح التفسير */}
      <TafsirBrowser tafsirId={tafsir.id} tafsirColor={tafsir.color} />

      {/* روابط للتفاسير الأخرى */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">📚 تفاسير أخرى</h3>
        <div className="flex flex-wrap gap-2">
          {TAFASIR.filter((t) => t.id !== tafsir.id).map((t) => (
            <Link
              key={t.id}
              href={`/tafsir/${encodeURIComponent(t.id)}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all card !py-2 hover:-translate-y-0.5"
            >
              {t.icon} {t.shortName}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
