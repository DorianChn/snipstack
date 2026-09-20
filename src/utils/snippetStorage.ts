import { Snippet, SnippetKind } from "../types";

const SNIPPET_KINDS: ReadonlySet<SnippetKind> = new Set([
  "text",
  "link",
  "image",
  "file",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Return whether a decoded value has the fields required by the Snippet model. */
export function isStoredSnippet(value: unknown): value is Snippet {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || value.id.trim() === "") return false;
  if (typeof value.kind !== "string" || !SNIPPET_KINDS.has(value.kind as SnippetKind)) {
    return false;
  }
  if (typeof value.title !== "string" || typeof value.content !== "string") return false;
  if (!Array.isArray(value.tags) || !value.tags.every((tag) => typeof tag === "string")) {
    return false;
  }
  if (typeof value.pinned !== "boolean") return false;
  if (!isFiniteNumber(value.createdAt) || !isFiniteNumber(value.updatedAt)) return false;
  const useCount = value.useCount;
  if (typeof useCount !== "number" || !Number.isInteger(useCount) || useCount < 0) return false;
  if (value.fileName !== undefined && typeof value.fileName !== "string") return false;
  if (value.mimeType !== undefined && typeof value.mimeType !== "string") return false;
  return true;
}

/**
 * Decode persisted snippets without throwing or rewriting the source value.
 * Invalid entries are discarded individually so valid entries remain usable.
 */
export function parseStoredSnippets(raw: string | null): Snippet[] {
  if (raw === null || raw.trim() === "") return [];

  try {
    const decoded: unknown = JSON.parse(raw);
    return Array.isArray(decoded) ? decoded.filter(isStoredSnippet) : [];
  } catch {
    return [];
  }
}
