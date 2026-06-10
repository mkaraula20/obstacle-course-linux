# 🏁 Obstacle Course — Tauri 2 + React + Playwright

One React codebase that ships as a **web app**, **desktop apps** (Windows x64,
Windows ARM, macOS ARM, Debian) and **mobile apps** (iOS, Android), and doubles
as a **Playwright obstacle course** for exercising the interactions Playwright
is most often used to test.

The UI is the *same* on every target: the web build (`dist/`) is what the
desktop and mobile shells embed, so a test that passes in the browser describes
the behaviour users get everywhere.

> **Why not React Native?** React Native renders a *separate* native UI and has
> no web target. Tauri 2 runs a single web frontend inside a native shell on
> every desktop **and** mobile OS, and that same frontend is the web app — which
> is exactly the "identical on all platforms" requirement here.

---

## Stack

| Layer        | Tool                    | Role                                            |
| ------------ | ----------------------- | ----------------------------------------------- |
| UI           | React + React Router    | Components and multi-level navigation           |
| Build/dev    | Vite + TypeScript       | Dev server + bundles UI into `dist/`            |
| Native shell | Tauri 2 (Rust)          | Wraps `dist/` into desktop + mobile apps        |
| Testing      | Playwright              | The obstacle-course test suite                  |

---

## Project layout

```
obstacle-course/
├── index.html              # Vite entry
├── vite.config.ts          # dev server on :5173, builds to dist/
├── playwright.config.ts    # 5 projects: chromium/firefox/webkit + 2 mobile
├── src/                     # the React app (the UI, shared by every platform)
│   ├── App.tsx              #   shell: top bar, sidebar nav, routes, status bar
│   ├── pages/               #   the 5 obstacle-course stations + 404
│   └── data.ts              #   catalog fixture data
├── tests/
│   └── obstacle-course.spec.ts   # 20 tests across all stations
└── src-tauri/               # the native shell
    ├── tauri.conf.json      #   window, bundle targets, identifier
    ├── Cargo.toml           #   lib (mobile) + bin (desktop)
    └── src/{main,lib}.rs     #   one entry point, all platforms
```

---

## The obstacle course

Every interactive element has a stable `data-testid`. Stations:

1. **Home** — landing tiles linking to each station.
2. **Forms** — text/email/number inputs, `<select>`, radio group, checkbox,
   textarea, client-side validation, submit/reset, JSON result.
3. **Async** — spinner → loaded result, an error path, and delayed-appearance
   content (teaches *wait for state, not for time*).
4. **Interactions** — modal dialog (confirm/cancel), tabs, accordion,
   hover tooltip, **native HTML5 drag-and-drop** reorder, add/remove dynamic list.
5. **Catalog** — list → **nested route with a URL param** (`/catalog/:id`),
   breadcrumb, search filter with empty state.
6. **Settings** — counter, toggle, range slider, all **persisted to
   localStorage** (survives reload).
7. Plus a **theme toggle** (light/dark) and a **404** route.

A couple of stations are deliberately "hard" obstacles — native drag-and-drop
and hover — because those are where Playwright compatibility actually bites. See
the comments in `tests/obstacle-course.spec.ts`.

---

## Prerequisites

- **Node.js ≥ 18** and npm — already drives the web app + tests. ✅ (you have this)
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

> Verified locally: **20/20 pass on chromium**, **19 pass + 1 skip on
> mobile-chrome** (hover is pointer-only). For firefox/webkit run
> `npx playwright install firefox webkit` first.

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

### Mobile targets

One-time init, then dev/build:

```bash
# iOS  (macOS + Xcode only)
npm run tauri ios init
npm run tauri ios dev          # run in Simulator
npm run tauri ios build        # .ipa

# Android  (Android Studio + NDK; set ANDROID_HOME, NDK_HOME, JAVA_HOME)
npm run tauri android init
npm run tauri android dev      # run in emulator/device
npm run tauri android build    # .apk / .aab
```

---

## How "same app on all platforms" is guaranteed

- **One UI source** (`src/`) → one bundle (`dist/`).
- The **web app serves `dist/` directly**; the **desktop and mobile shells embed
  the very same `dist/`** (`frontendDist: "../dist"` in `tauri.conf.json`).
- **One Rust entry point** (`src-tauri/src/lib.rs::run`) used by desktop
  (`main.rs`) and mobile (`#[tauri::mobile_entry_point]`).
- **`HashRouter`** + **`localStorage`** behave the same in every webview, so
  routing and persisted state are identical across all seven targets.
