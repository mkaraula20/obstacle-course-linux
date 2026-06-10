import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ModalContext } from "./modal";
import { useTheme } from "./theme";
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

function NavItem({ to, label, end, onNavigate }: { to: string; label: string; end?: boolean; onNavigate: () => void }) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const active = end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Pressable
      testID={`nav-${label.toLowerCase()}`}
      onPress={() => {
        navigate(to);
        onNavigate();
      }}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: active ? colors.accent : "transparent",
      }}
    >
      <Text style={{ color: active ? colors.accentText : colors.text, fontSize: 15, fontWeight: "500" }}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const { colors, scheme, toggle } = useTheme();
  const location = useLocation();
  const { width } = useWindowDimensions();
  const narrow = width <= 640;
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<React.ReactNode>(null);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = (
    <>
      {NAV.map((item) => (
        <NavItem key={item.to} to={item.to} label={item.label} end={item.end} onNavigate={() => setMenuOpen(false)} />
      ))}
    </>
  );

  return (
    <ModalContext.Provider value={{ setOverlay }}>
    <View testID="app-root" style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Topbar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingVertical: 10,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {narrow ? (
          <Pressable testID="menu-toggle" onPress={() => setMenuOpen((o) => !o)} style={{ padding: 4 }}>
            <Text style={{ color: colors.text, fontSize: 20 }}>☰</Text>
          </Pressable>
        ) : null}
        <Text testID="brand" style={{ color: colors.text, fontWeight: "700", fontSize: 17 }}>
          🏁 Obstacle Course
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable testID="theme-toggle" onPress={toggle} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18 }}>{scheme === "light" ? "🌙" : "☀️"}</Text>
        </Pressable>
      </View>

      {/* Body: sidebar + content */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {!narrow ? (
          <View
            testID="sidebar"
            style={{
              width: 200,
              padding: 12,
              backgroundColor: colors.surface,
              borderRightWidth: 1,
              borderRightColor: colors.border,
            }}
          >
            {navLinks}
          </View>
        ) : null}

        <ScrollView testID="page-content" style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/async" element={<Async />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:itemId" element={<CatalogItem />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScrollView>
      </View>

      {/* Mobile drawer overlay */}
      {narrow && menuOpen ? (
        <View
          testID="sidebar"
          style={{
            position: "fixed",
            top: 53,
            bottom: 0,
            left: 0,
            width: 220,
            padding: 12,
            backgroundColor: colors.surface,
            borderRightWidth: 1,
            borderRightColor: colors.border,
            zIndex: 40,
          }}
        >
          {navLinks}
        </View>
      ) : null}

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
          {`path: ${location.pathname}`}
        </Text>
      </View>

      {/* Page-pushed overlays (modals) render here at the root so position:"fixed" resolves to the viewport. */}
      {overlay}
    </View>
    </ModalContext.Provider>
  );
}
