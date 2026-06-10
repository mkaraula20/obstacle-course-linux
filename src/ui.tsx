import { Pressable, Text, TextInput, View } from "react-native";
import type { ViewStyle } from "react-native";
import { useNavigate } from "./routing";
import { useTheme } from "./theme";

/** Section heading (was <h1>). */
export function H1({ children, testID }: { children: React.ReactNode; testID?: string }) {
  const { colors } = useTheme();
  return (
    <Text testID={testID} style={{ color: colors.text, fontSize: 28, fontWeight: "700", marginBottom: 12 }}>
      {children}
    </Text>
  );
}

/** Card sub-heading (was <h2>). */
export function H2({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 10 }}>{children}</Text>
  );
}

/** Body paragraph. */
export function P({ children, testID, muted }: { children: React.ReactNode; testID?: string; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <Text testID={testID} style={{ color: muted ? colors.muted : colors.text, fontSize: 15, lineHeight: 22, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

/** Surface card container. */
export function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}
    >
      {children}
    </View>
  );
}

/** Horizontal row with wrapping, mirrors the .row class. */
export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 }, style]}>
      {children}
    </View>
  );
}

/** Pill badge. */
export function Badge({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 999, paddingVertical: 2, paddingHorizontal: 10, alignSelf: "flex-start" }}>
      <Text style={{ color: colors.accentText, fontSize: 13 }}>{children}</Text>
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = "default",
  disabled,
  testID,
}: {
  title: string;
  onPress: () => void;
  variant?: "default" | "primary";
  disabled?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const primary = variant === "primary";
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        backgroundColor: primary ? colors.accent : colors.surface,
        borderWidth: 1,
        borderColor: primary ? "transparent" : colors.border,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
      })}
    >
      <Text style={{ color: primary ? colors.accentText : colors.text, fontSize: 15, fontWeight: "500" }}>{title}</Text>
    </Pressable>
  );
}

/** Labelled field wrapper with optional error line. */
export function Field({
  label,
  error,
  errorTestID,
  children,
}: {
  label?: string;
  error?: string;
  errorTestID?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 14, gap: 6 }}>
      {label ? <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>{label}</Text> : null}
      {children}
      {error ? (
        <Text testID={errorTestID} style={{ color: colors.danger, fontSize: 13 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/** Themed text input (maps to <input>/<textarea> on web). */
export function Input({
  testID,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  onSubmitEditing,
  onKeyPress,
}: {
  testID?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  onSubmitEditing?: () => void;
  onKeyPress?: (e: { nativeEvent: { key: string } }) => void;
}) {
  const { colors } = useTheme();
  return (
    <TextInput
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      multiline={multiline}
      keyboardType={keyboardType}
      onSubmitEditing={onSubmitEditing}
      onKeyPress={onKeyPress}
      style={{
        fontSize: 15,
        color: colors.text,
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        maxWidth: 360,
        ...(multiline ? { minHeight: 80, textAlignVertical: "top" } : {}),
      }}
    />
  );
}

/** Inline text link that drives react-router navigation via Pressable. */
export function TextLink({
  to,
  children,
  testID,
  color,
}: {
  to: string;
  children: React.ReactNode;
  testID?: string;
  color?: string;
}) {
  const { colors } = useTheme();
  const navigate = useNavigate();
  return (
    <Pressable testID={testID} onPress={() => navigate(to)}>
      <Text style={{ color: color ?? colors.accent, fontSize: 15, fontWeight: "500" }}>{children}</Text>
    </Pressable>
  );
}
