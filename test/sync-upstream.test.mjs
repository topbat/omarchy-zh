import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { applySyncFromCheckout, assertSyncTargetsClean } from '../src/sync-upstream.mjs';
import { parsePinnedCommit } from '../src/upstream-sync.mjs';

async function write(target, content) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

async function fixture() {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-sync-apply-'));
  const rootDirectory = path.join(temporary, 'project');
  const checkoutDirectory = path.join(temporary, 'checkout');
  const oldSource = '# One\n\nOld English.\n\n![Old](images/old.webp)\n';
  const oldTranslation = '# 第一章\n\n旧中文。\n\n![旧图](images/old.webp)\n';
  const newSource = '# One\n\nNew English.\n\n![New](images/new.webp)\n';
  const newTranslation = '# 第一章\n\n新中文。\n\n![新图](images/new.webp)\n';

  await write(path.join(rootDirectory, 'upstream', 'COMMIT'), `${'a'.repeat(40)}\n`);
  await write(path.join(rootDirectory, 'upstream', 'LICENSE'), 'old license');
  await write(path.join(rootDirectory, 'upstream', 'logo.txt'), 'OMARCHY');
  await write(path.join(rootDirectory, 'upstream', 'manual', '01-one.md'), oldSource);
  await write(path.join(rootDirectory, 'upstream', 'manual', 'images', 'old.webp'), 'old image');
  await write(path.join(rootDirectory, 'translations', '01-one.md'), oldTranslation);
  await write(path.join(rootDirectory, 'translations', 'glossary.json'), '{}');
  await cp(path.resolve('assets'), path.join(rootDirectory, 'assets'), { recursive: true });

  await write(path.join(checkoutDirectory, 'LICENSE'), 'new license');
  await write(path.join(checkoutDirectory, 'manual', '01-one.md'), newSource);
  await write(path.join(checkoutDirectory, 'manual', 'images', 'new.webp'), 'new image');

  return { temporary, rootDirectory, checkoutDirectory, oldSource, newSource, newTranslation };
}

test('assertSyncTargetsClean refuses to overwrite local snapshot or translation edits', () => {
  assert.doesNotThrow(() => assertSyncTargetsClean(''));
  assert.throws(
    () => assertSyncTargetsClean(' M translations/04-navigation.md\n'),
    /working tree[\s\S]*translations\/04-navigation\.md/i,
  );
});

test('applySyncFromCheckout translates changed chapters and replaces the snapshot only after validation', async () => {
  const data = await fixture();
  const commit = 'b'.repeat(40);
  const calls = [];
  try {
    const result = await applySyncFromCheckout({
      rootDirectory: data.rootDirectory,
      checkoutDirectory: data.checkoutDirectory,
      commit,
      translator: {
        async translate(input) {
          calls.push(input);
          return data.newTranslation;
        },
      },
    });

    assert.deepEqual(result.changes.changed, ['01-one.md']);
    assert.deepEqual(result.translatedFiles, ['01-one.md']);
    assert.equal(calls[0].previousTranslation.includes('旧中文'), true);
    assert.equal(parsePinnedCommit(await readFile(path.join(data.rootDirectory, 'upstream', 'COMMIT'), 'utf8')), commit);
    assert.equal(await readFile(path.join(data.rootDirectory, 'upstream', 'manual', '01-one.md'), 'utf8'), data.newSource);
    assert.equal(await readFile(path.join(data.rootDirectory, 'translations', '01-one.md'), 'utf8'), data.newTranslation);
    assert.equal(await readFile(path.join(data.rootDirectory, 'upstream', 'manual', 'images', 'new.webp'), 'utf8'), 'new image');
    await assert.rejects(readFile(path.join(data.rootDirectory, 'upstream', 'manual', 'images', 'old.webp')), /ENOENT/);
  } finally {
    await rm(data.temporary, { recursive: true, force: true });
  }
});

test('applySyncFromCheckout leaves the current snapshot untouched when translation validation fails', async () => {
  const data = await fixture();
  try {
    await assert.rejects(
      applySyncFromCheckout({
        rootDirectory: data.rootDirectory,
        checkoutDirectory: data.checkoutDirectory,
        commit: 'c'.repeat(40),
        translator: { async translate() { return '# 仍是中文，但图片被删除\n'; } },
      }),
      /Translation validation failed.*image targets/s,
    );
    assert.equal(await readFile(path.join(data.rootDirectory, 'upstream', 'COMMIT'), 'utf8'), `${'a'.repeat(40)}\n`);
    assert.equal(await readFile(path.join(data.rootDirectory, 'upstream', 'manual', '01-one.md'), 'utf8'), data.oldSource);
  } finally {
    await rm(data.temporary, { recursive: true, force: true });
  }
});

test('applySyncFromCheckout rejects a fully translated candidate that would fail site integrity', async () => {
  const data = await fixture();
  const remoteSource = '# One\n\nRemote asset.\n\n![Remote](https://example.com/remote.webp)\n';
  const remoteTranslation = '# 第一章\n\n远程图片。\n\n![远程图片](https://example.com/remote.webp)\n';
  try {
    await writeFile(path.join(data.checkoutDirectory, 'manual', '01-one.md'), remoteSource, 'utf8');
    await assert.rejects(
      applySyncFromCheckout({
        rootDirectory: data.rootDirectory,
        checkoutDirectory: data.checkoutDirectory,
        commit: 'd'.repeat(40),
        translator: { async translate() { return remoteTranslation; } },
      }),
      /Candidate site integrity failed.*remote image is not localized/s,
    );
    assert.equal(await readFile(path.join(data.rootDirectory, 'upstream', 'COMMIT'), 'utf8'), `${'a'.repeat(40)}\n`);
  } finally {
    await rm(data.temporary, { recursive: true, force: true });
  }
});
