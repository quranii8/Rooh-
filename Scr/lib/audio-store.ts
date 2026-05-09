"use client";

import { create } from "zustand";

export interface AudioQueueItem {
  surah: number;
  verse: number;
  url: string;
  title: string;
  subtitle: string;
}

interface AudioState {
  queue: AudioQueueItem[];
  index: number;
  isPlaying: boolean;
  isVisible: boolean;
  currentTime: number;
  duration: number;

  setQueue: (q: AudioQueueItem[], startIndex?: number) => void;
  setIndex: (i: number) => void;
  setPlaying: (p: boolean) => void;
  setVisible: (v: boolean) => void;
  setProgress: (cur: number, dur: number) => void;
  next: () => void;
  prev: () => void;
  close: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  queue: [],
  index: 0,
  isPlaying: false,
  isVisible: false,
  currentTime: 0,
  duration: 0,

  setQueue: (q, startIndex = 0) =>
    set({ queue: q, index: startIndex, isVisible: true, isPlaying: true }),
  setIndex: (i) => set({ index: i }),
  setPlaying: (p) => set({ isPlaying: p }),
  setVisible: (v) => set({ isVisible: v }),
  setProgress: (cur, dur) => set({ currentTime: cur, duration: dur }),
  next: () => {
    const { queue, index } = get();
    if (index < queue.length - 1) set({ index: index + 1, isPlaying: true });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1, isPlaying: true });
  },
  close: () => set({ isVisible: false, isPlaying: false, queue: [] }),
}));
