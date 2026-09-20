function normalizedDisplayTag(input: string): string {
  return input.trim().replace(/^#+/, "").trim();
}

/** Normalize user-entered tags while keeping the first spelling for display. */
export function normalizeTags(tags: readonly unknown[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const input of tags) {
    if (typeof input !== "string") continue;
    const display = normalizedDisplayTag(input);
    if (!display) continue;
    const comparisonKey = display.toLowerCase();
    if (seen.has(comparisonKey)) continue;
    seen.add(comparisonKey);
    normalized.push(display);
  }

  return normalized;
}

export function tagMatches(tags: readonly unknown[], requested: string): boolean {
  const normalizedRequested = normalizedDisplayTag(requested).toLowerCase();
  if (!normalizedRequested) return false;
  return normalizeTags(tags).some((tag) => tag.toLowerCase() === normalizedRequested);
}

export function tagContains(tags: readonly unknown[], query: string): boolean {
  const normalizedQuery = normalizedDisplayTag(query).toLowerCase();
  if (!normalizedQuery) return false;
  return normalizeTags(tags).some((tag) => tag.toLowerCase().includes(normalizedQuery));
}
