import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTags, tagContains, tagMatches } from "../src/utils/tags";

test("normalizeTags trims, removes hash prefixes, drops blanks, and deduplicates case-insensitively", () => {
  assert.deepEqual(
    normalizeTags([" Work ", "#work", "WORK", "##Personal", "", "  "]),
    ["Work", "Personal"]
  );
});

test("normalizeTags ignores non-string values from malformed persisted data", () => {
  assert.deepEqual(normalizeTags(["#Work", 42, null, { name: "personal" }]), ["Work"]);
});

test("tagMatches applies the same normalization as saved tags", () => {
  const tags = [" Work ", "#Personal"];
  assert.equal(tagMatches(tags, "work"), true);
  assert.equal(tagMatches(tags, "#PERSONAL"), true);
  assert.equal(tagMatches(tags, "home"), false);
});

test("tagContains searches normalized tags case-insensitively", () => {
  assert.equal(tagContains(["#Work"], "wor"), true);
  assert.equal(tagContains(["#Work"], "#wor"), true);
  assert.equal(tagContains(["#Work"], "personal"), false);
});
