import type { MetadataRoute } from "next";
import { SURAHS } from "@/lib/surahs";
import { TAFASIR } from "@/lib/tafasir";
import { RECITERS } from "@/lib/reciters";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://quran.example.com";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, priority: 1, changeFrequency: "daily" },
    { url: `${base}/surahs`, lastModified: now, priority: 0.9 },
    { url: `${base}/tafsir`, lastModified: now, priority: 0.9 },
    { url: `${base}/reciters`, lastModified: now, priority: 0.8 },
    { url: `${base}/about`, lastModified: now, priority: 0.5 },
    ...SURAHS.map((s) => ({
      url: `${base}/surah/${s.n}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...TAFASIR.map((t) => ({
      url: `${base}/tafsir/${encodeURIComponent(t.id)}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...RECITERS.map((r) => ({
      url: `${base}/reciters/${encodeURIComponent(r.id)}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
