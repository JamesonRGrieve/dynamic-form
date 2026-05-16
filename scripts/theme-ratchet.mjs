#!/usr/bin/env node
// Theme ratchet: pins hard-coded color literals and non-token spacing in
// src/**/*.{css,scss}. Baseline is JSON: { colors, spacing }.
//
// Fails if either counter rises above its baseline.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const BASELINE = '.theme-baseline';

execSync('node scripts/theme-coverage.mjs', { stdio: 'inherit' });
const coverage = JSON.parse(readFileSync('.theme-coverage.json', 'utf8'));
const current = { colors: coverage.colors, spacing: coverage.spacing };

const args = process.argv.slice(2);
const updateMode = args.includes('--update');

if (updateMode) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  console.log(`[theme-ratchet] baseline updated to ${JSON.stringify(current)}`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  console.log(`[theme-ratchet] baseline initialised at ${JSON.stringify(current)}`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));

let failed = false;
for (const key of ['colors', 'spacing']) {
  if (current[key] > baseline[key]) {
    console.error(`[theme-ratchet] FAIL: ${key} ${baseline[key]} -> ${current[key]} (+${current[key] - baseline[key]}).`);
    failed = true;
  } else if (current[key] < baseline[key]) {
    console.log(`[theme-ratchet] ${key} ${baseline[key]} -> ${current[key]}. Lower baseline: pnpm theme:ratchet:update.`);
  }
}

if (failed) {
  console.error('Either fix the new violations or, if intentional, run: pnpm theme:ratchet:update');
  process.exit(1);
}

console.log(`[theme-ratchet] OK: ${JSON.stringify(current)}`);
process.exit(0);
