import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snippet } from "../types";
import { uid } from "../utils/id";

const STORAGE_KEY = "snipstack.snippets.v1";

/** Free tier: up to 15 snippets. Pro (RevenueCat entitlement "pro"): unlimited. */
export const FREE_LIMIT = 15;

interface SnippetsState {
  snippets: Snippet[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (
    input: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "useCount">
  ) => Snippet;
  update: (id: string, patch: Partial<Snippet>) => void;
  remove: (id: string) => void;
  togglePin: (id: string) => void;
  markUsed: (id: string) => void;
}

function persist(snippets: Snippet[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snippets)).catch(() => {});
}

export const useSnippets = create<SnippetsState>((set, get) => ({
  snippets: [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const snippets: Snippet[] = raw ? JSON.parse(raw) : [];
      set({ snippets, loaded: true });
    } catch {
      set({ snippets: [], loaded: true });
    }
  },

  add: (input) => {
    const now = Date.now();
    const snippet: Snippet = { ...input, id: uid(), createdAt: now, updatedAt: now, useCount: 0 };
    const snippets = [snippet, ...get().snippets];
    set({ snippets });
    persist(snippets);
    return snippet;
  },

  update: (id, patch) => {
    const snippets = get().snippets.map((s) =>
      s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s
    );
    set({ snippets });
    persist(snippets);
  },

  remove: (id) => {
    const snippets = get().snippets.filter((s) => s.id !== id);
    set({ snippets });
    persist(snippets);
  },

  togglePin: (id) => {
    const snippets = get().snippets.map((s) =>
      s.id === id ? { ...s, pinned: !s.pinned } : s
    );
    set({ snippets });
    persist(snippets);
  },

  markUsed: (id) => {
    const snippets = get().snippets.map((s) =>
      s.id === id ? { ...s, useCount: s.useCount + 1 } : s
    );
    set({ snippets });
    persist(snippets);
  },
}));

export function useAllTags(): string[] {
  const snippets = useSnippets((s) => s.snippets);
  const set = new Set<string>();
  snippets.forEach((s) => s.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
