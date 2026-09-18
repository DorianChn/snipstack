import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSnippets, useAllTags } from "../store/useSnippets";
import { useTheme } from "../theme";
import SnippetCard from "../components/SnippetCard";
import EmptyState from "../components/EmptyState";

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const snippets = useSnippets((s) => s.snippets);
  const allTags = useAllTags();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snippets.filter((s) => {
      if (activeTag && !s.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [snippets, query, activeTag]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <View
        style={[styles.inputRow, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <Ionicons name="search" size={18} color={theme.subtext} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search everything..."
          placeholderTextColor={theme.subtext}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {allTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagRow}
        >
          {allTags.map((t) => {
            const active = t === activeTag;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.accent : theme.card,
                    borderColor: active ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => setActiveTag(active ? null : t)}
              >
                <Text style={{ color: active ? "#fff" : theme.text, fontSize: 13 }}>
                  #{t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {results.length === 0 ? (
        <EmptyState
          icon="file-tray-outline"
          title="No matches"
          subtitle="Try a different keyword or clear the tag filter."
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <SnippetCard
              snippet={item}
              onPress={() => navigation.navigate("Detail", { id: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, padding: 0 },
  tagRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
});
