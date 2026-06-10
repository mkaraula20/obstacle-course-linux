import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { useModalHost } from "../modal";
import { useTheme } from "../theme";
import { Button, Card, H1, H2, Input, P, Row } from "../ui";

export default function Interactions() {
  return (
    <View testID="page-interactions">
      <H1>Interactions</H1>
      <ModalDemo />
      <TabsDemo />
      <AccordionDemo />
      <HoverDemo />
      <ReorderDemo />
      <DynamicListDemo />
    </View>
  );
}

function ModalDemo() {
  const { colors } = useTheme();
  const { setOverlay } = useModalHost();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState("—");

  // Push the dialog to the root overlay host so position:"fixed" covers the
  // whole viewport (see modal.tsx). Driven by `open`.
  useEffect(() => {
    if (!open) {
      setOverlay(null);
      return;
    }
    setOverlay(
      <View
        testID="modal-backdrop"
        style={{
          // "fixed" pins to the viewport on web; native has no "fixed", but the
          // overlay is rendered at the app root so "absolute" + inset:0 fills the
          // screen there.
          position: Platform.select({ web: "fixed", default: "absolute" }),
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <View
          testID="modal"
          role="dialog"
          aria-modal
          style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 24, width: "90%", maxWidth: 420 }}
        >
          <H2>Are you sure?</H2>
          <P muted>This dialog blocks the rest of the page.</P>
          <Row>
            <Button
              testID="modal-confirm"
              title="Confirm"
              variant="primary"
              onPress={() => {
                setConfirmed("confirmed");
                setOpen(false);
              }}
            />
            <Button
              testID="modal-cancel"
              title="Cancel"
              onPress={() => {
                setConfirmed("cancelled");
                setOpen(false);
              }}
            />
          </Row>
        </View>
      </View>
    );
    return () => setOverlay(null);
  }, [open, colors]);

  return (
    <Card>
      <H2>Modal dialog</H2>
      <Row>
        <Button testID="open-modal" title="Open dialog" variant="primary" onPress={() => setOpen(true)} />
        <Text style={{ color: colors.text }}>
          Last action: <Text testID="modal-result">{confirmed}</Text>
        </Text>
      </Row>
    </Card>
  );
}

function TabsDemo() {
  const { colors } = useTheme();
  const tabs = ["overview", "details", "reviews"];
  const [active, setActive] = useState("overview");
  const labels: Record<string, string> = {
    overview: "Overview panel content.",
    details: "Details panel content.",
    reviews: "Reviews panel content.",
  };

  return (
    <Card>
      <H2>Tabs</H2>
      <View
        testID="tablist"
        style={{ flexDirection: "row", gap: 4, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16 }}
      >
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <Pressable
              key={t}
              testID={`tab-${t}`}
              role="tab"
              aria-selected={isActive}
              onPress={() => setActive(t)}
              style={{ paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: isActive ? colors.accent : "transparent" }}
            >
              <Text style={{ color: isActive ? colors.accent : colors.text, fontWeight: isActive ? "600" : "400" }}>{t}</Text>
            </Pressable>
          );
        })}
      </View>
      <View testID={`panel-${active}`}>
        <Text style={{ color: colors.text }}>{labels[active]}</Text>
      </View>
    </Card>
  );
}

function AccordionDemo() {
  const { colors } = useTheme();
  const items = [
    { id: "shipping", q: "How long does shipping take?", a: "Usually 3–5 business days." },
    { id: "returns", q: "What is the return policy?", a: "30 days, no questions asked." },
    { id: "support", q: "How do I contact support?", a: "Use the chat widget any time." },
  ];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Card>
      <H2>Accordion</H2>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <View key={item.id} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
            <Pressable
              testID={`accordion-header-${item.id}`}
              aria-expanded={isOpen}
              onPress={() => setOpen(isOpen ? null : item.id)}
              style={{ padding: 14, backgroundColor: colors.surface }}
            >
              <Text style={{ color: colors.text }}>{`${isOpen ? "▼ " : "▶ "}${item.q}`}</Text>
            </Pressable>
            {isOpen ? (
              <View testID={`accordion-panel-${item.id}`} style={{ padding: 14, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={{ color: colors.text }}>{item.a}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </Card>
  );
}

function HoverDemo() {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <Card>
      <H2>Hover tooltip</H2>
      <View style={{ alignSelf: "flex-start" }}>
        <Pressable
          testID="hover-target"
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onPress={() => {}}
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: colors.surface }}
        >
          <Text style={{ color: colors.text }}>Hover over me</Text>
        </Pressable>
        {hovered ? (
          <View
            testID="tooltip"
            role="tooltip"
            style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, backgroundColor: colors.text, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10 }}
          >
            <Text style={{ color: colors.bg, fontSize: 13 }}>Revealed on hover!</Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function ReorderDemo() {
  const { colors } = useTheme();
  const [items, setItems] = useState(["Apples", "Bananas", "Cherries", "Dates"]);

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  }

  return (
    <Card>
      <H2>Reorder the list</H2>
      <P muted>
        Native HTML5 drag-and-drop has no React Native equivalent, so reordering uses move controls — the standard
        mobile pattern.
      </P>
      <View testID="drag-list" style={{ maxWidth: 360, gap: 8 }}>
        {items.map((item, i) => (
          <View
            key={item}
            testID={`drag-item-${item.toLowerCase()}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              backgroundColor: colors.bg,
            }}
          >
            <Text style={{ color: colors.text, flex: 1 }}>{`${i + 1}. ${item}`}</Text>
            <Pressable testID={`move-up-${item.toLowerCase()}`} onPress={() => move(i, i - 1)} disabled={i === 0} style={{ padding: 4, opacity: i === 0 ? 0.3 : 1 }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>↑</Text>
            </Pressable>
            <Pressable
              testID={`move-down-${item.toLowerCase()}`}
              onPress={() => move(i, i + 1)}
              disabled={i === items.length - 1}
              style={{ padding: 4, opacity: i === items.length - 1 ? 0.3 : 1 }}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>↓</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Text testID="drag-order" style={{ color: colors.muted, marginTop: 10 }}>
        {`Order: ${items.join(", ")}`}
      </Text>
    </Card>
  );
}

function DynamicListDemo() {
  const { colors } = useTheme();
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  function add() {
    const v = value.trim();
    if (!v) return;
    setItems((prev) => [...prev, v]);
    setValue("");
  }

  return (
    <Card>
      <H2>Dynamic list</H2>
      <Row>
        <Input testID="todo-input" value={value} onChangeText={setValue} placeholder="Add an item, press Enter" onSubmitEditing={add} />
        <Button testID="todo-add" title="Add" variant="primary" onPress={add} />
      </Row>
      <View testID="todo-list" style={{ marginTop: 8, gap: 6 }}>
        {items.map((item, i) => (
          <View key={i} testID="todo-item" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: colors.text, flex: 1 }}>{item}</Text>
            <Pressable testID="todo-remove" aria-label={`remove ${item}`} onPress={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>
              <Text style={{ color: colors.danger }}>✕</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <P muted>
        Count: <Text testID="todo-count">{String(items.length)}</Text>
      </P>
    </Card>
  );
}
