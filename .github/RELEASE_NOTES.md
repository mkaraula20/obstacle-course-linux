## Obstacle Course — downloads

A React Native app for practicing QA automation — the same UI on web, desktop, and mobile.

**Prefer no download?** Use the hosted web app: <https://mkaraula01.github.io/obstacle-course/> (point any web framework at it).

### Android — `app-debug.apk`
Install on a device or emulator:
```bash
adb install app-debug.apk
```
Ideal for Appium / mobile automation.

### Linux (Ubuntu/Debian) — `.deb` (and `.AppImage` when available)
Two architectures: **`_amd64`** (Intel/AMD 64-bit) and **`_arm64`** (ARM). Install the matching `.deb`:
```bash
sudo apt install ./obstacle-course_*_amd64.deb   # or _arm64
```
Or run the portable **AppImage** (no install, no root):
```bash
chmod +x ./*.AppImage && ./*.AppImage
```
Requires WebKitGTK (`libwebkit2gtk-4.1`), preinstalled on most desktop Ubuntu.

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
