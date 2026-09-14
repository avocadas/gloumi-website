/**
 * Favicon set from the app's real icon.
 *
 * Source: public/brand/gloumi-mark.svg, copied from the app by
 * scripts/gen-from-app.mjs. Everything below is derived from it, so the browser
 * tab, the iOS home screen and the manifest all show the same mark as the app.
 *
 *   node scripts/make-icons.mjs
 *
 * THE ONLY THING THAT DIFFERS BETWEEN THEM IS THE SHAPE
 * ----------------------------------------------------
 * The browser tab gets the artwork cut to a circle. Nothing else about it
 * changes: same drawing, same colours, same framing as the app.
 *
 * A square read as a pale block in the tab, and a 22.5% rounded square still
 * read as a square, because at 16 px that radius is about three pixels. A
 * circle is unmistakable at any size.
 *
 * apple-icon and the manifest icons stay square. iOS clips the home screen icon
 * to its own squircle and Android masks the manifest icon to the launcher's
 * shape; handing them pre-cut artwork trims it twice and leaves a visible notch
 * inside the platform's own outline.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const svg = readFileSync(join(root, 'public/brand/gloumi-mark.svg'));

const circleMask = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>` +
      `</svg>`
  );

/**
 * Cutting the circle at the final size gives a stepped edge: at 16 px the mask
 * is a 16 px circle, and a pixel is either in or out. So the cut happens at 8x
 * and the result is scaled down, which turns that staircase into a smooth
 * anti-aliased edge. Costs nothing – the largest intermediate here is 384 px.
 */
const SUPERSAMPLE = 8;

async function png(size, { circle = false } = {}) {
  if (!circle) {
    return sharp(svg, { density: 384 })
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toBuffer();
  }
  const big = size * SUPERSAMPLE;
  const square = await sharp(svg, { density: 384 }).resize(big, big, { fit: 'cover' }).png().toBuffer();
  /* `dest-in` keeps the icon only where the mask is opaque, so the outside becomes transparent. */
  const masked = await sharp(square)
    .composite([{ input: circleMask(big), blend: 'dest-in' }])
    .png()
    .toBuffer();
  return sharp(masked).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
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
  'src/app/icon.png': { size: 48, circle: true },
  'src/app/apple-icon.png': { size: 180, circle: false },
  'public/icons/icon-192.png': { size: 192, circle: false },
  'public/icons/icon-512.png': { size: 512, circle: false },
};

for (const [rel, { size, circle }] of Object.entries(targets)) {
  writeFileSync(join(root, rel), await png(size, { circle }));
  console.log('wrote', rel, `${size}px`, circle ? '(circle)' : '(square)');
}

const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, buf: await png(size, { circle: true }) });
writeFileSync(join(root, 'src/app/favicon.ico'), ico(frames));
console.log('wrote src/app/favicon.ico', frames.map((f) => f.size).join('/'), '(circle)');
