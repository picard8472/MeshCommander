# MeshCommander

Mac OS X application to manage computers with Intel AMT technology (vPro)

## Build a macOS Apple silicon DMG

A DMG is created with `hdiutil`, so the build has to run on macOS. The
resulting application targets arm64 (Apple silicon).

Requirements:

- macOS with Xcode Command Line Tools (`xcode-select --install`)
- Node.js 20 or later

Build the application and DMG:

```sh
npm install
./mkapp
```

`./mkapp` downloads NW.js for `osx-arm64`, builds `MeshCommander.app`, and
writes `build/MeshCommander-arm64.dmg`. The app is ad-hoc signed by default so
it runs on Apple silicon. To sign with a Developer ID certificate instead:

```sh
MAC_SIGN_IDENTITY="Developer ID Application: Your Name (TEAMID)" ./mkapp
```

The same build runs on an Apple silicon GitHub Actions runner; the DMG is
uploaded as a workflow artifact. See `.github/workflows/build-dmg.yml`.

> A DMG downloaded from the internet is quarantined by Gatekeeper. Ad-hoc
> signing is fine for local use, but distribution requires Developer ID signing
> and notarization.

[ [ Download ] ](https://github.com/picard8472/MeshCommander/releases/latest)
