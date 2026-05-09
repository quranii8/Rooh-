"use client";

import { useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { useAudioStore } from "@/lib/audio-store";
import { useQuranStore } from "@/lib/store";
import { RECITERS } from "@/lib/reciters";
import { formatTime } from "@/lib/utils";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { queue, index, isPlaying, isVisible, currentTime, duration } = useAudioStore();
  const { setPlaying, setProgress, next, close } = useAudioStore();
  const reciter = useQuranStore((s) => s.reciter);
  const setReciter = useQuranStore((s) => s.setReciter);

  const current = queue[index];

  // Sync isPlaying state -> audio element
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.src !== current.url) {
      a.src = current.url;
    }
    if (isPlaying) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [isPlaying, current, setPlaying]);

  // Highlight verse in DOM (best-effort)
  useEffect(() => {
    if (!current) return;
    document.querySelectorAll(".verse-playing").forEach((el) => el.classList.remove("verse-playing"));
    const el = document.querySelector(`[data-verse-key="${current.surah}:${current.verse}"]`);
    if (el) {
      el.classList.add("verse-playing");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current]);

  if (!isVisible || !current) return null;

  const reciterInfo = RECITERS.find((r) => r.id === reciter);
  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(a.currentTime, a.duration || 0);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          if (index < queue.length - 1) next();
          else setPlaying(false);
        }}
        onError={() => setPlaying(false)}
      />

      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t no-print animate-slide-up"
        style={{
          background: "var(--bg-elev)",
          borderColor: "var(--border)",
          boxShadow: "0 -8px 24px rgba(0,0,0,.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{current.title}</div>
            <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {current.subtitle || reciterInfo?.name}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              className="icon-btn"
              onClick={() => useAudioStore.getState().prev()}
              disabled={index === 0}
              aria-label="الآية السابقة"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full grid place-items-center text-white transition-colors hover:opacity-90"
              style={{ background: "var(--primary)" }}
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
            </button>
            <button
              className="icon-btn"
              onClick={() => useAudioStore.getState().next()}
              disabled={index >= queue.length - 1}
              aria-label="الآية التالية"
            >
              <SkipBack className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 flex-[2] min-w-[200px] order-3 md:order-none basis-full md:basis-auto">
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "42px" }}>
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 rounded-full cursor-pointer relative"
              style={{ background: "var(--border)" }}
              onClick={(e) => {
                const a = audioRef.current;
                if (!a || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                // RTL
                const ratio = (rect.width - x) / rect.width;
                a.currentTime = ratio * duration;
              }}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(to left, var(--primary), var(--gold))",
                }}
              />
            </div>
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "42px" }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Reciter selector */}
          <select
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="hidden lg:block py-2 px-3 rounded-lg text-sm cursor-pointer outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button className="icon-btn" onClick={close} aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .verse-playing {
          background: linear-gradient(transparent, rgba(200, 169, 81, 0.3)) !important;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}
