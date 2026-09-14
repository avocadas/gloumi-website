/**
 * Favicon set from the app's real icon.
 *
 * Source: public/brand/gloumi-mark.svg, copied from the app by
 * scripts/gen-from-app.mjs. Everything below is derived from it, so the browser
 * tab, the iOS home screen and the manifest all show the same mark as the app.
 *
 *   node scripts/make-icons.mjs
 *
 * WHAT THE BROWSER TAB GETS, AND WHY IT DIFFERS FROM THE REST
 * ----------------------------------------------------------
 * A dark circle with the G knocked out of it in cream, the mark enlarged to
 * 1.3x so it fills the disc. Both colours are the app icon's own: the plum it
 * draws the G in, and the top stop of its background gradient.
 *
 * The tab draws the file exactly as handed over, at 16 px, and the app's real
 * artwork does not survive that. Three things were tried and compared at true
 * size: the square read as a pale block; a 22.5% rounded square still read as
 * a square, because at 16 px that radius is about three pixels; a circle fixed
 * the shape but the pale gradient behind a thin serif stayed muddy. Inverting
 * it is what made the letter legible. 1.6x was tried too and cropped the full
 * stop after the G, so 1.3x is the limit that keeps the mark whole.
 *
 * apple-icon and the manifest icons keep the app's real artwork, square and
 * unzoomed. They sit on a home screen next to the app itself, where matching it
 * matters more than legibility at 16 px, and both platforms mask the corners
 * themselves; handing them pre-cut artwork trims it twice and leaves a visible
 * notch inside the platform's own outline.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const svg = readFileSync(join(root, 'public/brand/gloumi-mark.svg'));

/** How much the mark is enlarged before the circle is cut out of it. */
const BROWSER_ZOOM = 1.3;

/** Both taken from the app icon: the colour it draws the G in, and its gradient's top stop. */
const TAB_BACKGROUND = '#5C2F41';
const TAB_INK = '#F8DDCC';

/**
 * The tab version of the mark: the same G, inverted onto a solid ground.
 *
 * Built from the source file rather than kept as a second drawing, so it cannot
 * fall behind the app. If that file stops having the shape this reads, the
 * script stops instead of quietly producing something wrong.
 */
function tabArtwork(source) {
  const paths = [...source.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const transform = (source.match(/transform="(matrix[^"]+)"/) || [])[1];
  if (paths.length !== 3 || !transform) {
    console.error('gloumi-mark.svg no longer holds three paths and a matrix transform.');
    console.error('The tab icon is derived from them, so it cannot be built. Check the mark and this script together.');
    process.exit(1);
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="84 74 1100 1100">` +
      `<rect x="84" y="74" width="1100" height="1100" fill="${TAB_BACKGROUND}"/>` +
      `<g fill="${TAB_INK}" transform="${transform}">` +
      paths.map((d) => `<path d="${d}"/>`).join('') +
      `</g></svg>`
  );
}

const circleMask = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>` +
      `</svg>`
  );

async function png(size, { circle = false, zoom = 1, source = svg } = {}) {
  const scaled = Math.round(size * zoom);
  const offset = Math.round((scaled - size) / 2);
  let image = sharp(source, { density: 512 }).resize(scaled, scaled, { fit: 'cover' });
  if (zoom !== 1) {
    image = sharp(await image.png().toBuffer()).extract({ left: offset, top: offset, width: size, height: size });
  }
  const square = await image.png().toBuffer();
  if (!circle) return sharp(square).png({ compressionLevel: 9 }).toBuffer();
  /* `dest-in` keeps the icon only where the mask is opaque, so the outside becomes transparent. */
  return sharp(square)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
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

const browser = { circle: true, zoom: BROWSER_ZOOM, source: tabArtwork(svg.toString('utf8')) };

const targets = {
  'src/app/icon.png': { size: 48, options: browser },
  'src/app/apple-icon.png': { size: 180, options: {} },
  'public/icons/icon-192.png': { size: 192, options: {} },
  'public/icons/icon-512.png': { size: 512, options: {} },
};

for (const [rel, { size, options }] of Object.entries(targets)) {
  writeFileSync(join(root, rel), await png(size, options));
  console.log('wrote', rel, `${size}px`, options.circle ? '(tab: dark circle)' : '(app artwork, square)');
}

const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, buf: await png(size, browser) });
writeFileSync(join(root, 'src/app/favicon.ico'), ico(frames));
console.log('wrote src/app/favicon.ico', frames.map((f) => f.size).join('/'), '(tab: dark circle)');
