import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";
import { Button, Card, H1, H2, Input, P, Row } from "../ui";

const STORAGE_KEY = "obstacle-course:settings";

interface Persisted {
  count: number;
  notifications: boolean;
  volume: number;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return { count: 0, notifications: true, volume: 50 };
}

export default function Settings() {
  const { colors } = useTheme();
  const [state, setState] = useState<Persisted>(load);

  // Persist so state survives reloads — identical behaviour on every platform.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <View testID="page-settings">
      <H1>Settings</H1>

      <Card>
        <H2>Counter</H2>
        <Row>
          <Button testID="counter-decrement" title="−" onPress={() => setState((s) => ({ ...s, count: s.count - 1 }))} />
          <Text testID="counter-value" style={{ color: colors.text, minWidth: 40, textAlign: "center", fontSize: 16 }}>
            {String(state.count)}
          </Text>
          <Button
            testID="counter-increment"
            title="+"
            variant="primary"
            onPress={() => setState((s) => ({ ...s, count: s.count + 1 }))}
          />
          <Button testID="counter-reset" title="Reset" onPress={() => setState((s) => ({ ...s, count: 0 }))} />
        </Row>
        <P muted>This value persists across reloads via localStorage.</P>
      </Card>

      <Card>
        <H2>Toggle</H2>
        <Row>
          {/* No native checkbox in React Native — a Pressable switch with an
              accessible state stands in for it. */}
          <Pressable
            testID="toggle-notifications"
            role="switch"
            aria-checked={state.notifications}
            onPress={() => setState((s) => ({ ...s, notifications: !s.notifications }))}
            style={{
              width: 46,
              height: 26,
              borderRadius: 13,
              padding: 3,
              backgroundColor: state.notifications ? colors.accent : colors.border,
              alignItems: state.notifications ? "flex-end" : "flex-start",
            }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface }} />
          </Pressable>
          <Text style={{ color: colors.text }}>Notifications:</Text>
          <Text testID="notifications-state" style={{ color: colors.text, fontWeight: "700" }}>
            {state.notifications ? "on" : "off"}
          </Text>
        </Row>
      </Card>

      <Card>
        <H2>Volume</H2>
        {/* React Native has no range input; a numeric field carries the value.
            Playwright .fill() still drives it like any other text input. */}
        <Input
          testID="volume-slider"
          keyboardType="numeric"
          value={String(state.volume)}
          onChangeText={(t) => {
            const n = Number(t.replace(/[^0-9]/g, ""));
            setState((s) => ({ ...s, volume: Number.isNaN(n) ? 0 : Math.min(100, n) }));
          }}
        />
        <P>
          <Text style={{ color: colors.text }}>Volume: </Text>
          <Text testID="volume-value" style={{ color: colors.text }}>
            {String(state.volume)}
          </Text>
        </P>
      </Card>
    </View>
  );
}
