import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { RECITERS, getReciter } from "@/lib/reciters";
import { ReciterPlaylist } from "@/components/ReciterPlaylist";
import { ArrowRight, MapPin, Mic } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return RECITERS.map((r) => ({ id: encodeURIComponent(r.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const r = getReciter(decodeURIComponent(params.id));
  if (!r) return { title: "قارئ غير موجود" };
  return { title: r.name, description: `استمع لتلاوة الشيخ ${r.name} لجميع سور القرآن الكريم` };
}

export default function ReciterPage({ params }: PageProps) {
  const reciter = getReciter(decodeURIComponent(params.id));
  if (!reciter) return notFound();

  return (
    <article className="max-w-5xl mx-auto px-5 py-8">
      <Link href="/reciters" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل القراء
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
      >
        <div className="flex items-center gap-5 relative">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/15 backdrop-blur grid place-items-center text-5xl font-extrabold">
            {reciter.name.trim().charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{reciter.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm opacity-95">
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{reciter.country}</span>
              <span className="inline-flex items-center gap-1"><Mic className="w-4 h-4" />{reciter.style}</span>
              <span className="px-2 py-0.5 rounded bg-white/20">{reciter.bitrate}</span>
            </div>
          </div>
        </div>
      </header>

      <ReciterPlaylist reciterId={reciter.id} reciterName={reciter.name} />
    </article>
  );
}
