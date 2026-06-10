import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed port and looks at the TAURI_* env vars during dev/build.
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // The UI is written in React Native primitives; `react-native-web` maps them
  // to the DOM so the exact same component tree renders in the browser, in the
  // Tauri desktop webview, and (later) on native mobile.
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js"],
  },
  define: {
    // react-native-web references these globals.
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    global: "window",
  },
  optimizeDeps: {
    include: ["react-native-web"],
  },

  // Tauri reads this; build output goes to ./dist which Tauri bundles.
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 5183 } : undefined,
    watch: {
      // Don't watch the Rust source tree.
      ignored: ["**/src-tauri/**"],
    },
  },
});
