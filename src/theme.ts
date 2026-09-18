import { useColorScheme } from "react-native";

export const lightTheme = {
  bg: "#F6F6F9",
  card: "#FFFFFF",
  text: "#15151C",
  subtext: "#6E6E7A",
  border: "#E7E7EE",
  accent: "#5B5BD6",
  accentSoft: "#EDEDFB",
  danger: "#D64545",
  success: "#2F9E6E",
};

export const darkTheme = {
  bg: "#101018",
  card: "#1B1B26",
  text: "#F2F2F7",
  subtext: "#9A9AA8",
  border: "#2C2C3A",
  accent: "#7B7BE8",
  accentSoft: "#26263A",
  danger: "#E06666",
  success: "#4CC38A",
};

export type Theme = typeof lightTheme;

export function useTheme(): { theme: Theme; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { theme: isDark ? darkTheme : lightTheme, isDark };
}
