#!/usr/bin/env node
// Count animation usage across src/**/*.{css,scss,module.css} plus
// Tailwind config animation extensions.
//
// Tracked surface:
//   - `@keyframes <name>` blocks in CSS sources
//   - `animation:` and `animation-*:` declarations in CSS sources
//   - `theme.extend.animation` entries in tailwind.config.{js,ts,mjs,cjs}
//
// Output: writes `.animation-coverage.json` with the breakdown and prints
// the total count. The ratchet pins this total.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

const CSS_SOURCES = walk('src', ['.css', '.scss']).sort();

let keyframes = 0;
let declarations = 0;
const perFile = {};
for (const path of CSS_SOURCES) {
  const text = readFileSync(path, 'utf8');
  const kf = (text.match(/@keyframes\s+[\w-]+/g) ?? []).length;
  const decl = (text.match(/(?:^|[\s;{])animation(?:-[a-z-]+)?\s*:/g) ?? []).length;
  if (kf || decl) perFile[path] = { keyframes: kf, declarations: decl };
  keyframes += kf;
  declarations += decl;
}

// Tailwind config animation extensions
let tailwindAnimations = 0;
const TAILWIND_CONFIGS = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'tailwind.config.cjs'];
for (const cfg of TAILWIND_CONFIGS) {
  if (!existsSync(cfg)) continue;
  const text = readFileSync(cfg, 'utf8');
  // Match animation: { ... } and keyframes: { ... } inside theme.extend
  const animBlock = text.match(/animation\s*:\s*\{([\s\S]*?)\}/);
  if (animBlock) {
    tailwindAnimations += (animBlock[1].match(/['"`][\w-]+['"`]\s*:/g) ?? []).length;
  }
  const kfBlock = text.match(/keyframes\s*:\s*\{([\s\S]*?)\}/);
  if (kfBlock) {
    keyframes += (kfBlock[1].match(/['"`][\w-]+['"`]\s*:/g) ?? []).length;
  }
}

const total = keyframes + declarations + tailwindAnimations;

const report = {
  generatedAt: new Date().toISOString(),
  total,
  keyframes,
  declarations,
  tailwindAnimations,
  perFile,
};

writeFileSync('.animation-coverage.json', JSON.stringify(report, null, 2) + '\n');
console.log(total);
