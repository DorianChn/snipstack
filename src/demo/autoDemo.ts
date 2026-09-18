import { createNavigationContainerRef } from "@react-navigation/native";
import { useSnippets } from "../store/useSnippets";
import { DEMO_AUTOPLAY } from "./flags";

export { DEMO_AUTOPLAY };

/**
 * DEV ONLY — hands-free scripted demo used to record the Shipaton submission
 * video on a device where adb input injection is blocked by the OEM.
 * It drives the real app through its own store + navigation APIs: no fake
 * screens, no mock UI. See flags.ts — set DEMO_AUTOPLAY = false for release.
 *
 * Coverage (every user-facing feature), ~120s:
 *   empty state -> create Text -> create Link (type selector) -> inbox list
 *   -> pin -> live search -> tag filter -> detail -> copy (use counter)
 *   -> paywall (RevenueCat) -> settings -> back to inbox
 */

export const navigationRef = createNavigationContainerRef<any>();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Untyped navigation helpers — the demo drives screens dynamically. */
const nav = navigationRef as any;
const go = (name: string, params?: object) => {
  if (navigationRef.isReady()) nav.navigate(name, params);
};
const back = () => {
  if (navigationRef.isReady()) nav.goBack();
};

export async function runAutoDemo(): Promise<void> {
  const { add, togglePin, markUsed } = useSnippets.getState();

  // The store is ephemeral in demo mode (see flags.ts), but wait for the
  // first render to settle so the empty state is actually on screen.
  for (let i = 0; i < 40 && !useSnippets.getState().loaded; i++) {
    await wait(150);
  }

  // 1. Empty state.
  await wait(5000);

  // 2. Capture flow #1 — plain text snippet (Editor pre-fills + saves).
  go("Editor", { demo: "text" });
  await wait(10500);
  go("Inbox", {});
  await wait(4000);

  // 3. Capture flow #2 — switch the type selector to Link and save.
  go("Editor", { demo: "link" });
  await wait(10500);
  go("Inbox", {});
  await wait(4500);

  // 4. A couple more snippets so the list shows text + link kinds.
  const standup = add({
    kind: "text",
    title: "Standup reply",
    content:
      "Yesterday: wrapped the auth refactor and shipped it to staging. Today: pairing on the payments webhook. No blockers.",
    tags: ["work", "email"],
    pinned: false,
  });
  add({
    kind: "text",
    title: "API error boilerplate",
    content: '{ "error": { "code": 401, "message": "Token expired" } }',
    tags: ["api"],
    pinned: false,
  });
  await wait(6000);

  // 5. Pin — the snippet floats to the Pinned section at the top.
  togglePin(standup.id);
  await wait(5500);

  // 6. Live text search.
  go("SearchTab", { q: "standup" });
  await wait(9000);

  // 7. Tag filter.
  go("SearchTab", { tag: "work" });
  await wait(8500);

  // 8. Detail view + copy to clipboard (bumps the use counter).
  go("Detail", { id: standup.id });
  await wait(8500);
  markUsed(standup.id);
  await wait(8500);
  back();
  await wait(3500);

  // 9. Monetization — the RevenueCat-powered paywall.
  go("Paywall", {});
  await wait(14000);
  back();
  await wait(3000);

  // 10. Settings (entitlement state, restore, about) and the closing shot.
  go("SettingsTab", {});
  await wait(12000);
  go("Inbox", {});
  await wait(7000);
}
