// SPDX-License-Identifier: AGPL-3.0-or-later
// Loads every built entry through Node's own ESM loader, the way a Node consumer or a
// test runner would. Bundlers tolerate extensionless relative imports; Node does not,
// so a dist/ that only a bundler can load fails here. Every module that calls a
// browser-only React hook must also be marked 'use client', so a server component can
// render it.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { needsClientDirective } from './client-directive.ts';

const DIST = resolve('dist');
const entries = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (name.endsWith('.js')) {
      entries.push(full);
    }
  }
};
walk(DIST);

const failures = [];
for (const entry of entries) {
  if (needsClientDirective(readFileSync(entry, 'utf8'))) {
    failures.push(`${entry.replace(`${DIST}/`, '')}: calls a browser-only React hook but is not marked 'use client'`);
  }
  try {
    await import(pathToFileURL(entry).href);
  } catch (error) {
    failures.push(`${entry.replace(`${DIST}/`, '')}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failures.length > 0) {
  console.error(`[verify-dist] ${failures.length} problems with the ${entries.length} dist modules:`);
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  process.exit(1);
}
console.warn(`[verify-dist] OK: all ${entries.length} dist modules load under Node ESM and mark their client hooks`);
