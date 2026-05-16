#!/usr/bin/env node
// Animation ratchet: pins the total animation surface (CSS @keyframes,
// `animation*:` declarations, and Tailwind config animation entries).
//
// Reads `.animation-baseline` and (re)writes `.animation-coverage.json`.
// Fails if the count rises above the baseline.

import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const COVERAGE = '.animation-coverage.json';
const BASELINE = '.animation-baseline';

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

let tailwindAnimations = 0;
const TAILWIND_CONFIGS = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'tailwind.config.cjs'];
for (const cfg of TAILWIND_CONFIGS) {
  if (!existsSync(cfg)) continue;
  const text = readFileSync(cfg, 'utf8');
  const animBlock = text.match(/animation\s*:\s*\{([\s\S]*?)\}/);
  if (animBlock) {
    tailwindAnimations += (animBlock[1].match(/['"`][\w-]+['"`]\s*:/g) ?? []).length;
  }
  const kfBlock = text.match(/keyframes\s*:\s*\{([\s\S]*?)\}/);
  if (kfBlock) {
    keyframes += (kfBlock[1].match(/['"`][\w-]+['"`]\s*:/g) ?? []).length;
  }
}

const current = keyframes + declarations + tailwindAnimations;

writeFileSync(
  COVERAGE,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), total: current, keyframes, declarations, tailwindAnimations, perFile },
    null,
    2,
  ) + '\n',
);

const args = process.argv.slice(2);
const updateMode = args.includes('--update');

if (updateMode) {
  writeFileSync(BASELINE, `${current}\n`);
  console.log(`[animation-ratchet] baseline updated to ${current}`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, `${current}\n`);
  console.log(`[animation-ratchet] baseline initialised at ${current}`);
  process.exit(0);
}

const baseline = Number(readFileSync(BASELINE, 'utf8').trim());
if (Number.isNaN(baseline)) {
  console.error(`${BASELINE} is not a number.`);
  process.exit(2);
}

if (current > baseline) {
  console.error(`[animation-ratchet] FAIL: ${current} > baseline ${baseline} (+${current - baseline}).`);
  process.exit(1);
}
if (current < baseline) {
  console.log(`[animation-ratchet] ${current} < baseline ${baseline}. Run pnpm animation:ratchet:update.`);
}
console.log(`[animation-ratchet] OK: ${current}`);
process.exit(0);
