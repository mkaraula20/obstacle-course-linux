import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme";
import { Button, Card, Field, H1, H2, Input, Row } from "../ui";

interface Submission {
  username: string;
  email: string;
  age: string;
  plan: string;
  role: string;
  newsletter: boolean;
  bio: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];
const ROLES = ["viewer", "editor", "admin"];

export default function Forms() {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [plan, setPlan] = useState("free");
  const [role, setRole] = useState("viewer");
  const [newsletter, setNewsletter] = useState(false);
  const [bio, setBio] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Submission | null>(null);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (username.trim().length < 3) e.username = "Username must be at least 3 characters.";
    if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (age !== "" && (Number(age) < 18 || Number(age) > 120)) e.age = "Age must be between 18 and 120.";
    return e;
  }

  function onSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted({ username, email, age, plan, role, newsletter, bio });
    } else {
      setSubmitted(null);
    }
  }

  function onReset() {
    setUsername("");
    setEmail("");
    setAge("");
    setPlan("free");
    setRole("viewer");
    setNewsletter(false);
    setBio("");
    setErrors({});
    setSubmitted(null);
  }

  return (
    <View testID="page-forms">
      <H1>Forms</H1>

      <Card>
        <View testID="signup-form">
          <H2>Sign up</H2>

          <Field label="Username" error={errors.username} errorTestID="error-username">
            <Input testID="input-username" value={username} onChangeText={setUsername} placeholder="at least 3 characters" />
          </Field>

          <Field label="Email" error={errors.email} errorTestID="error-email">
            <Input testID="input-email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
          </Field>

          <Field label="Age (optional)" error={errors.age} errorTestID="error-age">
            <Input testID="input-age" value={age} onChangeText={setAge} keyboardType="numeric" />
          </Field>

          <Field label="Plan">
            {/* No native <select> in React Native — a segmented Pressable group. */}
            <View testID="select-plan" style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {PLANS.map((p) => {
                const active = plan === p.value;
                return (
                  <Pressable
                    key={p.value}
                    testID={`plan-${p.value}`}
                    role="radio"
                    aria-checked={active}
                    onPress={() => setPlan(p.value)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: active ? "transparent" : colors.border,
                      backgroundColor: active ? colors.accent : colors.surface,
                    }}
                  >
                    <Text style={{ color: active ? colors.accentText : colors.text }}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Role">
            <View testID="radio-role" style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
              {ROLES.map((r) => {
                const active = role === r;
                return (
                  <Pressable
                    key={r}
                    testID={`radio-role-${r}`}
                    role="radio"
                    aria-checked={active}
                    onPress={() => setRole(r)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: active ? colors.accent : colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {active ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} /> : null}
                    </View>
                    <Text style={{ color: colors.text }}>{r}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field>
            {/* No native checkbox — a Pressable with an accessible checked state. */}
            <Pressable
              testID="checkbox-newsletter"
              role="checkbox"
              aria-checked={newsletter}
              onPress={() => setNewsletter((v) => !v)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: newsletter ? colors.accent : colors.border,
                  backgroundColor: newsletter ? colors.accent : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {newsletter ? <Text style={{ color: colors.accentText, fontSize: 13 }}>✓</Text> : null}
              </View>
              <Text style={{ color: colors.text }}>Subscribe to the newsletter</Text>
            </Pressable>
          </Field>

          <Field label="Bio">
            <Input testID="input-bio" value={bio} onChangeText={setBio} placeholder="Tell us about yourself" multiline />
          </Field>

          <Row>
            <Button testID="submit-button" title="Submit" variant="primary" onPress={onSubmit} />
            <Button testID="reset-button" title="Reset" onPress={onReset} />
          </Row>
        </View>
      </Card>

      {submitted ? (
        <Card>
          <View testID="submission-result">
            <Text style={{ color: colors.ok, fontWeight: "700", fontSize: 18, marginBottom: 10 }}>✓ Submitted</Text>
            <Text
              testID="submission-json"
              style={{ color: colors.text, fontFamily: "monospace", fontSize: 13 }}
            >
              {JSON.stringify(submitted, null, 2)}
            </Text>
          </View>
        </Card>
      ) : null}
    </View>
  );
}
