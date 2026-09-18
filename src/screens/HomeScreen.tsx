import React, { useMemo } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSnippets, FREE_LIMIT } from "../store/useSnippets";
import { usePro } from "../services/purchases";
import { useTheme } from "../theme";
import SnippetCard from "../components/SnippetCard";
import EmptyState from "../components/EmptyState";
import { Snippet } from "../types";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const snippets = useSnippets((s) => s.snippets);
  const isPro = usePro((s) => s.isPro);

  const sections = useMemo(() => {
    const pinned = snippets.filter((s) => s.pinned);
    const recent = snippets.filter((s) => !s.pinned);
    const out: { title: string; data: Snippet[] }[] = [];
    if (pinned.length) out.push({ title: "Pinned", data: pinned });
    if (recent.length) out.push({ title: "Recent", data: recent });
    return out;
  }, [snippets]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.appName, { color: theme.text }]}>SnipStack</Text>
          <Text style={[styles.count, { color: theme.subtext }]}>
            {isPro
              ? `${snippets.length} snippets · Pro`
              : `${snippets.length}/${FREE_LIMIT} snippets · Free`}
          </Text>
        </View>
        {!isPro && (
          <TouchableOpacity
            style={[styles.proBtn, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("Paywall")}
          >
            <Ionicons name="sparkles" size={14} color="#fff" />
            <Text style={styles.proBtnText}>Go Pro</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate("SearchTab")}
        activeOpacity={0.8}
      >
        <Ionicons name="search" size={17} color={theme.subtext} />
        <Text style={[styles.searchHint, { color: theme.subtext }]}>
          Search snippets, tags, links...
        </Text>
      </TouchableOpacity>

      {snippets.length === 0 ? (
        <EmptyState
          icon="layers-outline"
          title="Nothing saved yet"
          subtitle="Tap + to stash your first snippet — text, a link, an image, or a file. Get it back in two taps."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 110 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <SnippetCard
              snippet={item}
              onPress={() => navigation.navigate("Detail", { id: item.id })}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate("Editor", {})}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  appName: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5 },
  count: { fontSize: 13, marginTop: 2 },
  proBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 5,
  },
  proBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  searchHint: { fontSize: 15 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
