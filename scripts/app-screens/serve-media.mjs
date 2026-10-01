#!/usr/bin/env node
/**
 * Serves the pictures prepare.mjs drew, on port 8095, for the emulator to reach
 * through `adb reverse tcp:8095 tcp:8095`. The invented posts point at
 * http://localhost:8095/<file> (app-demo/config.js).
 *
 *   node scripts/app-screens/serve-media.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.join(os.tmpdir(), 'gloumi-app-screens', 'media');
const TYPES = { '.jpg': 'image/jpeg', '.png': 'image/png' };

if (!fs.existsSync(ROOT)) {
  console.error(`${ROOT} does not exist. Run prepare.mjs first.`);
  process.exit(1);
}

http
  .createServer((req, res) => {
    const name = path.basename(decodeURIComponent((req.url || '').split('?')[0]));
    const file = path.join(ROOT, name);
    const type = TYPES[path.extname(name)];
    if (!type || !fs.existsSync(file)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(8095, '127.0.0.1', () => console.log(`Serving ${ROOT} on http://localhost:8095`));
