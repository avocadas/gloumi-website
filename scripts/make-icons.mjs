/**
 * Favicon set from the app's real icon.
 *
 * Source: public/brand/gloumi-mark.svg, copied from the mobile app
 * (gloumi-app/assets/Gloumi-icon-light-default.svg). Everything below is
 * derived from it, so the browser tab, the iOS home screen and the manifest
 * all show the same mark as the app itself.
 *
 *   node scripts/make-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const svg = readFileSync(join(root, 'public/brand/gloumi-mark.svg'));

const png = (size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();

/** ICO container around PNG frames – valid since Windows Vista, read by every browser. */
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = 6 + 16 * frames.length;
  const entries = frames.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...frames.map((f) => f.buf)]);
}

const targets = {
  'src/app/icon.png': 48,
  'src/app/apple-icon.png': 180,
  'public/icons/icon-192.png': 192,
  'public/icons/icon-512.png': 512,
};

for (const [rel, size] of Object.entries(targets)) {
  writeFileSync(join(root, rel), await png(size));
  console.log('wrote', rel, `${size}px`);
}

const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, buf: await png(size) });
writeFileSync(join(root, 'src/app/favicon.ico'), ico(frames));
console.log('wrote src/app/favicon.ico', frames.map((f) => f.size).join('/'));
