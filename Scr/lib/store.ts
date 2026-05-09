"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_RECITER_ID } from "./reciters";
import { DEFAULT_TAFSIR_ID } from "./tafasir";

export interface Bookmark {
  surah: number;
  verse: number;
  text: string;
  reference: string;
  createdAt: number;
}

export interface ReadingHistoryItem {
  surah: number;
  verse?: number;
  visitedAt: number;
}

interface QuranStore {
  // Theme & UI
  theme: "light" | "dark";
  fontSize: number;
  readMode: "page" | "list";
  showTranslation: boolean;
  selectedTranslation: string;
  selectedTafsir: string;

  // Audio
  reciter: string;

  // Data
  bookmarks: Bookmark[];
  history: ReadingHistoryItem[];
  lastRead: { surah: number; verse?: number } | null;

  // Actions
  toggleTheme: () => void;
  setFontSize: (n: number) => void;
  setReadMode: (m: "page" | "list") => void;
  toggleTranslation: () => void;
  setTranslation: (id: string) => void;
  setTafsir: (id: string) => void;
  setReciter: (id: string) => void;

  toggleBookmark: (b: Omit<Bookmark, "createdAt">) => boolean; // returns true if added
  isBookmarked: (surah: number, verse: number) => boolean;
  removeBookmark: (surah: number, verse: number) => void;

  addToHistory: (surah: number, verse?: number) => void;
  setLastRead: (surah: number, verse?: number) => void;
}

export const useQuranStore = create<QuranStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      fontSize: 1.7,
      readMode: "page",
      showTranslation: false,
      selectedTranslation: "en.sahih",
      selectedTafsir: DEFAULT_TAFSIR_ID,
      reciter: DEFAULT_RECITER_ID,

      bookmarks: [],
      history: [],
      lastRead: null,

      toggleTheme: () =>
        set((s) => {
          const t = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", t === "dark");
          }
          return { theme: t };
        }),

      setFontSize: (n) => set({ fontSize: n }),
      setReadMode: (m) => set({ readMode: m }),
      toggleTranslation: () => set((s) => ({ showTranslation: !s.showTranslation })),
      setTranslation: (id) => set({ selectedTranslation: id }),
      setTafsir: (id) => set({ selectedTafsir: id }),
      setReciter: (id) => set({ reciter: id }),

      toggleBookmark: (b) => {
        const { bookmarks } = get();
        const exists = bookmarks.find((x) => x.surah === b.surah && x.verse === b.verse);
        if (exists) {
          set({ bookmarks: bookmarks.filter((x) => !(x.surah === b.surah && x.verse === b.verse)) });
          return false;
        }
        set({ bookmarks: [...bookmarks, { ...b, createdAt: Date.now() }] });
        return true;
      },
      isBookmarked: (surah, verse) =>
        get().bookmarks.some((b) => b.surah === surah && b.verse === verse),
      removeBookmark: (surah, verse) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter((b) => !(b.surah === surah && b.verse === verse)),
        })),

      addToHistory: (surah, verse) =>
        set((s) => {
          const filtered = s.history.filter((h) => h.surah !== surah);
          return { history: [{ surah, verse, visitedAt: Date.now() }, ...filtered].slice(0, 20) };
        }),
      setLastRead: (surah, verse) => set({ lastRead: { surah, verse } }),
    }),
    {
      name: "quran-platform-store",
      partialize: (s) => ({
        theme: s.theme,
        fontSize: s.fontSize,
        readMode: s.readMode,
        showTranslation: s.showTranslation,
        selectedTranslation: s.selectedTranslation,
        selectedTafsir: s.selectedTafsir,
        reciter: s.reciter,
        bookmarks: s.bookmarks,
        history: s.history,
        lastRead: s.lastRead,
      }),
    }
  )
);

/** Hook لتطبيق الثيم على <html> عند التحميل */
export function useApplyTheme() {
  const theme = useQuranStore((s) => s.theme);
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}
