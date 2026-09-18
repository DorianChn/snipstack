import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import {
  DEMO_UNLOCK,
  fetchCurrentOffering,
  purchasePackage,
  restorePurchases,
  usePro,
} from "../services/purchases";
import { FREE_LIMIT } from "../store/useSnippets";
import { useTheme } from "../theme";

const FEATURES = [
  { icon: "infinite-outline", text: "Unlimited snippets (free plan caps at " + FREE_LIMIT + ")" },
  { icon: "flash-outline", text: "Priority retrieval: pinned + most-used surface first" },
  { icon: "image-outline", text: "Unlimited image & file snippets" },
  { icon: "heart-outline", text: "Support an indie student developer" },
] as const;

/**
 * DEV ONLY — set to false before any store release.
 * When the app runs without a RevenueCat offering (no store connection yet),
 * the paywall would otherwise be an empty screen. This renders clearly-labelled
 * placeholder plans so the paywall design can be demoed on camera.
 */
const SHOW_DEMO_PRICING = false;

const DEMO_PACKAGES = [
  { id: "demo_annual", title: "Annual", desc: "Best value · $1.67 / month", price: "$19.99" },
  { id: "demo_monthly", title: "Monthly", desc: "Cancel anytime", price: "$2.99" },
];

export default function PaywallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const isPro = usePro((s) => s.isPro);

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCurrentOffering()
      .then(setOffering)
      .catch(() => setOffering(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // DEMO_UNLOCK keeps Pro on but must not slam the paywall shut:
    // the screen stays viewable so it can be shown on camera.
    if (isPro && !DEMO_UNLOCK) navigation.goBack();
  }, [isPro]);

  const buy = async (pkg: PurchasesPackage) => {
    setPurchasing(true);
    try {
      await purchasePackage(pkg);
    } catch (e: any) {
      if (!e?.userCancelled) {
        Alert.alert("Purchase failed", e?.message ?? "Please try again later.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    setPurchasing(true);
    try {
      const info = await restorePurchases();
      if (!Object.keys(info.entitlements.active).length) {
        Alert.alert("Nothing to restore", "No previous purchases were found for this account.");
      }
    } catch {
      Alert.alert("Restore failed", "Please try again later.");
    } finally {
      setPurchasing(false);
    }
  };

  const packages = offering?.availablePackages ?? [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4 }}>
        <View style={[styles.heroIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="sparkles" size={40} color={theme.accent} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>SnipStack Pro</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          {route.params?.reason === "limit"
            ? `You've hit the free limit of ${FREE_LIMIT} snippets. Go Pro and never think about limits again.`
            : "Save everything. Find it in seconds. Forever."}
        </Text>

        {FEATURES.map((f) => (
          <View key={f.text} style={styles.featureRow}>
            <Ionicons name={f.icon as any} size={20} color={theme.accent} />
            <Text style={[styles.featureText, { color: theme.text }]}>{f.text}</Text>
          </View>
        ))}

        {loading ? (
          <ActivityIndicator color={theme.accent} style={{ marginTop: 32 }} />
        ) : packages.length === 0 && SHOW_DEMO_PRICING ? (
          <>
            {DEMO_PACKAGES.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.pkgBtn, { backgroundColor: theme.card, borderColor: theme.accent }]}
                onPress={restore}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={[styles.pkgTitle, { color: theme.text }]}>{p.title}</Text>
                  <Text style={[styles.pkgDesc, { color: theme.subtext }]}>{p.desc}</Text>
                </View>
                <Text style={[styles.pkgPrice, { color: theme.accent }]}>{p.price}</Text>
              </TouchableOpacity>
            ))}
            <Text style={[styles.noOfferings, { color: theme.subtext }]}>
              Demo pricing — no store products are connected in this build.
            </Text>
          </>
        ) : packages.length === 0 ? (
          <Text style={[styles.noOfferings, { color: theme.subtext }]}>
            Subscription packages will appear here once the RevenueCat offering
            is configured (see README → RevenueCat setup).
          </Text>
        ) : (
          packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.identifier}
              style={[styles.pkgBtn, { backgroundColor: theme.card, borderColor: theme.accent }]}
              onPress={() => buy(pkg)}
              disabled={purchasing}
              activeOpacity={0.8}
            >
              <View>
                <Text style={[styles.pkgTitle, { color: theme.text }]}>
                  {pkg.product.title}
                </Text>
                <Text style={[styles.pkgDesc, { color: theme.subtext }]}>
                  {pkg.product.description}
                </Text>
              </View>
              <Text style={[styles.pkgPrice, { color: theme.accent }]}>
                {pkg.product.priceString}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity onPress={restore} disabled={purchasing} style={{ marginTop: 20 }}>
          <Text style={[styles.restore, { color: theme.subtext }]}>Restore purchases</Text>
        </TouchableOpacity>
        <Text style={[styles.legal, { color: theme.subtext }]}>
          Payment is charged to your store account. Subscription renews
          automatically unless cancelled at least 24 hours before the end of the
          current period. Manage or cancel in your store settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 8 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  featureText: { fontSize: 15, flex: 1 },
  noOfferings: { fontSize: 13, textAlign: "center", marginTop: 28, lineHeight: 20 },
  pkgBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginTop: 12,
  },
  pkgTitle: { fontSize: 16, fontWeight: "700" },
  pkgDesc: { fontSize: 12, marginTop: 2 },
  pkgPrice: { fontSize: 18, fontWeight: "800" },
  restore: { fontSize: 14, textAlign: "center", textDecorationLine: "underline" },
  legal: { fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 16 },
});
