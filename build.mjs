import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import nwbuild from "nw-builder";

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  await readFile(path.join(root, "source", "package.json"), "utf8"),
);

/*
 * NW.js 0.77.0 is the first release with an osx-arm64 build, but older
 * runtimes abort at launch on macOS 26 and later. Use a current release.
 * Sign ad-hoc by default so the app runs on Apple silicon.
 */
await nwbuild({
  mode: "package",
  version: process.env.NW_VERSION ?? "0.119.2",
  flavor: "normal",
  platform: "osx",
  arch: "arm64",
  srcDir: path.join(root, "source"),
  outDir: path.join(root, "build", "app"),
  cacheDir: path.join(root, "cache"),
  glob: false,
  app: {
    name: "MeshCommander",
    icon: path.join(root, "files", "nw.icns"),
    CFBundleIdentifier: "com.insynergy.MeshCommander",
    CFBundleName: "MeshCommander",
    CFBundleDisplayName: "MeshCommander",
    CFBundleSpokenName: "MeshCommander",
    LSApplicationCategoryType: "public.app-category.utilities",
    CFBundleShortVersionString: manifest.version,
    CFBundleVersion: manifest.version,
    NSHumanReadableCopyright: "Copyright Intel Corporation 2022.",
    LSFileQuarantineEnabled: false,
  },
  dmg: {
    volumeName: "MeshCommander",
    signIdentity: process.env.MAC_SIGN_IDENTITY ?? "-",
  },
});
