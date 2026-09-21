import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snippet } from "../types";
import { uid } from "../utils/id";
import { parseStoredSnippets } from "../utils/snippetStorage";
import { normalizeTags } from "../utils/tags";
import { createWriteQueue } from "../utils/storageWriteQueue";
import { DEMO_AUTOPLAY } from "../demo/flags";

const STORAGE_KEY = "snipstack.snippets.v1";

/** Free tier: up to 15 snippets. Pro (RevenueCat entitlement "pro"): unlimited. */
export const FREE_LIMIT = 15;

const persistQueue = createWriteQueue((serialized) =>
  AsyncStorage.setItem(STORAGE_KEY, serialized)
);

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
  // In demo mode the store is ephemeral so every capture starts clean.
  if (DEMO_AUTOPLAY) return;
  persistQueue(JSON.stringify(snippets));
}

export const useSnippets = create<SnippetsState>((set, get) => ({
  snippets: [],
  loaded: false,

  load: async () => {
    if (DEMO_AUTOPLAY) {
      set({ snippets: [], loaded: true });
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const snippets = parseStoredSnippets(raw).map((snippet) => ({
        ...snippet,
        tags: normalizeTags(snippet.tags),
      }));
      set({ snippets, loaded: true });
    } catch {
      set({ snippets: [], loaded: true });
    }
  },

  add: (input) => {
    const now = Date.now();
    const snippet: Snippet = {
      ...input,
      tags: normalizeTags(input.tags),
      id: uid(),
      createdAt: now,
      updatedAt: now,
      useCount: 0,
    };
    const snippets = [snippet, ...get().snippets];
    set({ snippets });
    persist(snippets);
    return snippet;
  },

  update: (id, patch) => {
    const snippets = get().snippets.map((s) =>
      s.id === id
        ? {
            ...s,
            ...patch,
            tags: patch.tags ? normalizeTags(patch.tags) : s.tags,
            updatedAt: Date.now(),
          }
        : s
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
  return normalizeTags(snippets.flatMap((snippet) => snippet.tags)).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}
