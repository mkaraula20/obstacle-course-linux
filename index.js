// Expo (native) entry point. Metro resolves "./src/App" to App.native.tsx on
// ios/android. The web build uses index.html → src/main.tsx instead, and Tauri
// embeds that web build — so the two pipelines never touch this file.
import { registerRootComponent } from "expo";
// Import the native shell explicitly — Metro doesn't reliably prefer a `.native`
// sibling over a plain file for extensionless imports, so we name it directly.
import App from "./src/App.native";

registerRootComponent(App);
