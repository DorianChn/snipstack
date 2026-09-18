# Devpost「About the project」栏 — 整段复制以下内容（不含本行）

## Inspiration

Power users live in their clipboard. Email templates, standup replies, API snippets, that one link you paste five times a week — they end up scattered across Notes, Messages drafts, and random .txt files. I wanted the muscle memory of "copy → paste" without the archaeology of finding things. The constraint I set myself: **saving must take under 5 seconds, retrieval under 2 taps.** Everything else followed from that.

## What it does

SnipStack is a single inbox for reusable snippets:

- **Save anything reusable** — text templates, links, images, files — with a title and loose tags. Four kinds, one place.
- **Get it back instantly** — live search across titles, content, and tags; pinned items and most-used snippets surface first.
- **Two-tap retrieval** — open a snippet, hit "Copy to clipboard", get haptic confirmation. A use-counter quietly shows which snippets earn their keep.
- **Free vs Pro** — the free plan holds 15 snippets (enough to feel the workflow). SnipStack Pro (monthly/yearly, powered by RevenueCat) removes the limit.

## How I built it

- **Expo + React Native (TypeScript)** for a single iOS/Android codebase.
- **Zustand + AsyncStorage** for local-first, offline-by-default persistence — no account, no sync latency, nothing between you and your snippets.
- **RevenueCat `react-native-purchases`** drives the entire paywall: a `pro` entitlement, a default Offering with monthly + yearly packages, restore purchases, and real-time entitlement updates via `addCustomerInfoUpdateListener`. Gating happens exactly once — at the moment a free user tries to save snippet #16 — where the value is most tangible.
- React Navigation (native stack + bottom tabs), expo-haptics for tactile copy confirmation, and a fully custom light/dark theme.

## Challenges I ran into

- **Where to put the paywall.** Hard-gating on app open converts worse and feels hostile. Gating at the 15-snippet limit means users hit the wall only after the app has proven its value — a monetization lesson RevenueCat's own content preaches.
- **Speed as a feature.** Search had to feel instant, so filtering runs in-memory over a denormalized store instead of hitting storage. Every interaction was budgeted: save ≤ 5s, retrieve ≤ 2 taps.
- **RevenueCat in Expo.** The SDK needs a dev build (no Expo Go), so the repo includes a `DEMO_UNLOCK` flag to iterate on paywall UI without a store connection.

## Accomplishments I'm proud of

- The entire save flow really is under 5 seconds — I timed it.
- A clean, honest freemium line: the free tier is genuinely useful, and Pro is a clear upgrade rather than a ransom.
- Shipped as an open-source student project while juggling classes.

## What I learned

- How RevenueCat abstracts StoreKit / Play Billing into one entitlement model, and how much faster that makes iterating on monetization.
- That "fast" is a design decision you enforce at every layer, not a performance pass at the end.

## What's next for SnipStack

- iOS Share Sheet + Action Extension (save from any app without opening SnipStack)
- Home Screen / Lock Screen widgets with your top pinned snippets
- Global hotkey companion for iPad keyboard users
- Optional end-to-end-encrypted sync
