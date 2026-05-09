import type { Metadata } from "next";
import Link from "next/link";
import { RECITERS } from "@/lib/reciters";
import { Mic, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "القراء",
  description: "أكثر من 20 قارئاً من أشهر قراء العالم الإسلامي",
};

export default function RecitersPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-1.5 h-8 rounded" style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }} />
        <h1 className="text-2xl md:text-3xl font-extrabold">🎙️ القراء</h1>
      </div>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        {RECITERS.length} قارئاً من أشهر قراء العالم الإسلامي. اختر قارئاً للاستماع لتلاوته في أي سورة.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECITERS.map((r) => (
          <Link
            key={r.id}
            href={`/reciters/${encodeURIComponent(r.id)}`}
            className="card p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className="w-16 h-16 rounded-full grid place-items-center text-2xl font-extrabold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--gold))" }}
            >
              {r.name.trim().charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1">{r.name}</h3>
              <div className="text-xs flex items-center gap-3" style={{ color: "var(--text-muted)" }}>
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{r.country}</span>
                <span className="inline-flex items-center gap-1"><Mic className="w-3 h-3" />{r.style}</span>
              </div>
              <div
                className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {r.bitrate}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
