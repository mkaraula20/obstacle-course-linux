import { StrictMode } from "react";
import { AppRegistry } from "react-native";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./theme";
import "./index.css";

// HashRouter (not BrowserRouter) so deep links work identically in the browser,
// in the Tauri desktop webview, and on mobile — none of them need a server that
// rewrites paths to index.html.
function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </StrictMode>
  );
}

// AppRegistry is the React Native entry point. react-native-web's
// runApplication mounts it into the DOM and sets up the root styling so the
// same bootstrap works on web today and on native mobile later.
AppRegistry.registerComponent("ObstacleCourse", () => Root);
AppRegistry.runApplication("ObstacleCourse", {
  rootTag: document.getElementById("root"),
});
