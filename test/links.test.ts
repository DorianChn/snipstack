import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeLinkUrl } from "../src/utils/links";

test("normalizeLinkUrl trims valid HTTP and HTTPS URLs", () => {
  assert.equal(normalizeLinkUrl("  https://example.test/docs  "), "https://example.test/docs");
  assert.equal(normalizeLinkUrl("http://localhost:8787/hook"), "http://localhost:8787/hook");
});

test("normalizeLinkUrl rejects unsafe schemes, credentials, and malformed input", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/plain,hello",
    "file:///tmp/file",
    "ftp://example.test/file",
    "https://user:password@example.test/secret",
    "example.test/no-scheme",
    "",
    "not a URL",
  ]) {
    assert.equal(normalizeLinkUrl(value), null, value);
  }
});
