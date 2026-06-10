import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Scheme = "light" | "dark";

export interface Palette {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  danger: string;
  ok: string;
}

const LIGHT: Palette = {
  bg: "#f7f8fa",
  surface: "#ffffff",
  text: "#1c1e21",
  muted: "#6b7280",
  border: "#e3e6ea",
  accent: "#4f46e5",
  accentText: "#ffffff",
  danger: "#dc2626",
  ok: "#16a34a",
};

const DARK: Palette = {
  bg: "#0f1115",
  surface: "#1a1d23",
  text: "#e6e8eb",
  muted: "#9ca3af",
  border: "#2a2e36",
  accent: "#818cf8",
  accentText: "#0f1115",
  danger: "#f87171",
  ok: "#4ade80",
};

interface ThemeValue {
  scheme: Scheme;
  colors: Palette;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<Scheme>("light");

  // Mirror the scheme onto <html data-theme> so the document background matches
  // and so the same theme assertion works on every platform's webview.
  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
  }, [scheme]);

  const value = useMemo<ThemeValue>(
    () => ({
      scheme,
      colors: scheme === "light" ? LIGHT : DARK,
      toggle: () => setScheme((s) => (s === "light" ? "dark" : "light")),
    }),
    [scheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
