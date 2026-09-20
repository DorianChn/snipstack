/**
 * Type-only contract for the local RevenueCat key file.
 *
 * The real `purchases.keys.ts` file is intentionally gitignored so public SDK
 * keys can be supplied locally without entering the repository. Keeping the
 * module shape here lets a clean checkout pass TypeScript validation before a
 * developer creates that local file.
 */
export declare const REVENUECAT_IOS_KEY: string;
export declare const REVENUECAT_ANDROID_KEY: string;
