import { useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "../theme";
import { Button, Card, H1, H2, P, Row } from "../ui";

interface Quote {
  id: number;
  text: string;
}

const QUOTES = [
  "Slow is smooth, smooth is fast.",
  "Make it work, make it right, make it fast.",
  "The best test is the one that runs.",
  "Flaky tests are worse than no tests.",
  "Wait for state, not for time.",
];

export default function Async() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delayedVisible, setDelayedVisible] = useState(false);
  const counterRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate a network fetch that resolves after ~800ms.
  function loadQuote(shouldFail = false) {
    setLoading(true);
    setError(null);
    setQuote(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (shouldFail) {
        setError("Failed to load. Try again.");
        return;
      }
      const next = QUOTES[counterRef.current % QUOTES.length];
      counterRef.current += 1;
      setQuote({ id: counterRef.current, text: next });
    }, 800);
  }

  function revealLater() {
    setDelayedVisible(false);
    setTimeout(() => setDelayedVisible(true), 1200);
  }

  return (
    <View testID="page-async">
      <H1>Async</H1>

      <Card>
        <H2>Simulated fetch</H2>
        <P muted>Tests should wait for the result element, never a fixed sleep.</P>
        <Row>
          <Button testID="load-quote" title="Load quote" variant="primary" onPress={() => loadQuote(false)} disabled={loading} />
          <Button testID="load-quote-fail" title="Load (will fail)" onPress={() => loadQuote(true)} disabled={loading} />
        </Row>

        <View style={{ marginTop: 16, minHeight: 28 }}>
          {loading ? (
            <View testID="loading-indicator" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ActivityIndicator color={colors.accent} />
              <Text style={{ color: colors.text }}>Loading…</Text>
            </View>
          ) : null}
          {quote ? (
            <Text testID="quote-result" style={{ color: colors.text, fontStyle: "italic", fontSize: 16 }}>
              {`“${quote.text}”`}
            </Text>
          ) : null}
          {error ? (
            <Text testID="quote-error" style={{ color: colors.danger }}>
              {error}
            </Text>
          ) : null}
        </View>
      </Card>

      <Card>
        <H2>Delayed appearance</H2>
        <Button testID="reveal-later" title="Reveal after 1.2s" onPress={revealLater} />
        {delayedVisible ? (
          <Text testID="delayed-content" style={{ color: colors.ok, marginTop: 12 }}>
            🎉 I appeared after a delay.
          </Text>
        ) : null}
      </Card>
    </View>
  );
}
