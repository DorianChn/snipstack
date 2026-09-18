import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useSnippets, FREE_LIMIT } from "../store/useSnippets";
import { usePro } from "../services/purchases";
import { useTheme } from "../theme";
import { SnippetKind } from "../types";

const KINDS: { key: SnippetKind; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "text", label: "Text", icon: "document-text-outline" },
  { key: "link", label: "Link", icon: "link-outline" },
  { key: "image", label: "Image", icon: "image-outline" },
  { key: "file", label: "File", icon: "folder-outline" },
];

export default function EditorScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const { snippets, add, update } = useSnippets();
  const isPro = usePro((s) => s.isPro);

  const editingId: string | undefined = route.params?.id;
  const existing = editingId ? snippets.find((s) => s.id === editingId) : undefined;

  const [kind, setKind] = useState<SnippetKind>(existing?.kind ?? "text");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [fileName, setFileName] = useState(existing?.fileName ?? "");
  const [tagsText, setTagsText] = useState(existing?.tags.join(", ") ?? "");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    if (!res.canceled && res.assets[0]) {
      setContent(res.assets[0].uri);
      if (!fileName) setFileName(res.assets[0].fileName ?? "image");
    }
  };

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!res.canceled && res.assets[0]) {
      setContent(res.assets[0].uri);
      setFileName(res.assets[0].name);
    }
  };

  const save = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Give your snippet a short, memorable name.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Content required", "Add the text, link, image, or file you want to keep.");
      return;
    }
    if (!existing && !isPro && snippets.length >= FREE_LIMIT) {
      navigation.replace("Paywall", { reason: "limit" });
      return;
    }
    const tags = tagsText
      .split(/[,，]/)
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    if (existing) {
      update(existing.id, { kind, title: title.trim(), content, fileName, tags });
    } else {
      add({ kind, title: title.trim(), content, fileName, tags, pinned: false });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.cancel, { color: theme.subtext }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.text }]}>
            {existing ? "Edit Snippet" : "New Snippet"}
          </Text>
          <TouchableOpacity onPress={save}>
            <Text style={[styles.saveBtn, { color: theme.accent }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.kindRow}>
            {KINDS.map((k) => {
              const active = k.key === kind;
              return (
                <TouchableOpacity
                  key={k.key}
                  style={[
                    styles.kindBtn,
                    {
                      backgroundColor: active ? theme.accent : theme.card,
                      borderColor: active ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setKind(k.key)}
                >
                  <Ionicons
                    name={k.icon}
                    size={16}
                    color={active ? "#fff" : theme.subtext}
                  />
                  <Text
                    style={{
                      color: active ? "#fff" : theme.text,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {k.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={[styles.titleInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder="Title — e.g. Standup reply template"
            placeholderTextColor={theme.subtext}
            value={title}
            onChangeText={setTitle}
          />

          {kind === "text" || kind === "link" ? (
            <TextInput
              style={[
                styles.contentInput,
                { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
                kind === "link" && { minHeight: 56 },
              ]}
              placeholder={kind === "link" ? "https://..." : "Paste or write the reusable text..."}
              placeholderTextColor={theme.subtext}
              value={content}
              onChangeText={setContent}
              multiline={kind === "text"}
              autoCapitalize={kind === "link" ? "none" : "sentences"}
              keyboardType={kind === "link" ? "url" : "default"}
            />
          ) : (
            <TouchableOpacity
              style={[styles.pickerBox, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={kind === "image" ? pickImage : pickFile}
            >
              {kind === "image" && content ? (
                <Image source={{ uri: content }} style={styles.imagePreview} resizeMode="cover" />
              ) : (
                <>
                  <Ionicons
                    name={kind === "image" ? "image-outline" : "document-outline"}
                    size={28}
                    color={theme.accent}
                  />
                  <Text style={{ color: theme.subtext, marginTop: 8 }}>
                    {fileName || (kind === "image" ? "Tap to pick an image" : "Tap to pick a file")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TextInput
            style={[styles.tagsInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder="Tags, comma separated — e.g. work, email"
            placeholderTextColor={theme.subtext}
            value={tagsText}
            onChangeText={setTagsText}
            autoCapitalize="none"
          />

          {!isPro && !existing && (
            <Text style={[styles.limitHint, { color: theme.subtext }]}>
              Free plan: {snippets.length}/{FREE_LIMIT} snippets used. Pro removes the limit.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
  },
  cancel: { fontSize: 16 },
  heading: { fontSize: 17, fontWeight: "700" },
  saveBtn: { fontSize: 16, fontWeight: "700" },
  kindRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  kindBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 9,
  },
  titleInput: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  contentInput: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  pickerBox: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: 200 },
  tagsInput: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  limitHint: { fontSize: 12, textAlign: "center", marginTop: 4 },
});
