/**
 * Favicon set from the app's real icon.
 *
 * Source: public/brand/gloumi-mark.svg, copied from the app by
 * scripts/gen-from-app.mjs. Everything below is derived from it, so the browser
 * tab, the iOS home screen and the manifest all show the same mark as the app.
 *
 *   node scripts/make-icons.mjs
 *
 * WHICH ICONS GET ROUNDED CORNERS, AND WHY NOT ALL OF THEM
 * -------------------------------------------------------
 * Only the browser-tab icons (favicon.ico, icon.png). A tab draws the file
 * exactly as given, so a square there reads as a square next to every other
 * site's rounded mark.
 *
 * apple-icon and the manifest icons stay square on purpose. iOS clips the home
 * screen icon to its own squircle and Android masks the manifest icon to the
 * launcher's shape; handing them pre-rounded artwork cuts the corners twice and
 * leaves a visible transparent notch inside the platform's own outline.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const svg = readFileSync(join(root, 'public/brand/gloumi-mark.svg'));

/** Corner radius as a share of the icon's width. 22.5% is the macOS/iOS squircle proportion. */
const RADIUS_RATIO = 0.225;

const roundedMask = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${size * RADIUS_RATIO}" ry="${size * RADIUS_RATIO}" fill="#fff"/>` +
      `</svg>`
  );

async function png(size, { rounded = false } = {}) {
  const square = await sharp(svg, { density: 384 }).resize(size, size, { fit: 'cover' }).png().toBuffer();
  if (!rounded) return sharp(square).png({ compressionLevel: 9 }).toBuffer();
  /* `dest-in` keeps the icon only where the mask is opaque, so the corners become transparent. */
  return sharp(square)
    .composite([{ input: roundedMask(size), blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

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
  'src/app/icon.png': { size: 48, rounded: true },
  'src/app/apple-icon.png': { size: 180, rounded: false },
  'public/icons/icon-192.png': { size: 192, rounded: false },
  'public/icons/icon-512.png': { size: 512, rounded: false },
};

for (const [rel, { size, rounded }] of Object.entries(targets)) {
  writeFileSync(join(root, rel), await png(size, { rounded }));
  console.log('wrote', rel, `${size}px`, rounded ? '(rounded)' : '(square)');
}

const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, buf: await png(size, { rounded: true }) });
writeFileSync(join(root, 'src/app/favicon.ico'), ico(frames));
console.log('wrote src/app/favicon.ico', frames.map((f) => f.size).join('/'), '(rounded)');
