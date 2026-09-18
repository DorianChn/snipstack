# SnipStack

**One fast, focused place to save and retrieve reusable snippets.**
Built for the [RevenueCat Shipaton 2026](https://www.revenuecat.com/shipaton/).

SnipStack is a productivity app for power users: stash text templates, links,
images, and files the moment you think of them — and get them back in two taps.
No folders to babysit, no sync to configure. Everything lives on-device and is
instantly searchable.

## Features

- **Four snippet kinds** — text, link, image, file. One inbox for all of them.
- **Instant search** — live filtering across titles, content, and tags.
- **Organization without effort** — pin what matters, tag loosely, let
  "most used" tell you what you actually rely on.
- **Two-tap retrieval** — open → copy. Haptic confirmation, use-counter included.
- **Dark & light mode**, fully themed.
- **Freemium via RevenueCat** — free plan caps at 15 snippets; **SnipStack Pro**
  (monthly / yearly subscription) removes the limit.

## Tech stack

- [Expo](https://expo.dev) + React Native (TypeScript)
- React Navigation (native-stack + bottom-tabs)
- Zustand + AsyncStorage (local-first persistence)
- [RevenueCat `react-native-purchases`](https://www.revenuecat.com/docs) for
  subscriptions (entitlement: `pro`)
- expo-image-picker / expo-document-picker / expo-clipboard / expo-haptics

## Run it

> Requires Node 20+ and a dev build (RevenueCat SDK does not run in Expo Go).

```bash
# 1. scaffold (or clone this repo)
npx create-expo-app@latest SnipStack --template blank-typescript
cd SnipStack
# copy this repo's src/, App.tsx, index.ts, app.json, assets/ over the template

# 2. install dependencies (expo picks compatible versions)
npx expo install @react-navigation/native @react-navigation/native-stack \
  @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context \
  zustand @react-native-async-storage/async-storage react-native-purchases \
  expo-clipboard expo-image-picker expo-document-picker expo-haptics

# 3. run a dev build
npx expo run:ios        # or: npx expo run:android
```

## RevenueCat setup

1. Create a project at <https://app.revenuecat.com>.
2. Create an **entitlement** named `pro`.
3. Create two products, e.g. `snipstack_pro_monthly` and
   `snipstack_pro_annual`, attach them to the `pro` entitlement, and add both
   to the **default Offering**.
4. Paste your public SDK keys into `src/services/purchases.ts`
   (`appl_...` for iOS, `goog_...` for Android).
5. For simulator testing, use a StoreKit Configuration file or RevenueCat's
   sandbox testing docs.

> Dev tip: set `DEMO_UNLOCK = true` in `src/services/purchases.ts` to exercise
> the Pro UI without a store connection. **Must be `false` for release builds.**

## Privacy

All snippets are stored locally on the device (AsyncStorage). No accounts, no
analytics, no server. Purchase state is handled by RevenueCat; see their
privacy policy for store-related data.

## License

MIT — open sourced as part of the Shipaton **Next Gen Award** (student category)
submission.
