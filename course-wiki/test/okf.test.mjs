import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walkMd } from '../lib/okf.mjs';
import { mdToHtmlHref } from '../lib/okf.mjs';
import { parseIndexList } from '../lib/okf.mjs';

test('walkMd returns [] for a missing dir', () => {
  assert.deepEqual(walkMd('/no/such/dir/here'), []);
});

test('mdToHtmlHref: absolute link to another module', () => {
  assert.equal(
    mdToHtmlHref('/day-2-steering/steering.md', 'day-1-fundamentals'),
    '../day-2-steering/steering.html',
  );
});

test('mdToHtmlHref: absolute link within same module', () => {
  assert.equal(mdToHtmlHref('/day-1-fundamentals/foo.md', 'day-1-fundamentals'), 'foo.html');
});

test('mdToHtmlHref: relative link', () => {
  assert.equal(mdToHtmlHref('foo.md', 'day-1-fundamentals'), 'foo.html');
});

test('mdToHtmlHref: from a log page to a module page', () => {
  assert.equal(mdToHtmlHref('/gtk-claude-code/permissions.md', 'log'), '../gtk-claude-code/permissions.html');
});

test('mdToHtmlHref: preserves fragment', () => {
  assert.equal(mdToHtmlHref('/process/seven-phase-process.md#step-3', 'log'),
    '../process/seven-phase-process.html#step-3');
});

test('mdToHtmlHref: leaves non-md links alone', () => {
  assert.equal(mdToHtmlHref('https://example.com', 'log'), 'https://example.com');
  assert.equal(mdToHtmlHref('#anchor', 'log'), '#anchor');
});

test('parseIndexList: parses title, href, description', () => {
  const body = `# Day 1 · Fundamentals

* [Constraints of LLMs](/day-1-fundamentals/constraints-of-llms.md) - What models can and can't do.
* [Subagents](/day-1-fundamentals/subagents.md) — Spawning helpers.
- [No desc](/day-1-fundamentals/x.md)
`;
  assert.deepEqual(parseIndexList(body), [
    { title: 'Constraints of LLMs', href: '/day-1-fundamentals/constraints-of-llms.md', description: "What models can and can't do." },
    { title: 'Subagents', href: '/day-1-fundamentals/subagents.md', description: 'Spawning helpers.' },
    { title: 'No desc', href: '/day-1-fundamentals/x.md', description: '' },
  ]);
});

test('parseIndexList: ignores non-list lines', () => {
  assert.deepEqual(parseIndexList('# Heading\n\nSome prose.\n'), []);
});
