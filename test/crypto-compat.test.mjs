import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
require("../source/crypto-compat.js");
const crypto = require("node:crypto");

// Ciphertext produced by Node 20's crypto.createCipher("aes-256-ctr", password)
// for the plaintext below. MeshCommander stores its computer list in this format.
const password = "ab".repeat(256);
const plaintext = '[{"host":"192.0.2.1","user":"admin"}]';
const legacyCiphertext =
  "157d0f08be7e451ecd22b7423fc088cda43e2b4481585b15e9287a59d3b0081f23b9914516";

test("legacy crypto.createCipher output stays readable", () => {
  assert.equal(typeof crypto.createCipher, "function");
  const cipher = crypto.createCipher("aes-256-ctr", password);
  const ciphertext =
    cipher.update(plaintext, "utf8", "hex") + cipher.final("hex");
  assert.equal(ciphertext, legacyCiphertext);
});

test("legacy crypto.createDecipher reads stored computer lists", () => {
  assert.equal(typeof crypto.createDecipher, "function");
  const decipher = crypto.createDecipher("aes-256-ctr", password);
  const decrypted =
    decipher.update(legacyCiphertext, "hex", "utf8") +
    decipher.final("utf8");
  assert.equal(decrypted, plaintext);
});
