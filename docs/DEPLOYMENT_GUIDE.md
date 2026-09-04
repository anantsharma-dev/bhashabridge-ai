# BhashaBridge AI — Production Android & Tablet Deployment Guide

This guide details the complete build, packaging, and deployment process for **BhashaBridge AI (Version 1.0)** targeting Grade 1–5 MTB-MLE classroom tablets across Jharkhand.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **Android Studio**: Iguana (2023.2.1) or newer
- **Android SDK**: API Level 34 (Android 14) with minimum SDK API Level 24 (Android 7.0 Nougat)
- **Java**: OpenJDK 17

---

## 2. Web Application Build Validation

Before building the Android wrapper, verify that the TypeScript and Vite production bundle compiles cleanly with 0 errors:

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript strict type-check & Vite build
npm run build
```

This generates minified production assets inside the `/dist` directory.

---

## 3. Capacitor Native Android Sync

BhashaBridge AI uses Capacitor to bundle the offline-first web application into a native Android APK:

```bash
# 1. Sync web assets into Android project
npx cap sync android

# 2. Open Android Studio
npx cap open android
```

---

## 4. Android Permissions & Configuration

The Android configuration is defined in [`android/app/src/main/AndroidManifest.xml`](file:///C:/Users/Anant/bhashabridge-ai/android/app/src/main/AndroidManifest.xml):

* `android.permission.RECORD_AUDIO`: Required for speech recognition (Whisper / Web Speech API) in Voice Translation and pronunciation coaching.
* `android.permission.MODIFY_AUDIO_SETTINGS`: Required for Piper Neural TTS audio playback.
* `android.permission.INTERNET` & `ACCESS_NETWORK_STATE`: Used for differential sync with the CRC Dumka cloud hub.
* `android.permission.WRITE_EXTERNAL_STORAGE`: Used to cache offline curriculum packs and Piper voice models.

---

## 5. Tablet Optimization Specifications

* **Supported Resolutions**: 1024x600, 1280x800, 1920x1200, 2560x1600.
* **Orientation Support**: Dual landscape (classroom desk view) and portrait (storybook reading mode).
* **High Contrast**: Outdoor daylight high-contrast mode ensures clear visibility in sunlight.

---

## 6. Building Signed Production APK

Inside Android Studio or via Gradle command line:

```bash
cd android
./gradlew assembleRelease
```

The compiled release APK will be located at:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

Sign with your state education keystore using `apksigner`:

```bash
apksigner sign --ks jcert-release-key.jks --out bhashabridge-ai-v1.0.apk app-release-unsigned.apk
```

---

## 7. Offline Asset Pre-loading

To ensure 100% offline functionality in villages with zero cellular coverage:
1. Place Piper voice models (`piper-santali-v1.onnx`) inside `public/models/`.
2. Pre-cache JCERT Grade 1–5 curriculum packs during tablet provisioning at the District Resource Center.
