import { test } from "node:test";
import assert from "node:assert/strict";
import { Snippet } from "../src/types";
import { isStoredSnippet, parseStoredSnippets } from "../src/utils/snippetStorage";

const validSnippet: Snippet = {
  id: "snippet-1",
  kind: "text",
  title: "Standup",
  content: "Yesterday / today / blockers",
  tags: ["work"],
  pinned: false,
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
  useCount: 2,
};

test("parseStoredSnippets returns an empty list for missing or malformed JSON", () => {
  assert.deepEqual(parseStoredSnippets(null), []);
  assert.deepEqual(parseStoredSnippets("not json"), []);
  assert.deepEqual(parseStoredSnippets(JSON.stringify({ snippets: [validSnippet] })), []);
});

test("parseStoredSnippets keeps valid entries when one stored entry is corrupt", () => {
  const result = parseStoredSnippets(
    JSON.stringify([
      validSnippet,
      { ...validSnippet, id: "" },
      { ...validSnippet, tags: ["work", { invalid: true }] },
    ])
  );

  assert.deepEqual(result, [validSnippet]);
});

test("isStoredSnippet validates the fields used by the app", () => {
  assert.equal(isStoredSnippet(validSnippet), true);
  assert.equal(isStoredSnippet({ ...validSnippet, kind: "unknown" }), false);
  assert.equal(isStoredSnippet({ ...validSnippet, pinned: "false" }), false);
  assert.equal(isStoredSnippet({ ...validSnippet, useCount: -1 }), false);
  assert.equal(isStoredSnippet({ ...validSnippet, createdAt: Number.NaN }), false);
});
