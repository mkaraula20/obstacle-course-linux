import { View } from "react-native";
import { H1, P, TextLink } from "../ui";

export default function NotFound() {
  return (
    <View testID="page-notfound">
      <H1>404</H1>
      <P muted>This route doesn’t exist.</P>
      <TextLink to="/" testID="back-home">
        ← Back home
      </TextLink>
    </View>
  );
}
