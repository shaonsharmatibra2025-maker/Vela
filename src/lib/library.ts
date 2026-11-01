import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Kind } from "@/data/catalog";

export type UserNote = {
  id: string;
  mediaId: number;
  episode: number;
  name: string;
  text: string;
  rating: number;
  at: number;
  parentId?: string;
};

export type ChatLine = {
  id: string;
  name: string;
  text: string;
  at: number;
  self?: boolean;
};

import type { ThemeName } from "@/data/site";

export type { ThemeName };

type Progress = { episode: number; at: number };

type LibraryState = {
  kind: Kind;
  setKind: (kind: Kind) => void;
  nick: string;
  setNick: (nick: string) => void;
  watchlist: number[];
  toggleWatch: (id: number) => void;
  progress: Record<string, Progress>;
  markProgress: (id: number, episode: number) => void;
  ratings: Record<string, number>;
  setRating: (key: string, value: number) => void;
  notes: UserNote[];
  addNote: (note: Omit<UserNote, "id" | "at">) => void;
  hideNote: (id: string) => void;
  hiddenNotes: string[];
  chat: ChatLine[];
  addChat: (line: Omit<ChatLine, "id" | "at">) => void;
  dismissed: string[];
  dismiss: (id: string) => void;
  messages: string[];
  addMessage: (text: string) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  reduceMotion: boolean;
  setReduceMotion: (on: boolean) => void;
  featuredId: number | null;
  setFeatured: (id: number | null) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      kind: "ANIME",
      setKind: (kind) => set({ kind }),
      nick: "Guest",
      setNick: (nick) => set({ nick: nick.slice(0, 24) || "Guest" }),
      watchlist: [],
      toggleWatch: (id) => {
        const has = get().watchlist.includes(id);
        set({
          watchlist: has ? get().watchlist.filter((x) => x !== id) : [id, ...get().watchlist],
        });
      },
      progress: {},
      markProgress: (id, episode) =>
        set({
          progress: {
            ...get().progress,
            [String(id)]: { episode, at: Date.now() },
          },
        }),
      ratings: {},
      setRating: (key, value) => set({ ratings: { ...get().ratings, [key]: value } }),
      notes: [],
      addNote: (note) =>
        set({
          notes: [
            { ...note, id: `n-${Date.now()}`, at: Date.now() },
            ...get().notes,
          ].slice(0, 200),
        }),
      hiddenNotes: [],
      hideNote: (id) =>
        set({
          hiddenNotes: get().hiddenNotes.includes(id) ? get().hiddenNotes : [...get().hiddenNotes, id],
        }),
      chat: [],
      addChat: (line) =>
        set({
          chat: [...get().chat, { ...line, id: `c-${Date.now()}-${Math.random()}`, at: Date.now() }].slice(-40),
        }),
      dismissed: [],
      dismiss: (id) => set({ dismissed: get().dismissed.includes(id) ? get().dismissed : [...get().dismissed, id] }),
      messages: [],
      addMessage: (text) => set({ messages: [text, ...get().messages].slice(0, 20) }),
      theme: "night",
      setTheme: (theme) => set({ theme }),
      reduceMotion: false,
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      featuredId: null,
      setFeatured: (featuredId) => set({ featuredId }),
    }),
    { name: "lunar-library", skipHydration: true },
  ),
);