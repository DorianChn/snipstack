import { create } from "zustand";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
} from "react-native-purchases";
import {
  REVENUECAT_IOS_KEY,
  REVENUECAT_ANDROID_KEY,
} from "./purchases.keys";

/**
 * RevenueCat setup:
 * 1. Create a project at https://app.revenuecat.com
 * 2. Create an entitlement named "pro"
 * 3. Create products (e.g. snipstack_pro_monthly / snipstack_pro_annual),
 *    attach them to the entitlement, and add them to the default Offering
 * 4. Copy purchases.keys.example.ts to purchases.keys.ts and paste your
 *    public SDK keys there (that file is gitignored and never committed)
 */
export const ENTITLEMENT_ID = "pro";

const API_KEY = Platform.select({
  ios: REVENUECAT_IOS_KEY,
  android: REVENUECAT_ANDROID_KEY,
  default: "",
});

/**
 * DEV ONLY: unlocks Pro without a store connection so the UI can be
 * exercised in Expo Go / simulators. MUST be false for release builds.
 */
export const DEMO_UNLOCK = false;

interface ProState {
  ready: boolean;
  isPro: boolean;
  setFromInfo: (info: CustomerInfo | null) => void;
}

export const usePro = create<ProState>((set) => ({
  ready: false,
  isPro: false,
  setFromInfo: (info) =>
    set({
      ready: true,
      isPro: DEMO_UNLOCK || info?.entitlements.active[ENTITLEMENT_ID] != null,
    }),
}));

export async function initPurchases(): Promise<void> {
  if (DEMO_UNLOCK) {
    usePro.setState({ ready: true, isPro: true });
    return;
  }
  try {
    if (!API_KEY || API_KEY.includes("REPLACE")) {
      usePro.setState({ ready: true, isPro: false });
      return;
    }
    Purchases.setLogLevel(LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey: API_KEY });
    const info = await Purchases.getCustomerInfo();
    usePro.getState().setFromInfo(info);
    Purchases.addCustomerInfoUpdateListener((updated) =>
      usePro.getState().setFromInfo(updated)
    );
    // Dev probe: confirms the RevenueCat catalogue is reachable from the device.
    Purchases.getOfferings()
      .then((o) =>
        console.log(
          "[RC-PROBE] offering=" +
            (o.current?.identifier ?? "none") +
            " packages=" +
            (o.current?.availablePackages.map((p) => p.identifier).join("|") || "none")
        )
      )
      .catch((e) => console.log("[RC-PROBE] error " + e?.message));
  } catch {
    usePro.setState({ ready: true, isPro: false });
  }
}

export async function fetchCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  usePro.getState().setFromInfo(customerInfo);
  return customerInfo.entitlements.active[ENTITLEMENT_ID] != null;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  const info = await Purchases.restorePurchases();
  usePro.getState().setFromInfo(info);
  return info;
}
