"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

interface Props {
  autoFocus?: boolean;
  placeholder?: string;
  onSelect?: () => void;
}

export function SearchBar({ autoFocus, placeholder = "ابحث عن سورة، آية، أو رقم...", onSelect }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = q.trim()
    ? SURAHS.filter(
        (s) =>
          s.a.includes(q) ||
          s.e.toLowerCase().includes(q.toLowerCase()) ||
          String(s.n) === q
      ).slice(0, 8)
    : [];

  const goTo = (n: number) => {
    setQ("");
    setOpen(false);
    onSelect?.();
    router.push(`/surah/${n}`);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && matches[0]) goTo(matches[0].n);
        }}
        placeholder={placeholder}
        className="w-full py-4 pr-14 pl-5 text-base rounded-full outline-none transition-all border-2"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
      <Search
        className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
        style={{ color: "var(--text-muted)" }}
      />

      {open && q.trim() && (
        <div
          className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden shadow-lg z-50 animate-fade-in"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {matches.length === 0 ? (
            <div className="p-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              لا توجد نتائج لـ &quot;{q}&quot;
            </div>
          ) : (
            matches.map((s) => (
              <button
                key={s.n}
                onClick={() => goTo(s.n)}
                className="block w-full text-right p-3 px-5 transition-colors border-b last:border-0"
                style={{ borderColor: "var(--border-soft)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-soft)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="font-bold text-sm">
                  {toArabicNum(s.n)}. {s.a}{" "}
                  <span className="font-normal text-xs" style={{ color: "var(--text-muted)" }}>
                    — {s.e}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {s.t === "makki" ? "مكية" : "مدنية"} • {toArabicNum(s.v)} آية
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
