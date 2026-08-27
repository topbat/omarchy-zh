import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  collectReferencedAssets,
  diffManualDirectories,
  formatPinnedCommit,
  parsePinnedCommit,
  parseRemoteCommit,
} from '../src/upstream-sync.mjs';

async function write(target, content) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

test('parseRemoteCommit accepts one exact ls-remote branch result', () => {
  assert.equal(
    parseRemoteCommit('0123456789abcdef0123456789abcdef01234567\trefs/heads/quattro\n'),
    '0123456789abcdef0123456789abcdef01234567',
  );
  assert.throws(() => parseRemoteCommit(''), /Unable to resolve upstream commit/);
});

test('parsePinnedCommit supports the repository metadata file and a legacy plain SHA', () => {
  const commit = '0123456789abcdef0123456789abcdef01234567';
  assert.equal(parsePinnedCommit(commit), commit);
  assert.equal(parsePinnedCommit([
    'Repository: https://github.com/basecamp/omarchy',
    'Branch: quattro',
    `Commit: ${commit}`,
    'Captured: 2026-08-27',
  ].join('\n')), commit);
  assert.throws(() => parsePinnedCommit('Commit: missing'), /Unable to read pinned upstream commit/);
  assert.equal(formatPinnedCommit(commit, '2026-08-27'), [
    'Repository: https://github.com/basecamp/omarchy',
    'Branch: quattro',
    `Commit: ${commit}`,
    'Captured: 2026-08-27',
    '',
  ].join('\n'));
});

test('diffManualDirectories classifies added, changed, removed, and unchanged chapters', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-sync-diff-'));
  const current = path.join(temporary, 'current');
  const candidate = path.join(temporary, 'candidate');
  try {
    await write(path.join(current, '01-one.md'), '# One\nSame\n');
    await write(path.join(current, '02-two.md'), '# Two\nOld\n');
    await write(path.join(current, '03-three.md'), '# Three\nRemoved\n');
    await write(path.join(candidate, '01-one.md'), '# One\nSame\n');
    await write(path.join(candidate, '02-two.md'), '# Two\nNew\n');
    await write(path.join(candidate, '04-four.md'), '# Four\nAdded\n');

    assert.deepEqual(await diffManualDirectories(current, candidate), {
      added: ['04-four.md'],
      changed: ['02-two.md'],
      removed: ['03-three.md'],
      unchanged: ['01-one.md'],
    });
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('collectReferencedAssets returns unique local manual and theme image targets', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-sync-assets-'));
  try {
    await write(path.join(temporary, '01-one.md'), [
      '# One',
      '![one](images/one.webp)',
      '![theme](../themes/tokyo-night/preview.png)',
      '![again](images/one.webp)',
      '![remote](https://example.com/remote.png)',
    ].join('\n'));

    assert.deepEqual(await collectReferencedAssets(temporary), [
      '../themes/tokyo-night/preview.png',
      'images/one.webp',
    ]);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('collectReferencedAssets rejects local image paths that traverse outside approved roots', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-sync-unsafe-assets-'));
  try {
    await write(path.join(temporary, '01-one.md'), '# One\n\n![Unsafe](images/../../outside.webp)\n');
    await assert.rejects(collectReferencedAssets(temporary), /Unsafe local image target/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
