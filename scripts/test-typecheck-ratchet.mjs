#!/usr/bin/env node
/**
 * Test-typecheck ratchet. Runs `tsc --noEmit -p tsconfig.test.json` and counts
 * the number of unique source files producing errors. The count cannot rise.
 * Long-term target: 0 (at which point this becomes a hard gate).
 *
 * Creates tsconfig.test.json if missing (extends main tsconfig + includes
 * test/story files).
 *
 * Baseline file: .test-typecheck-baseline (plain count).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.test-typecheck-baseline');
const CONFIG = resolve(process.cwd(), 'tsconfig.test.json');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

if (!existsSync(CONFIG)) {
  const cfg = {
    extends: './tsconfig.json',
    compilerOptions: {
      noEmit: true,
      types: ['node', 'vitest/globals', '@testing-library/jest-dom'],
    },
    include: [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/*.stories.ts',
      'src/**/*.stories.tsx',
      'tests/**/*.ts',
      'tests/**/*.tsx',
    ],
    exclude: ['node_modules', 'dist', 'storybook-static'],
  };
  writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('[test-typecheck-ratchet] seeded tsconfig.test.json');
}

let stdout = '';
try {
  stdout = execSync('./node_modules/.bin/tsc --noEmit -p tsconfig.test.json', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 128 * 1024 * 1024,
  });
} catch (err) {
  stdout = err.stdout?.toString() ?? '';
}

const LINE_RE = /^(.+?)\(\d+,\d+\):\s+error\s+TS\d+:/;
const failing = new Set();
for (const line of stdout.split('\n')) {
  const m = LINE_RE.exec(line);
  if (m) failing.add(m[1]);
}
const current = failing.size;

if (updateMode) {
  writeFileSync(BASELINE, String(current) + '\n', 'utf8');
  console.log(`[test-typecheck-ratchet] baseline updated: ${current} files failing.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, String(current) + '\n', 'utf8');
  console.log(`[test-typecheck-ratchet] baseline initialised: ${current} files failing.`);
  process.exit(0);
}

const baseline = Number(readFileSync(BASELINE, 'utf8').trim());
if (Number.isNaN(baseline)) {
  console.error('[test-typecheck-ratchet] baseline is not a number.');
  process.exit(2);
}

if (current > baseline) {
  console.error(`[test-typecheck-ratchet] FAIL: ${current} files failing (baseline ${baseline}).`);
  console.error('Either fix or run: pnpm test:typecheck:ratchet:update');
  process.exit(1);
}

if (current < baseline) {
  console.log(`[test-typecheck-ratchet] OK: ${current} (was ${baseline}). pnpm test:typecheck:ratchet:update`);
} else {
  console.log(`[test-typecheck-ratchet] OK: ${current} files failing (unchanged).`);
}
process.exit(0);
