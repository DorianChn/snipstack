import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePro, restorePurchases } from "../services/purchases";
import { useSnippets, FREE_LIMIT } from "../store/useSnippets";
import { useTheme } from "../theme";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const isPro = usePro((s) => s.isPro);
  const snippets = useSnippets((s) => s.snippets);

  const restore = async () => {
    try {
      const info = await restorePurchases();
      Alert.alert(
        "Restore complete",
        Object.keys(info.entitlements.active).length
          ? "Your Pro access is active."
          : "No previous purchases found."
      );
    } catch {
      Alert.alert("Restore failed", "Please try again later.");
    }
  };

  const Row = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Ionicons name={icon} size={20} color={theme.accent} />
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {value ? <Text style={[styles.rowValue, { color: theme.subtext }]}>{value}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={16} color={theme.subtext} /> : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.heading, { color: theme.text }]}>Settings</Text>

        <View
          style={[
            styles.proCard,
            { backgroundColor: isPro ? theme.accent : theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons
            name={isPro ? "sparkles" : "sparkles-outline"}
            size={26}
            color={isPro ? "#fff" : theme.accent}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.proTitle, { color: isPro ? "#fff" : theme.text }]}>
              {isPro ? "Pro is active" : "Free plan"}
            </Text>
            <Text style={[styles.proSub, { color: isPro ? "#E6E6FF" : theme.subtext }]}>
              {isPro
                ? "Unlimited snippets. Thank you!"
                : `${snippets.length}/${FREE_LIMIT} snippets used`}
            </Text>
          </View>
          {!isPro && (
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => navigation.navigate("Paywall")}
            >
              <Text style={{ color: theme.accent, fontWeight: "800" }}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.section, { color: theme.subtext }]}>Purchases</Text>
        <Row icon="refresh-outline" label="Restore purchases" onPress={restore} />

        <Text style={[styles.section, { color: theme.subtext }]}>About</Text>
        <Row icon="layers-outline" label="SnipStack" value="v0.1.0 (Shipaton 2026)" />
        <Row
          icon="code-slash-outline"
          label="Open source (MIT)"
          value="for Next Gen Award"
        />
        <Row
          icon="shield-checkmark-outline"
          label="Privacy"
          value="All data stays on-device"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  heading: { fontSize: 30, fontWeight: "800", margin: 4, marginBottom: 14 },
  proCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 8,
  },
  proTitle: { fontSize: 16, fontWeight: "800" },
  proSub: { fontSize: 13, marginTop: 2 },
  upgradeBtn: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  section: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  rowLabel: { fontSize: 15, fontWeight: "600", flex: 1 },
  rowValue: { fontSize: 13 },
});
