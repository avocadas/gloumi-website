#!/usr/bin/env node
/**
 * Builds a throwaway copy of the app that shows invented people, for the
 * screenshots in the hero phone (avocadas/Gloumi#136). README.md here has the
 * whole recipe; this script is the part that is the same every time.
 *
 *   node scripts/app-screens/prepare.mjs <git-ref>   e.g. origin/prod
 *   node scripts/app-screens/prepare.mjs --lang en   switch the copy's language
 *   node scripts/app-screens/prepare.mjs --clean     remove the copy
 *
 * The copy lives outside both repositories, in the system temp folder. Its
 * node_modules is a junction to the app checkout's, and that is why --clean
 * exists: a recursive delete that follows the junction wipes the real one.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { ICONS, PALETTES, AVATAR_TONES } from './art.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..', '..');
const GLOUMI = path.resolve(process.env.GLOUMI_REPO || path.join(SITE, '..', 'Gloumi'));
const WORK = path.join(os.tmpdir(), 'gloumi-app-screens');
const APP = path.join(WORK, 'gloumi-app');
const MODULES = path.join(APP, 'node_modules');
const MEDIA = path.join(WORK, 'media');

const arg = process.argv[2];

if (!arg) {
  console.error('Usage: prepare.mjs <git-ref> | --lang lt|en | --clean');
  process.exit(1);
}
if (arg === '--clean') clean();
else if (arg === '--lang') setLang(process.argv[3]);
else await prepare(arg);

function clean() {
  if (fs.existsSync(MODULES)) {
    if (!fs.lstatSync(MODULES).isSymbolicLink()) {
      console.error(`${MODULES} is a real folder, not the junction this script makes. Not touching it.`);
      process.exit(1);
    }
    fs.rmdirSync(MODULES);
  }
  if (fs.existsSync(MODULES)) {
    console.error('The node_modules junction is still there. Not deleting anything.');
    process.exit(1);
  }
  fs.rmSync(WORK, { recursive: true, force: true });
  console.log(`Removed ${WORK}`);
}

function setLang(lang) {
  if (lang !== 'lt' && lang !== 'en') {
    console.error('--lang takes lt or en.');
    process.exit(1);
  }
  const file = path.join(APP, 'src', 'demo', 'config.js');
  const src = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, src.replace(/DEMO_LANG = '(lt|en)'/, `DEMO_LANG = '${lang}'`));
  console.log(`The copy now speaks ${lang}. Metro picks it up; cold-start the app to see it.`);
}

async function prepare(ref) {
  if (fs.existsSync(APP)) {
    console.error(`${APP} already exists. Run --clean first.`);
    process.exit(1);
  }
  const target = path.join(GLOUMI, 'gloumi-app', 'node_modules');
  if (!fs.existsSync(path.join(target, 'expo', 'package.json'))) {
    console.error(`No installed app at ${target}. Set GLOUMI_REPO to the app checkout.`);
    process.exit(1);
  }

  fs.mkdirSync(WORK, { recursive: true });
  execFileSync('git', ['-C', GLOUMI, 'fetch', '-q', 'origin'], { stdio: 'inherit' });
  const sha = execFileSync('git', ['-C', GLOUMI, 'rev-parse', '--short', ref]).toString().trim();
  // A relative archive path: GNU tar from Git Bash reads "C:" as a remote host.
  execFileSync('git', ['-C', GLOUMI, 'archive', '--format=tar', '-o', path.join(WORK, 'app.tar'), ref, 'gloumi-app']);
  execFileSync('tar', ['-xf', 'app.tar'], { cwd: WORK });
  fs.rmSync(path.join(WORK, 'app.tar'));
  fs.symlinkSync(target, MODULES, 'junction');

  fs.cpSync(path.join(HERE, 'app-demo'), path.join(APP, 'src', 'demo'), { recursive: true });
  patchApp();
  await drawMedia();

  console.log(`\nReady: ${APP} (${ref} = ${sha}). Next steps are in scripts/app-screens/README.md.`);
}

/**
 * Exact-text edits, each of which must match once. When the app moves on and
 * one stops matching, this fails loudly instead of shooting a half-faked app.
 */
function patchApp() {
  const edits = [
    ['src/services/client.js',
      "import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../config/supabase';",
      "import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../config/supabase';\nimport { demoFetch } from '../demo/demoFetch';"],
    ['src/services/client.js',
      '  {\n    auth: {\n      /*',
      '  {\n    global: { fetch: demoFetch },\n    auth: {\n      /*'],
    // The app's own language switch also writes profiles.language on the live server.
    ['src/hooks/useAppTheme.js',
      'const [lang, setLangState] = useState(DEFAULT_LANG);',
      "const [lang, setLangState] = useState(require('../demo/config').DEMO_LANG);"],
    ['src/hooks/useAppTheme.js',
      'if (savedLang && TRANSLATIONS[savedLang]) {',
      'if (false && savedLang && TRANSLATIONS[savedLang]) {'],
    // Neither show the last real feed on start nor leave invented people in it afterwards.
    ['src/utils/startupCache.js',
      'export async function readStartupCache(uid) {\n  if (!uid) return null;',
      'export async function readStartupCache(uid) {\n  if (uid || !uid) return null;'],
    ['src/utils/startupCache.js',
      'export async function writeStartupCache(uid, { feed = [], stories = [], masters = [] } = {}) {\n  if (!uid) return;',
      'export async function writeStartupCache(uid, { feed = [], stories = [], masters = [] } = {}) {\n  if (uid || !uid) return;'],
    // Distances from the centre of Vilnius, without touching the emulator's GPS.
    ['src/hooks/useUserLocation.js',
      '  return { coords, status, request };\n}',
      "  return { coords: require('../demo/config').DEMO_COORDS, status: 'granted', request: () => {} };\n}"],
  ];
  for (const [file, from, to] of edits) {
    const full = path.join(APP, file);
    const src = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
    const count = src.split(from).length - 1;
    if (count !== 1) {
      console.error(`${file}: expected 1 match, found ${count}:\n${from}`);
      process.exit(1);
    }
    fs.writeFileSync(full, src.replace(from, to));
  }
  console.log(`Patched ${edits.length} places.`);
}

/** Pictures, not photos: the developer's choice for the invented people's work. */
async function drawMedia() {
  const { mediaJobs } = await import(pathToFileURL(path.join(HERE, 'app-demo', 'demoData.js')).href);
  const { works, avatars } = mediaJobs();
  fs.mkdirSync(MEDIA, { recursive: true });
  for (const job of works) {
    await sharp(Buffer.from(workSvg(job))).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(MEDIA, job.file));
  }
  for (const job of avatars) {
    await sharp(Buffer.from(avatarSvg(job))).png().toFile(path.join(MEDIA, job.file));
  }
  console.log(`Drew ${works.length} pictures and ${avatars.length} avatars into ${MEDIA}.`);
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function sparkle(x, y, r, opacity) {
  return `<path transform="translate(${x} ${y}) scale(${r / 10})" d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" fill="#FFFFFF" opacity="${opacity}"/>`;
}

function workSvg({ w, h, category, variant, seed }) {
  const [a, b, blob, ink] = PALETTES[category][variant % 3];
  const r = rng(seed);
  const angle = Math.round(r() * 360);
  // Radial gradients, not a blur filter: librsvg's large blur turns circles into rounded squares.
  const blobs = Array.from({ length: 3 }, (_, i) => {
    const cx = Math.round(w * (0.15 + r() * 0.7));
    const cy = Math.round(h * (0.12 + r() * 0.76));
    const rad = Math.round(w * (0.22 + r() * 0.18));
    const color = i === 1 ? '#FFFFFF' : blob;
    const op = i === 1 ? 0.7 : 0.9;
    return `<radialGradient id="rg${i}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="0.55" stop-color="${color}" stop-opacity="${(op * 0.45).toFixed(2)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${cx}" cy="${cy}" r="${Math.round(rad * 1.7)}" fill="url(#rg${i})"/>`;
  }).join('');
  const plate = Math.round(w * 0.31);
  const px = Math.round(w / 2 + (r() - 0.5) * w * 0.12);
  const py = Math.round(h / 2 + (r() - 0.5) * h * 0.1);
  const iconSize = plate * 1.32;
  const sparkles = Array.from({ length: 5 }, () =>
    sparkle(
      Math.round(w * (0.08 + r() * 0.84)),
      Math.round(h * (0.06 + r() * 0.88)),
      Math.round(14 + r() * 26),
      (0.6 + r() * 0.4).toFixed(2)
    )
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${Math.round(w * 0.02)}" stdDeviation="${Math.round(w * 0.03)}" flood-color="${ink}" flood-opacity="0.18"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${blobs}
  ${sparkles}
  <circle cx="${px}" cy="${py}" r="${plate}" fill="#FFFFFF" opacity="0.92" filter="url(#shadow)"/>
  <circle cx="${px}" cy="${py}" r="${Math.round(plate * 0.86)}" fill="none" stroke="${blob}" stroke-width="${Math.max(2, Math.round(w * 0.004))}" opacity="0.9"/>
  <g transform="translate(${px - iconSize / 2} ${py - iconSize / 2}) scale(${iconSize / 48})" fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[category]}</g>
</svg>`;
}

function avatarSvg({ initials, tone }) {
  const [a, b] = AVATAR_TONES[tone % AVATAR_TONES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="200" dy="0.36em" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="150" fill="#FFFFFF" letter-spacing="4">${initials}</text>
</svg>`;
}
