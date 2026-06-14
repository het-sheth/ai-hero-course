import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walkMd } from '../lib/okf.mjs';

test('walkMd returns [] for a missing dir', () => {
  assert.deepEqual(walkMd('/no/such/dir/here'), []);
});
