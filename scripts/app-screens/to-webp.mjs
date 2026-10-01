#!/usr/bin/env node
/**
 * Turns the emulator shots into the images the hero phone imports.
 *
 *   node scripts/app-screens/to-webp.mjs
 *
 * Reads <temp>/gloumi-app-screens/shots/{lt,en}/{feed,search,profile,booking}.png
 * (1080 x 2340 from the Pixel_5 emulator) and writes src/assets/app-screens.
 * All eight or nothing: a half-replaced set would show two app versions side by side.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHOTS = path.join(os.tmpdir(), 'gloumi-app-screens', 'shots');
const OUT = path.join(SITE, 'src', 'assets', 'app-screens');
const LANGS = ['lt', 'en'];
const SCREENS = ['feed', 'search', 'profile', 'booking'];

const missing = LANGS.flatMap((lang) =>
  SCREENS.map((name) => path.join(SHOTS, lang, `${name}.png`)).filter((file) => !fs.existsSync(file))
);
if (missing.length) {
  console.error(`Missing shots:\n${missing.join('\n')}`);
  process.exit(1);
}

for (const lang of LANGS) {
  fs.mkdirSync(path.join(OUT, lang), { recursive: true });
  for (const name of SCREENS) {
    const info = await sharp(path.join(SHOTS, lang, `${name}.png`))
      .resize(900)
      .webp({ quality: 90, effort: 6 })
      .toFile(path.join(OUT, lang, `${name}.webp`));
    console.log(`${lang}/${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}
