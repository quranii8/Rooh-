"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { useAudioStore, AudioQueueItem } from "@/lib/audio-store";
import { useQuranStore } from "@/lib/store";
import { toArabicNum, getAyahAudioUrl } from "@/lib/utils";

interface Props {
  reciterId: string;
  reciterName: string;
}

export function ReciterPlaylist({ reciterId, reciterName }: Props) {
  const [q, setQ] = useState("");
  const setQueue = useAudioStore((s) => s.setQueue);
  const setReciterStore = useQuranStore((s) => s.setReciter);

  const filtered = q.trim()
    ? SURAHS.filter((s) => s.a.includes(q) || s.e.toLowerCase().includes(q.toLowerCase()))
    : SURAHS;

  const playSurah = (surahNum: number) => {
    setReciterStore(reciterId);
    const surah = SURAHS[surahNum - 1];
    // نضع الآية الأولى فقط للتشغيل السريع — يمكن لاحقاً جلب كل الآيات
    const queue: AudioQueueItem[] = Array.from({ length: surah.v }, (_, i) => ({
      surah: surahNum,
      verse: i + 1,
      url: getAyahAudioUrl(reciterId, surahNum, i + 1),
      title: `سورة ${surah.a} — آية ${toArabicNum(i + 1)}`,
      subtitle: reciterName,
    }));
    setQueue(queue, 0);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-bold">سور التلاوة</h2>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="بحث..."
          className="px-4 py-2 rounded-full text-sm outline-none border w-full sm:w-56"
          style={{ background: "var(--bg-soft)", borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map((s) => (
          <button
            key={s.n}
            onClick={() => playSurah(s.n)}
            className="flex items-center gap-3 p-3 rounded-xl text-right transition-all hover:bg-green-50 dark:hover:bg-green-900/20 group"
          >
            <div
              className="w-10 h-10 rounded-full grid place-items-center text-white shrink-0 transition-transform group-hover:scale-110"
              style={{ background: "var(--primary)" }}
            >
              <Play className="w-4 h-4 mr-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm flex items-center gap-2">
                <span style={{ color: "var(--text-muted)" }}>{toArabicNum(s.n)}.</span>
                <span className="font-quran text-base">{s.a}</span>
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {toArabicNum(s.v)} آية
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
