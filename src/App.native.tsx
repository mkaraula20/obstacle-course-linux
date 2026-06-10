import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ModalContext } from "./modal";
import { NativeRouter, useRouter } from "./routing.native";
import { ThemeProvider, useTheme } from "./theme";
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import Async from "./pages/Async";
import Interactions from "./pages/Interactions";
import Catalog from "./pages/Catalog";
import CatalogItem from "./pages/CatalogItem";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/forms", label: "Forms" },
  { to: "/async", label: "Async" },
  { to: "/interactions", label: "Interactions" },
  { to: "/catalog", label: "Catalog" },
  { to: "/settings", label: "Settings" },
];

const TOP_INSET = Platform.select({ ios: 44, android: 28, default: 0 }) ?? 0;

// The same shared page components as the web build, selected by path string.
function screenFor(path: string) {
  if (path === "/") return <Home />;
  if (path === "/forms") return <Forms />;
  if (path === "/async") return <Async />;
  if (path === "/interactions") return <Interactions />;
  if (path.startsWith("/catalog/")) return <CatalogItem />;
  if (path === "/catalog") return <Catalog />;
  if (path === "/settings") return <Settings />;
  return <NotFound />;
}

function Shell() {
  const { colors, scheme, toggle } = useTheme();
  const { path, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<React.ReactNode>(null);

  return (
    <ModalContext.Provider value={{ setOverlay }}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === "light" ? "dark" : "light"} />

        {/* Topbar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingTop: TOP_INSET + 10,
            paddingBottom: 10,
            paddingHorizontal: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable testID="menu-toggle" onPress={() => setMenuOpen((o) => !o)} style={{ padding: 4 }}>
            <Text style={{ color: colors.text, fontSize: 20 }}>☰</Text>
          </Pressable>
          <Text testID="brand" style={{ color: colors.text, fontWeight: "700", fontSize: 17 }}>
            🏁 Obstacle Course
          </Text>
          <View style={{ flex: 1 }} />
          <Pressable testID="theme-toggle" onPress={toggle} style={{ padding: 4 }}>
            <Text style={{ fontSize: 18 }}>{scheme === "light" ? "🌙" : "☀️"}</Text>
          </Pressable>
        </View>

        {/* Active screen */}
        <ScrollView testID="page-content" style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          {screenFor(path)}
        </ScrollView>

        {/* Statusbar */}
        <View
          testID="statusbar"
          style={{
            paddingVertical: 6,
            paddingHorizontal: 16,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text testID="current-path" style={{ color: colors.muted, fontSize: 12 }}>
            {`path: ${path}`}
          </Text>
        </View>

        {/* Nav drawer */}
        {menuOpen ? (
          <View
            testID="sidebar"
            style={{
              position: "absolute",
              top: TOP_INSET + 52,
              bottom: 0,
              left: 0,
              width: 240,
              padding: 12,
              backgroundColor: colors.surface,
              borderRightWidth: 1,
              borderRightColor: colors.border,
              zIndex: 40,
            }}
          >
            {NAV.map((item) => {
              const active = item.end ? path === item.to : path === item.to || path.startsWith(item.to + "/");
              return (
                <Pressable
                  key={item.to}
                  testID={`nav-${item.label.toLowerCase()}`}
                  onPress={() => {
                    navigate(item.to);
                    setMenuOpen(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginBottom: 4,
                    backgroundColor: active ? colors.accent : "transparent",
                  }}
                >
                  <Text style={{ color: active ? colors.accentText : colors.text, fontSize: 15, fontWeight: "500" }}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {/* Page-pushed overlays (modals) render at the root. */}
        {overlay}
      </View>
    </ModalContext.Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NativeRouter>
        <Shell />
      </NativeRouter>
    </ThemeProvider>
  );
}
