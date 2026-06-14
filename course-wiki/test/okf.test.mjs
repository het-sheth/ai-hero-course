import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walkMd } from '../lib/okf.mjs';
import { mdToHtmlHref } from '../lib/okf.mjs';

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
