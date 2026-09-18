/**
 * DEV ONLY flags. Separate module so both the store and the demo script can
 * read them without creating an import cycle.
 *
 * DEMO_AUTOPLAY:
 *  - runs the scripted hands-free demo on launch (for the submission video)
 *  - makes the snippet store ephemeral (never loads or writes AsyncStorage)
 *  - silences LogBox so the capture is clean
 * MUST be false for any store release.
 */
export const DEMO_AUTOPLAY = false;
