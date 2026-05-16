#!/usr/bin/env node
/**
 * Stylelint warning count ratchet. Runs stylelint over CSS/SCSS sources and
 * counts total warnings (severity = warning). Count cannot rise.
 *
 * Baseline file: .css-baseline (plain count).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.css-baseline');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

let raw = '';
try {
  raw = execSync(`./node_modules/.bin/stylelint "src/**/*.{css,scss}" --formatter json --allow-empty-input`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 128 * 1024 * 1024,
  });
} catch (err) {
  raw = err.stdout?.toString() ?? '';
}

let report;
try {
  report = JSON.parse(raw || '[]');
} catch {
  console.error('[css-ratchet] could not parse stylelint JSON output:');
  console.error(raw.slice(0, 500));
  process.exit(2);
}

let warnings = 0;
let errors = 0;
for (const file of report) {
  for (const warn of file.warnings ?? []) {
    if (warn.severity === 'error') errors++;
    else warnings++;
  }
}

if (errors > 0) {
  console.error(`[css-ratchet] FAIL: ${errors} stylelint errors (errors are never allowed).`);
  console.error('Run `pnpm stylelint` to see them.');
  process.exit(1);
}

const total = warnings;

if (updateMode) {
  writeFileSync(BASELINE, String(total) + '\n', 'utf8');
  console.log(`[css-ratchet] baseline updated: ${total} warnings.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, String(total) + '\n', 'utf8');
  console.log(`[css-ratchet] baseline initialised: ${total} warnings.`);
  process.exit(0);
}

const baseline = Number(readFileSync(BASELINE, 'utf8').trim());
if (Number.isNaN(baseline)) {
  console.error('[css-ratchet] baseline is not a number.');
  process.exit(2);
}

if (total > baseline) {
  console.error(`[css-ratchet] FAIL: ${total} warnings (baseline ${baseline}).`);
  console.error('Run `pnpm stylelint:fix` then `pnpm stylelint` — or run: pnpm css:ratchet:update');
  process.exit(1);
}

if (total < baseline) {
  console.log(`[css-ratchet] OK: ${total} (was ${baseline}). pnpm css:ratchet:update`);
} else {
  console.log(`[css-ratchet] OK: ${total} warnings (unchanged).`);
}
process.exit(0);
