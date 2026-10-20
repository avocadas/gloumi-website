// Administratoriaus ilgo slaptažodžio išvedimas ir taisyklė (security 2026-10-20).
// Paleisti: node --test scripts/test-admin-password.mjs (Node 24 TypeScript skaito pats).
import { test } from "node:test";
import assert from "node:assert/strict";
import { forGoTrue } from "../src/lib/admin-password.ts";
import { isStrongAdminPassword } from "../src/lib/password-rule.ts";

const strong = (n) => ("Ab1!cdEFgh" + "ijklmnopqrstuvwxyz0123456789").repeat(20).slice(0, n);

test("72 baitai – nekeičiama", () => {
  const p = strong(72);
  assert.equal(Buffer.byteLength(p), 72);
  assert.equal(forGoTrue(p), p);
});

test("73 baitai – išvestinis, 47 ženklai, su priešdėliu", () => {
  const d = forGoTrue(strong(73));
  assert.equal(d.length, 47);
  assert.ok(d.startsWith("Gl1."));
  assert.ok(!d.includes("\u0000"));
});

test("lietuviška raidė: 72 baitai su dvibaitėmis – vis dar nekeičiama, 73 – išvesta", () => {
  const p = "ą".repeat(36);
  assert.equal(Buffer.byteLength(p), 72);
  assert.equal(forGoTrue(p), p);
  assert.notEqual(forGoTrue(p + "a"), p + "a");
});

test("NFC ir NFD duoda tą patį išvestinį", () => {
  const base = strong(70) + "ėęą";
  const nfc = base.normalize("NFC");
  const nfd = base.normalize("NFD");
  assert.notEqual(nfc, nfd);
  assert.equal(forGoTrue(nfc), forGoTrue(nfd));
});

test("skirtingi slaptažodžiai – skirtingi išvestiniai", () => {
  assert.notEqual(forGoTrue(strong(100)), forGoTrue(strong(101)));
});

test("NFD lietuviškos raidės be simbolio – atmesta (jungiamasis ženklas nėra simbolis)", () => {
  const p = "Ąčęėįšųūž1234Abc".normalize("NFD");
  assert.equal(isStrongAdminPassword(p), false);
  assert.equal(isStrongAdminPassword(p + "!"), true);
});

test("ta pati frazė NFC ir NFD ties 72 B riba – tuo pačiu keliu", () => {
  const nfc = (strong(55) + "ąčęėįšųū").normalize("NFC"); // 55 + 16 = 71 B NFC
  const nfd = nfc.normalize("NFD");
  assert.ok(Buffer.byteLength(nfc) <= 72 && Buffer.byteLength(nfd) > 72);
  assert.equal(forGoTrue(nfc), nfc);
  // NFD eina tuo pačiu, trumpuoju keliu – nekeičiamas, kaip ir iki šiol.
  assert.equal(forGoTrue(nfd), nfd);
  const longNfc = (strong(60) + "ąčęėįšųū").normalize("NFC"); // 76 B NFC
  assert.equal(forGoTrue(longNfc), forGoTrue(longNfc.normalize("NFD")));
});

test("80 „a“ ir 80 „1“ – atmesta; stiprus ilgas – priimtas", () => {
  assert.equal(isStrongAdminPassword("a".repeat(80)), false);
  assert.equal(isStrongAdminPassword("1".repeat(80)), false);
  assert.equal(isStrongAdminPassword("Aa1!".repeat(20)), false); // tik 4 skirtingi
  assert.equal(isStrongAdminPassword(strong(150)), true);
});
