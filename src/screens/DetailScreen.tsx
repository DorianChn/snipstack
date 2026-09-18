import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useSnippets } from "../store/useSnippets";
import { useTheme } from "../theme";
import { timeAgo } from "../utils/time";

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const { snippets, remove, togglePin, markUsed } = useSnippets();

  const snippet = snippets.find((s) => s.id === route.params?.id);
  if (!snippet) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.subtext, padding: 24 }}>Snippet not found.</Text>
      </SafeAreaView>
    );
  }

  const copy = async () => {
    await Clipboard.setStringAsync(snippet.content);
    markUsed(snippet.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert("Copied", "Snippet copied to your clipboard.");
  };

  const confirmDelete = () => {
    Alert.alert("Delete snippet?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          remove(snippet.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 18 }}>
          <TouchableOpacity onPress={() => togglePin(snippet.id)} hitSlop={10}>
            <Ionicons
              name={snippet.pinned ? "pin" : "pin-outline"}
              size={22}
              color={snippet.pinned ? theme.accent : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Editor", { id: snippet.id })}
            hitSlop={10}
          >
            <Ionicons name="create-outline" size={22} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} hitSlop={10}>
            <Ionicons name="trash-outline" size={22} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { color: theme.text }]}>{snippet.title}</Text>
        <Text style={[styles.meta, { color: theme.subtext }]}>
          {snippet.kind} · saved {timeAgo(snippet.createdAt)}
          {snippet.useCount > 0 ? ` · used ${snippet.useCount}x` : ""}
        </Text>

        <View style={[styles.contentBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {snippet.kind === "image" ? (
            <Image source={{ uri: snippet.content }} style={styles.image} resizeMode="contain" />
          ) : snippet.kind === "file" ? (
            <View style={styles.fileRow}>
              <Ionicons name="document-outline" size={24} color={theme.accent} />
              <Text style={[styles.fileName, { color: theme.text }]}>
                {snippet.fileName || "Attached file"}
              </Text>
            </View>
          ) : (
            <Text
              style={[styles.content, { color: theme.text }]}
              selectable
              onPress={
                snippet.kind === "link"
                  ? () => Linking.openURL(snippet.content).catch(() => {})
                  : undefined
              }
            >
              {snippet.content}
            </Text>
          )}
        </View>

        {snippet.tags.length > 0 && (
          <View style={styles.tagRow}>
            {snippet.tags.map((t) => (
              <View key={t} style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
                <Text style={{ color: theme.accent, fontSize: 13 }}>#{t}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { borderTopColor: theme.border, backgroundColor: theme.bg }]}>
        <TouchableOpacity
          style={[styles.copyBtn, { backgroundColor: theme.accent }]}
          onPress={copy}
          activeOpacity={0.85}
        >
          <Ionicons name="copy-outline" size={18} color="#fff" />
          <Text style={styles.copyText}>Copy to clipboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.3 },
  meta: { fontSize: 13, marginTop: 6, marginBottom: 16, textTransform: "capitalize" },
  contentBox: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  content: { fontSize: 16, lineHeight: 24 },
  image: { width: "100%", height: 260, borderRadius: 8 },
  fileRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  fileName: { fontSize: 15, fontWeight: "600", flexShrink: 1 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  bottomBar: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 15,
  },
  copyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
