import React, { useEffect } from "react";
import { StatusBar, View, ActivityIndicator, useColorScheme, LogBox } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation";
import { useSnippets } from "./src/store/useSnippets";
import { initPurchases } from "./src/services/purchases";
import { DEMO_AUTOPLAY, navigationRef, runAutoDemo } from "./src/demo/autoDemo";
import { lightTheme, darkTheme } from "./src/theme";

export default function App() {
  const scheme = useColorScheme();
  const loaded = useSnippets((s) => s.loaded);
  const load = useSnippets((s) => s.load);

  useEffect(() => {
    load();
    initPurchases();
  }, [load]);

  useEffect(() => {
    if (DEMO_AUTOPLAY) {
      // Keep the frame clean for the submission video capture.
      LogBox.ignoreAllLogs(true);
      // Hands-free scripted demo for the submission video (dev only).
      runAutoDemo().catch(() => {});
    }
  }, []);

  const t = scheme === "dark" ? darkTheme : lightTheme;
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: t.accent,
      background: t.bg,
      card: t.card,
      text: t.text,
      border: t.border,
    },
  };

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: t.bg,
        }}
      >
        <ActivityIndicator color={t.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme} ref={navigationRef}>
        <StatusBar barStyle={scheme === "dark" ? "light-content" : "dark-content"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
