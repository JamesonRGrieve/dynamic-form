#!/usr/bin/env node
/**
 * Ratchet for `!important` usage in CSS and inline style attributes under
 * src/**. Each occurrence is cascade debt. Count cannot rise.
 *
 * Sources scanned:
 *   - src/**\/*.css, *.scss, *.module.css  → literal `!important` matches
 *   - src/**\/*.{ts,tsx,js,jsx}            → inline `style={{ ... }}` blocks
 *     containing `!important` strings
 *
 * Baseline file: .important-baseline (plain count).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.important-baseline');
const COVERAGE = resolve(process.cwd(), '.important-coverage.json');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

function listFiles() {
  // Use find to avoid needing globby.
  const out = execSync(
    `find src -type f \\( -name '*.css' -o -name '*.scss' -o -name '*.module.css' -o -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \\) -not -path '*/node_modules/*'`,
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );
  return out.split('\n').filter(Boolean).sort();
}

const FILES = listFiles();
const perFile = {};
let total = 0;

const STYLE_BLOCK_RE = /style\s*=\s*\{\{([\s\S]*?)\}\}/g;

for (const path of FILES) {
  const text = readFileSync(path, 'utf8');
  let count = 0;
  if (/\.(css|scss)$/.test(path)) {
    count = (text.match(/!important/g) ?? []).length;
  } else {
    let m;
    while ((m = STYLE_BLOCK_RE.exec(text)) !== null) {
      count += (m[1].match(/!important/g) ?? []).length;
    }
  }
  if (count > 0) {
    perFile[path] = count;
    total += count;
  }
}

writeFileSync(
  COVERAGE,
  JSON.stringify({ generatedAt: new Date().toISOString(), perFile, totalImportant: total }, null, 2) + '\n',
);

if (updateMode) {
  writeFileSync(BASELINE, String(total) + '\n', 'utf8');
  console.log(`[important-ratchet] baseline updated: ${total}.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, String(total) + '\n', 'utf8');
  console.log(`[important-ratchet] baseline initialised: ${total}.`);
  process.exit(0);
}

const baseline = Number(readFileSync(BASELINE, 'utf8').trim());
if (Number.isNaN(baseline)) {
  console.error('[important-ratchet] baseline is not a number.');
  process.exit(2);
}

if (total > baseline) {
  console.error(`[important-ratchet] FAIL: ${total} \`!important\` (baseline ${baseline}).`);
  console.error('Each `!important` is a cascade workaround. Refactor or run: pnpm important:ratchet:update');
  process.exit(1);
}

if (total < baseline) {
  console.log(`[important-ratchet] OK: ${total} (was ${baseline}). pnpm important:ratchet:update`);
} else {
  console.log(`[important-ratchet] OK: ${total} \`!important\` (unchanged).`);
}
process.exit(0);
