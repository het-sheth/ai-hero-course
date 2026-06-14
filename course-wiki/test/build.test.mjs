import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../build.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, 'fixtures/bundle');

test('build: generates site from a conformant fixture bundle', () => {
  rmSync(path.join(FIX, 'site'), { recursive: true, force: true });
  build({ rootDir: FIX, check: false });

  const index = readFileSync(path.join(FIX, 'site/index.html'), 'utf8');
  assert.match(index, /Mod/);                       // module section from root index.md
  assert.match(index, /the only module/);           // subtitle from §6 description
  assert.match(index, /mod\/alpha\.html/);          // concept card link
  assert.match(index, /2026-06-01/);                // log timeline

  const alpha = readFileSync(path.join(FIX, 'site/mod/alpha.html'), 'utf8');
  assert.match(alpha, /href="beta\.html"/);         // body link rewritten .md -> .html (same dir)
  assert.match(alpha, /<h2>Related<\/h2>/);         // related rendered
  assert.match(alpha, /Beta/);

  const log = readFileSync(path.join(FIX, 'site/log/2026-06-01.html'), 'utf8');
  assert.match(log, /href="\.\.\/mod\/alpha\.html"/); // log -> module link rewritten

  rmSync(path.join(FIX, 'site'), { recursive: true, force: true });
});

test('build --check: fixture bundle is conformant (no problems)', () => {
  const r = build({ rootDir: FIX, check: true });
  assert.equal(r.problems.length, 0);
});
