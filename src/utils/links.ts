/** Return a trimmed URL only when it is safe for the app's link action. */
export function normalizeLinkUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (parsed.username || parsed.password) return null;
    return value;
  } catch {
    return null;
  }
}
