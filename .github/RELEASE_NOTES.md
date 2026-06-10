## Obstacle Course — downloads

A React Native app for practicing QA automation — the same UI on web, desktop, and mobile.

**Prefer no download?** Use the hosted web app: <https://mkaraula01.github.io/obstacle-course/> (point any web framework at it).

### Android — `app-debug.apk`
Install on a device or emulator:
```bash
adb install app-debug.apk
```
Ideal for Appium / mobile automation.

### Windows — `*-setup.exe` (installer) or `*.msi`
Two architectures are attached — pick the one matching the PC:
- **`*_x64-setup.exe` / `*_x64_*.msi`** — Intel/AMD 64-bit (most PCs)
- **`*_arm64-setup.exe` / `*_arm64_*.msi`** — Windows on ARM (e.g. Snapdragon, Surface Pro X)

The app is unsigned, so **Windows SmartScreen** may show "Windows protected your PC." Click **More info → Run anyway**. (WebView2 is required; it's preinstalled on Windows 10/11, and the installer fetches it if missing.)

### macOS — `Obstacle Course_*.dmg` (Apple Silicon / aarch64)
The app is ad-hoc signed but **not** Apple-notarized, so on first launch macOS may say it is **"damaged."** It is not — that's Gatekeeper blocking an un-notarized download. To unlock it: drag **Obstacle Course.app** into `/Applications`, then run once in Terminal:
```bash
xattr -dr com.apple.quarantine "/Applications/Obstacle Course.app"
```
Then open it normally.
