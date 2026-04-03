# Day 04 — Android Native Build & Physical Device Setup

**Date:** 2026-04-03
**Project:** [0xSol App](../README.md)
**Status:** Done

---

## Goal for the Day

Days 1–3 ran entirely in Expo Go — a sandboxed environment that hides native code. To integrate the Solana Mobile Wallet Adapter (MWA), which requires deep Android integration (`@solana-mobile/mobile-wallet-adapter-protocol`), we need a **custom development build** running on a real device. That means stepping outside of Expo Go and into the full Android toolchain.

---

## Why a Native Build?

The Solana Mobile Wallet Adapter protocol was designed by the Solana Mobile team (Saga phone). The Android SDK (`@solana-mobile/mobile-wallet-adapter-protocol`) uses native Android intents to communicate with wallet apps on the device. Expo Go sandboxes native modules — it can't run MWA. A custom dev build with the `android/` folder present is the minimum requirement to test wallet connection, signing, and transactions on a real device.

---

## What We Did

### Step 1 — Install JDK 17

```bash
sudo apt install openjdk-17-jdk
```

React Native compiles native Android code using Gradle, which requires Java 17. Earlier JDK versions cause build failures with modern `build-tools`.

---

### Step 2 — Download Android CLI Tools

Downloaded the **"Command line tools only"** zip from Google — not the full Android Studio. Extracted into `~/Android/Sdk/cmdline-tools/latest/`.

This gives `sdkmanager` and `adb` without the ~10 GB IDE overhead. Everything the Gradle build needs can be pulled through `sdkmanager`.

---

### Step 3 — Set Environment Variables

Added to `~/.bashrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Without these, Gradle can't locate the SDK and `adb` isn't on the path.

---

### Step 4 — Install SDK Packages

```bash
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

| Package | Purpose |
|---------|---------|
| `platform-tools` | Provides `adb` for device communication |
| `platforms;android-34` | Android 14 SDK — the target API level |
| `build-tools;34.0.0` | `aapt`, `dx`, `zipalign` — tools Gradle calls during compilation |

---

### Step 5 — Enable Developer Mode on Redmi 7S

On Xiaomi (MIUI), the unlock sequence is different from stock Android:

- **Settings → About Phone → tap MIUI Version 7 times** (not Build Number — that opens CIT on Xiaomi)
- Developer Options appear → enable:
  - USB Debugging
  - Install via USB
  - USB Debugging (Security Settings)

The third option (`USB Debugging (Security Settings)`) is a Xiaomi-specific setting that allows ADB to push commands that affect the file system, which is needed for `adb install`.

---

### Step 6 — Connect Phone via USB

Plugged in the device. The phone showed a prompt: **"Allow USB debugging?"** → tapped Allow.

Verified the connection:

```bash
adb devices
# List of devices attached
# XXXXXXXX  device   ← "device" means authorized and ready
```

`unauthorized` means the prompt wasn't accepted. `offline` means USB mode is wrong (set to File Transfer, not Charging/MTP).

---

### Step 7 — Add Android Package Name

Added to `app.config.ts`:

```ts
android: {
  package: "com.x0xsolapp",
}
```

Expo's `prebuild` needs a unique reverse-DNS package identifier to generate the native `AndroidManifest.xml`. Without it, prebuild fails validation.

---

### Step 8 — Generate Native Android Folder

```bash
npx expo prebuild --platform android
```

This created the `android/` directory — the full Gradle project with `build.gradle`, `AndroidManifest.xml`, and Kotlin source files. Previously this was managed invisibly by Expo Go. From this point on, the native layer is under our control.

---

### Step 9 — Build the APK

```bash
npx expo run:android
```

Gradle downloaded dependencies and compiled everything into an APK. First build took ~12 minutes. Subsequent builds are faster due to Gradle's incremental build cache.

Build succeeded. Install step failed — Xiaomi's system blocked sideloading via `adb install` directly from `expo run:android`.

---

### Step 10 — Manual APK Install

```bash
adb install ~/Desktop/react-native/0xSolApp/android/app/build/outputs/apk/debug/app-debug.apk
```

Since **Install via USB** was already enabled in Developer Options, the direct `adb install` call succeeded where the automated install from Expo CLI had failed. The app appeared on the home screen.

---

### Step 11 — Connect Metro via USB Tunnel

```bash
adb reverse tcp:8081 tcp:8081
```

This forwards `localhost:8081` on the phone through the USB cable to `localhost:8081` on the laptop where Metro is running. Without this, the app launches but hangs on the loading screen — it can't reach the JS bundle because the phone and laptop are on the same Wi-Fi but Metro isn't bound to a reachable IP by default.

USB tunneling is more reliable than Wi-Fi for dev — no firewall issues, no IP changes, consistent latency.

---

### Step 12 — Run Dev Server and Open App

```bash
npx expo start --dev-client
```

Opened the app on the phone. It connected to Metro over the USB tunnel and loaded the full app with hot reload working.

---

## What We Now Have

A **custom development build** running on a physical Android device over USB:

- Edit code → save → hot reload on the phone, same as Expo Go
- Full native module support — `android/` folder is present and editable
- `adb` connected and verified
- Metro tunneled over USB for stable, fast bundling

This is the foundation needed for MWA integration. Expo Go could not run MWA because it lacks the native Android intent infrastructure. This build has it.

---

## Architecture Change After Day 4

```
Before Day 4:
  Expo Go (managed)     → no android/ folder, no native modules

After Day 4:
  Custom dev build      → android/ folder present, full native access
  Physical device       → Redmi 7S connected via USB
  Metro                 → tunneled via adb reverse tcp:8081 tcp:8081
```

No application code changed today — this was pure infrastructure work.

---

## What's Next

The native build is in place. The next phase is wallet integration:

| Feature | Package |
|---------|---------|
| Wallet connection (MWA) | `@solana-mobile/mobile-wallet-adapter-protocol` |
| Read connected wallet balance | `@solana/web3.js` |
| Fetch wallet transactions | `@solana/web3.js` |
| Send SOL | `@solana/web3.js` + MWA signing |
| Sign and send transactions | MWA `transact()` |

MWA works by broadcasting an Android intent that wallet apps (Phantom, Solflare) on the same device can respond to. The wallet handles key management and signing — our app never touches the private key.

---

## Learnings

- **Expo Go vs custom dev build.** Expo Go is a pre-built shell that loads your JS bundle. It's fast to start but can't run arbitrary native code. `expo prebuild` ejects you into the full Gradle world — slower setup, but no native module restrictions.
- **Xiaomi Developer Options unlock is different.** On MIUI you tap **MIUI Version**, not **Build Number**. Tapping Build Number opens a hardware test menu (CIT). This trips up most standard Android guides.
- **`USB Debugging (Security Settings)` is a hidden Xiaomi gate.** Even with standard USB Debugging on, `adb install` can be blocked. The third security-specific toggle must also be enabled. Without it, the install fails silently or with a permission error.
- **`adb reverse` is the correct tunneling direction for dev.** `adb forward` sends laptop → phone. `adb reverse` sends phone → laptop. The app runs on the phone and needs to reach Metro on the laptop, so `reverse` is correct. It's easy to mix these up.
- **First Gradle build is slow by design.** Gradle downloads the full dependency graph (React Native, Expo modules, etc.) on first run. The `.gradle` cache means subsequent builds are much faster — don't cancel it thinking it's stuck.
- **`prebuild` is a one-way door per config change.** Every time you change `app.config.ts` native fields (package name, permissions, plugins), you need to re-run `prebuild`. Treat the `android/` folder as generated output — don't hand-edit it unless you know what you're doing.

---

## Summary

| What | How |
|------|-----|
| JDK 17 | `sudo apt install openjdk-17-jdk` |
| Android SDK | CLI tools only, extracted to `~/Android/Sdk/cmdline-tools/latest/` |
| SDK packages | `sdkmanager` — `platform-tools`, `platforms;android-34`, `build-tools;34.0.0` |
| Developer Mode (Xiaomi) | Tap MIUI Version 7×, enable USB Debugging + Install via USB + security setting |
| Native folder | `npx expo prebuild --platform android` |
| APK build | `npx expo run:android` (~12 min first build) |
| Manual install | `adb install .../app-debug.apk` (bypassed Xiaomi sideload block) |
| Metro tunnel | `adb reverse tcp:8081 tcp:8081` |
| Dev server | `npx expo start --dev-client` |

---

[← Day 03](day-03.md) | [Back to README](../README.md)
