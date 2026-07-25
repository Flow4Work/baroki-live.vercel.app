import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validation = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate.mjs')], { stdio: 'inherit' });
if (validation.status !== 0) process.exit(validation.status ?? 1);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const icons = fs.readFileSync(path.join(root, 'icons.js'), 'utf8');
const shortcuts = fs.readFileSync(path.join(root, 'shortcuts.js'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const bundled = html
  .replace('  <link rel="stylesheet" href="./styles.css" />', `  <style>\n${css}\n  </style>`)
  .replace('  <script src="./icons.js"></script>', `  <script>\n${icons}\n  </script>`)
  .replace('  <script src="./shortcuts.js"></script>', `  <script>\n${shortcuts}\n  </script>`)
  .replace('  <script src="./app.js"></script>', `  <script>\n${js}\n  </script>`);

const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), bundled);
console.log(`production build 완료: dist/index.html (${(Buffer.byteLength(bundled) / 1024).toFixed(1)} KB)`);
