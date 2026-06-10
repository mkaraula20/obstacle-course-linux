# 🏁 Obstacle Course — React Native + Tauri + Expo + Playwright

One **React Native** codebase that runs three ways:

- **Web** — via [react-native-web](https://necolas.github.io/react-native-web/) (Vite build).
- **Desktop** (Windows x64, Windows ARM, macOS ARM, Debian) — Tauri 2 embeds the web build.
- **Native iOS/Android** — the same components rendered as native views via Expo.

It also doubles as a **Playwright obstacle course** for exercising the
interactions Playwright is most often used to test.

The UI is written entirely in React Native primitives — `View`, `Text`,
`Pressable`, `TextInput`, `ScrollView`, `ActivityIndicator`. On web, `react-native-web`
maps those to the DOM (the `dist/` bundle the Tauri desktop shell embeds); on
mobile, Expo/Metro bundles the real `react-native`. The few platform differences
(routing, storage, the entry point) are split into `.ts` / `.native.tsx` files —
see [How web and native share code](#how-web-and-native-share-code).

---

## Point your tests at it

**Live web app:** <https://mkaraula01.github.io/obstacle-course/>

That's the easiest way to use it — no clone, no install. Aim any web automation
framework at the URL and start writing tests against the stations below. Every
interactive element has a stable `data-testid` (and accessible roles), so
selectors are identical across tools:

```js
// Playwright
await page.goto("https://mkaraula01.github.io/obstacle-course/");
await page.getByTestId("nav-forms").click();

// Cypress
cy.visit("https://mkaraula01.github.io/obstacle-course/");
cy.get('[data-testid="nav-forms"]').click();

// Selenium / WebdriverIO / Puppeteer / TestCafe — same URL, same data-testids
```

Routes are hash-based (`/#/forms`, `/#/catalog/gizmo`), so deep links work
without any server config.

**Run your own instance** (to modify the app, or test offline/CI):

```bash
git clone https://github.com/mkaraula01/obstacle-course.git
cd obstacle-course && npm install
npm run build && npm run preview   # → http://localhost:4173
# or: npm run dev                   # → http://localhost:5173 (hot reload)
```

**Mobile & desktop builds** (for Appium, desktop automation, or native use) are
attached to each [GitHub Release](https://github.com/mkaraula01/obstacle-course/releases):
the Android **`.apk`** (install with `adb install app-debug.apk`) and the macOS
**`.dmg`**. See [native mobile](#build-the-native-mobile-apps-expo) to build them
yourself.

---

## Stack

| Layer        | Tool                                  | Role                                            |
| ------------ | ------------------------------------- | ----------------------------------------------- |
| UI           | React Native primitives               | Components written once in RN (`View`/`Text`/…) |
| Web target   | react-native-web + React Router       | Maps RN → DOM; multi-level navigation           |
| Web build/dev| Vite + TypeScript                     | Dev server + bundles UI into `dist/`            |
| Desktop shell| Tauri 2 (Rust)                        | Wraps `dist/` into desktop apps                 |
| Native mobile| Expo SDK 52 + Metro                   | Bundles the RN components for iOS/Android       |
| Testing      | Playwright                            | The obstacle-course test suite (web)            |

On the web build, `react-native` is aliased to `react-native-web` in
[`vite.config.ts`](vite.config.ts); on native, Metro uses the real
`react-native`. Either way every component imports from `"react-native"`.

---

## Project layout

```
obstacle-course/
├── index.html              # Vite (web) entry
├── index.js                # Expo (native) entry → registerRootComponent(App.native)
├── vite.config.ts          # aliases react-native → react-native-web; builds to dist/
├── app.json                # Expo config (name, bundle id, package)
├── babel.config.cjs        # babel-preset-expo (Metro)
├── metro.config.cjs        # Expo Metro config
├── playwright.config.ts    # 5 projects: chromium/firefox/webkit + 2 mobile
├── src/                     # the React Native app (UI shared by web + native)
│   ├── main.tsx             #   web entry: AppRegistry bootstrap (react-native-web)
│   ├── App.tsx              #   web shell: react-router routes + sidebar/topbar/footer
│   ├── App.native.tsx       #   native shell: stack router + drawer/topbar/footer
│   ├── routing.ts /.native.tsx   # useNavigate/useParams — react-router vs in-app stack
│   ├── storage.ts /.native.ts    # persistence — localStorage vs AsyncStorage
│   ├── theme.tsx            #   light/dark palette + useTheme()
│   ├── ui.tsx               #   shared RN primitives (Button, Card, Field, Input, …)
│   ├── modal.tsx            #   root overlay host (so position:"fixed" hits the viewport)
│   ├── pages/               #   the 5 obstacle-course stations + 404
│   ├── data.ts              #   catalog fixture data
│   └── types/react-native.ts     # paths-mapped RN types for tsc (both targets)
├── tests/
│   └── obstacle-course.spec.ts   # 20 tests across all stations (web)
├── ios/ · android/          # generated by `expo prebuild` (git-ignored)
└── src-tauri/               # the desktop shell
    ├── tauri.conf.json      #   window, bundle targets, identifier
    ├── Cargo.toml           #   lib (mobile) + bin (desktop)
    └── src/{main,lib}.rs     #   one entry point
```

---

## The obstacle course

Every interactive element has a stable `testID` (React Native's prop, which
react-native-web renders as `data-testid` on web). Stations:

1. **Home** — landing tiles linking to each station.
2. **Forms** — text/email/number `TextInput`s, a segmented **plan picker**, a
   **radio group** and a **checkbox** (all accessible `Pressable`s, since RN has
   no native form controls), a multiline bio, client-side validation,
   submit/reset, JSON result.
3. **Async** — spinner (`ActivityIndicator`) → loaded result, an error path, and
   delayed-appearance content (teaches *wait for state, not for time*).
4. **Interactions** — modal dialog (confirm/cancel), tabs, accordion, hover
   tooltip, **list reorder via move controls**, add/remove dynamic list.
5. **Catalog** — list → **nested route with a URL param** (`/catalog/:id`),
   breadcrumb, search filter with empty state.
6. **Settings** — counter, toggle switch, volume field, all **persisted to
   localStorage** (survives reload).
7. Plus a **theme toggle** (light/dark) and a **404** route.

### React Native vs. the original web obstacles

A faithful RN rewrite has no native HTML form semantics, so a few stations use
RN-idiomatic controls instead — and the matching tests drive them by click
rather than the native Playwright helpers:

| Original web control        | React Native equivalent             | Test change                         |
| --------------------------- | ----------------------------------- | ----------------------------------- |
| `<select>` + `selectOption` | segmented `Pressable` group         | click `plan-pro`                    |
| checkbox/radio + `.check()` | accessible `Pressable`s             | `.click()`                          |
| toggle + `.uncheck()`       | `Pressable` switch                  | `.click()`                          |
| HTML5 drag-and-drop reorder | move-up/down controls (mobile norm) | click `move-up-dates`               |
| `<input type="range">`      | numeric `TextInput`                 | unchanged — `.fill("75")` still works |

The hover tooltip remains a deliberate "hard" obstacle (pointer-only); the test
auto-skips on touch devices. See the comments in
`tests/obstacle-course.spec.ts`.

---

## Prerequisites

- **Node.js ≥ 18** and npm — drives the web app + tests.
- **Rust** — only needed to build the native desktop/mobile bundles. Install:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
  Then restart your shell so `cargo` is on PATH.
- Plus the platform toolchains listed per-target below.

```bash
npm install
```

---

## Run the web app

```bash
npm run dev        # dev server with hot reload  → http://localhost:5173
npm run build      # type-check + bundle to dist/
npm run preview    # serve the production build  → http://localhost:4173
```

**Deploying the web app** = serving the static `dist/` folder on any host
(Netlify, Vercel, S3, nginx…). The app uses `HashRouter`, so deep links work
without any server-side rewrite rules.

---

## Run the Playwright obstacle course

```bash
npx playwright install     # one-time: download the browser engines
npm test                   # run all projects headless (builds + previews first)
npm run test:headed        # watch it drive a real browser
npm run test:ui            # interactive UI mode
npm run test:report        # open the last HTML report
```

`playwright.config.ts` runs five projects — **chromium, firefox, webkit,
mobile-chrome (Pixel 5), mobile-safari (iPhone 13)** — so you see the same
suite behave across desktop and mobile emulation. The hover test auto-skips on
touch devices.

> Verified locally: **98 pass + 2 skip across all five projects** (the hover
> test is pointer-only and skips on the two mobile projects). Run
> `npx playwright install firefox webkit` first if you haven't.

---

## Build the native apps (Tauri)

Tauri auto-detects icons; generate them once from any square PNG:

```bash
npm run tauri icon path/to/icon.png   # writes src-tauri/icons/*
```

Run the desktop app in dev (hot-reloads the UI):

```bash
npm run tauri:dev
```

### Desktop targets

`npm run tauri:build` builds for the **host** machine. Cross-OS bundles must be
built on (or CI runners of) that OS — you cannot build a `.deb` from macOS.

| Target                | Build on  | Command                                                                  | Output                          |
| --------------------- | --------- | ------------------------------------------------------------------------ | ------------------------------- |
| **macOS ARM**         | macOS     | `npm run tauri:build -- --target aarch64-apple-darwin`                   | `.app`, `.dmg`                  |
| **Windows x86-64**    | Windows   | `npm run tauri:build -- --target x86_64-pc-windows-msvc`                 | `.exe`, `.msi`                  |
| **Windows ARM**       | Windows   | `npm run tauri:build -- --target aarch64-pc-windows-msvc`               | `.exe`, `.msi`                  |
| **Debian (.deb)**     | Debian/Ubuntu | `npm run tauri:build -- --target x86_64-unknown-linux-gnu`          | `.deb`, `.AppImage`             |

For a single macOS DMG that runs on both Intel and Apple Silicon:
```bash
rustup target add x86_64-apple-darwin
npm run tauri:build -- --target universal-apple-darwin
```

Add a Rust target before first use, e.g.:
```bash
rustup target add aarch64-apple-darwin
```

**Per-OS system deps:**
- **macOS** — Xcode Command Line Tools (`xcode-select --install`).
- **Windows** — Microsoft C++ Build Tools + WebView2 (preinstalled on Win 10/11).
  For Windows-on-ARM, install the ARM64 MSVC toolchain.
- **Debian/Ubuntu** —
  ```bash
  sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev \
    build-essential curl wget file libxdo-dev libssl-dev \
    libayatana-appindicator3-dev librsvg2-dev
  ```

---

## Build the native mobile apps (Expo)

iOS and Android render the **same `src/` React Native components natively** (not
in a webview) via **Expo SDK 52** + Metro. This is a *separate pipeline* from the
Vite/Tauri web+desktop build — they share the component tree but use different
bundlers and entry points (see [How web and native share code](#how-web-and-native-share-code)).

```bash
npm start            # Metro dev server (Expo) — open in a simulator/emulator
npm run ios          # expo run:ios     → build + launch in the iOS Simulator
npm run android      # expo run:android → build + launch in an Android emulator
```

`expo run:*` generates the native project (`expo prebuild` → `ios/` + `android/`,
both git-ignored and regenerable), installs pods/Gradle deps, compiles, and
launches. The first build is slow (compiles Hermes + native deps).

**Prerequisites — these are large, one-time toolchain installs:**

- **iOS** (macOS only):
  - Xcode + the **iOS platform components** (Xcode → Settings → Components, or
    `xcodebuild -downloadPlatform iOS`). A clean Xcode without the iOS
    platform/simulator runtime can't build — you'll see *"iOS NN.N is not
    installed."*
  - **CocoaPods** — `brew install cocoapods`.
- **Android:**
  - **Android Studio + SDK + NDK**, with `ANDROID_HOME` (and `JAVA_HOME`) set.
    Without the SDK, `expo run:android` cannot build.

For distributable/store builds without local toolchains, use
[EAS Build](https://docs.expo.dev/build/introduction/) (`eas build -p ios|android`).

---

## How web and native share code

One `src/` UI, two bundlers. Platform-specific files let each pipeline pick the
right implementation of the few things that differ:

| Concern    | Web (Vite/Tauri)                | Native (Expo/Metro)           |
| ---------- | ------------------------------- | ----------------------------- |
| Entry      | `index.html` → `main.tsx` (`AppRegistry` + react-native-web) | `index.js` → `App.native.tsx` (`registerRootComponent`) |
| `react-native` | aliased to `react-native-web` (vite.config.ts) | the real `react-native` (Metro) |
| Routing    | `routing.ts` → react-router-dom | `routing.native.tsx` → in-app stack router |
| Storage    | `storage.ts` → `localStorage`   | `storage.native.ts` → AsyncStorage |
| Modal/`fixed` | root overlay host + `position:"fixed"` | same host + `position:"absolute"` |

The shared pages import `useNavigate`/`useParams` from `./routing` and `storage`
from `./storage`; Vite resolves the `.ts` file, Metro resolves the `.native.tsx`
file. tsc type-checks against the permissive RN shim (`src/types/react-native.ts`,
wired via `compilerOptions.paths`) so the web-only style values still pass.

- **Web + desktop:** one UI source → one `dist/` bundle; the web app serves it
  directly and the Tauri desktop shell embeds the same `dist/`
  (`frontendDist: "../dist"`). `HashRouter` + `localStorage` behave identically
  in browser and webview.
- **Native:** the same components, compiled to native views by Expo.
