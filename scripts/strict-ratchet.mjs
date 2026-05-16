#!/usr/bin/env node
/**
 * Strict-mode ratchet. Compiles the project with a strict-er tsconfig
 * (tsconfig.strict.json — auto-created if missing, enabling the "next-tier"
 * strictness flags on top of the main tsconfig) and counts the number of
 * unique TS source files that fail. The file count cannot rise; when it
 * reaches 0 the repo can flip the flags into the main tsconfig.
 *
 * Baseline file: .strict-baseline (plain count).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.strict-baseline');
const CONFIG = resolve(process.cwd(), 'tsconfig.strict.json');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

if (!existsSync(CONFIG)) {
  const cfg = {
    extends: './tsconfig.json',
    compilerOptions: {
      noImplicitOverride: true,
      noFallthroughCasesInSwitch: true,
      noImplicitReturns: true,
      noUncheckedIndexedAccess: true,
      noPropertyAccessFromIndexSignature: true,
      exactOptionalPropertyTypes: true,
    },
  };
  writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  console.log('[strict-ratchet] seeded tsconfig.strict.json');
}

let stdout = '';
try {
  stdout = execSync('./node_modules/.bin/tsc --noEmit -p tsconfig.strict.json', {
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
  console.log(`[strict-ratchet] baseline updated: ${current} files failing strict.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, String(current) + '\n', 'utf8');
  console.log(`[strict-ratchet] baseline initialised: ${current} files failing strict.`);
  process.exit(0);
}

const baseline = Number(readFileSync(BASELINE, 'utf8').trim());
if (Number.isNaN(baseline)) {
  console.error('[strict-ratchet] baseline is not a number.');
  process.exit(2);
}

if (current > baseline) {
  console.error(`[strict-ratchet] FAIL: ${current} files failing strict (baseline ${baseline}).`);
  console.error('Either fix the new failures or run: pnpm strict:ratchet:update');
  process.exit(1);
}

if (current < baseline) {
  console.log(`[strict-ratchet] OK: ${current} files failing (was ${baseline}). pnpm strict:ratchet:update`);
} else {
  console.log(`[strict-ratchet] OK: ${current} files failing strict (unchanged).`);
}
process.exit(0);
