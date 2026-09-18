import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Snippet, SnippetKind } from "../types";
import { useTheme } from "../theme";
import { timeAgo } from "../utils/time";

const KIND_ICON: Record<SnippetKind, keyof typeof Ionicons.glyphMap> = {
  text: "document-text-outline",
  link: "link-outline",
  image: "image-outline",
  file: "folder-outline",
};

export default function SnippetCard({
  snippet,
  onPress,
}: {
  snippet: Snippet;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const preview =
    snippet.kind === "text"
      ? snippet.content
      : snippet.kind === "link"
      ? snippet.content
      : snippet.fileName || snippet.title;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.accentSoft }]}>
        <Ionicons name={KIND_ICON[snippet.kind]} size={20} color={theme.accent} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {snippet.pinned && (
            <Ionicons name="pin" size={13} color={theme.accent} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {snippet.title}
          </Text>
        </View>
        <Text style={[styles.preview, { color: theme.subtext }]} numberOfLines={2}>
          {preview}
        </Text>
        <View style={styles.metaRow}>
          {snippet.tags.slice(0, 3).map((t) => (
            <View key={t} style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.tagText, { color: theme.accent }]}>#{t}</Text>
            </View>
          ))}
          <Text style={[styles.time, { color: theme.subtext }]}>
            {timeAgo(snippet.updatedAt)}
            {snippet.useCount > 0 ? `  ·  used ${snippet.useCount}x` : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  body: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600", flexShrink: 1 },
  preview: { fontSize: 13, marginTop: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8, flexWrap: "wrap" },
  tag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6 },
  tagText: { fontSize: 11, fontWeight: "500" },
  time: { fontSize: 11, marginLeft: "auto" },
});
