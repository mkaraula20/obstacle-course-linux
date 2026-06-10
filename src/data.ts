export interface CatalogEntry {
  id: string;
  name: string;
  category: string;
  price: number;
  blurb: string;
}

export const CATALOG: CatalogEntry[] = [
  { id: "widget", name: "Widget", category: "Hardware", price: 9.99, blurb: "A dependable all-purpose widget." },
  { id: "gizmo", name: "Gizmo", category: "Hardware", price: 14.5, blurb: "The gizmo that does the thing." },
  { id: "doohickey", name: "Doohickey", category: "Accessories", price: 4.25, blurb: "Small, but mighty." },
  { id: "contraption", name: "Contraption", category: "Machines", price: 129.0, blurb: "Industrial-grade contraption." },
];
