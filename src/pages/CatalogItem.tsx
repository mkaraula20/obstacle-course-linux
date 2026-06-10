import { Text, View } from "react-native";
import { useParams } from "../routing";
import { CATALOG } from "../data";
import { useTheme } from "../theme";
import { Badge, H1, P, TextLink } from "../ui";

export default function CatalogItem() {
  const { colors } = useTheme();
  const { itemId } = useParams();
  const entry = CATALOG.find((e) => e.id === itemId);

  if (!entry) {
    return (
      <View testID="catalog-item-missing">
        <H1>Item not found</H1>
        <P muted>{`No catalog entry with id “${itemId}”.`}</P>
        <TextLink to="/catalog" testID="back-to-catalog">
          ← Back to catalog
        </TextLink>
      </View>
    );
  }

  return (
    <View testID="page-catalog-item">
      <View testID="breadcrumb" style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <TextLink to="/catalog">Catalog</TextLink>
        <Text style={{ color: colors.muted }}>/</Text>
        <Text style={{ color: colors.text }}>{entry.name}</Text>
      </View>

      <H1 testID="item-name">{entry.name}</H1>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Badge>{entry.category}</Badge>
        <Text testID="item-price" style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
          {`$${entry.price.toFixed(2)}`}
        </Text>
      </View>
      <P testID="item-blurb">{entry.blurb}</P>

      <TextLink to="/catalog" testID="back-to-catalog">
        ← Back to catalog
      </TextLink>
    </View>
  );
}
