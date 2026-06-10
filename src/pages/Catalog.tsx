import { useState } from "react";
import { Text, View } from "react-native";
import { CATALOG } from "../data";
import { Badge, Field, H1, Input, P, TextLink } from "../ui";

export default function Catalog() {
  const [query, setQuery] = useState("");
  const filtered = CATALOG.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View testID="page-catalog">
      <H1>Catalog</H1>
      <P muted>Click an item to open its nested detail route.</P>

      <Field>
        <Input testID="catalog-search" value={query} onChangeText={setQuery} placeholder="Filter by name…" />
      </Field>

      <View testID="catalog-list" style={{ gap: 8 }}>
        {filtered.map((e) => (
          <View key={e.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TextLink to={`/catalog/${e.id}`} testID={`catalog-link-${e.id}`}>
              {e.name}
            </TextLink>
            <Badge>{e.category}</Badge>
          </View>
        ))}
        {filtered.length === 0 ? (
          <Text testID="catalog-empty" style={{ opacity: 0.7 }}>
            {`No items match “${query}”.`}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
