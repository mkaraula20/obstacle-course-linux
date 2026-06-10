import { Pressable, Text, View } from "react-native";
import { useNavigate } from "../routing";
import { useTheme } from "../theme";
import { H1, P } from "../ui";

const STATIONS = [
  { to: "/forms", title: "Forms", desc: "Text, number, checkbox, radio, select, validation" },
  { to: "/async", title: "Async", desc: "Spinners, delayed content, simulated fetch" },
  { to: "/interactions", title: "Interactions", desc: "Modal, tabs, accordion, hover, reorder" },
  { to: "/catalog", title: "Catalog", desc: "Nested routes with URL params" },
  { to: "/settings", title: "Settings", desc: "Counter, toggles, persisted state" },
];

export default function Home() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <View testID="page-home">
      <H1>🏁 Playwright Obstacle Course</H1>
      <P muted>
        Five stations exercising the interactions Playwright is most often used to test. Every interactive element
        carries a stable testID. The app is written in React Native primitives and runs identically on web, desktop and
        mobile.
      </P>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {STATIONS.map((s) => (
          <Pressable
            key={s.to}
            testID={`tile-${s.title.toLowerCase()}`}
            onPress={() => navigate(s.to)}
            style={({ pressed }) => ({
              width: 200,
              padding: 18,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: pressed ? colors.accent : colors.border,
              backgroundColor: colors.surface,
            })}
          >
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{s.title}</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>{s.desc}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
