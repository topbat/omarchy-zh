import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildSite } from '../src/build.mjs';

async function findIndexFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findIndexFiles(target));
    } else if (entry.name === 'index.html') {
      files.push(target);
    }
  }
  return files;
}

test('buildSite emits every chapter, the table of contents, and local assets', async () => {
  const outputDirectory = await mkdtemp(path.join(os.tmpdir(), 'omarchy-zh-build-'));
  try {
    const result = await buildSite({
      rootDirectory: path.resolve('.'),
      outputDirectory,
    });

    assert.equal(result.chapterCount, 51);
    assert.equal(result.htmlPageCount, 52);
    assert.equal((await findIndexFiles(path.join(outputDirectory, 'manual'))).length, 52);

    const home = await readFile(path.join(outputDirectory, 'manual', 'index.html'), 'utf8');
    assert.match(home, /欢迎使用 Omarchy/);
    const searchIndex = JSON.parse(await readFile(path.join(outputDirectory, 'assets', 'search-index.json'), 'utf8'));
    assert.equal(searchIndex.length, 51);
    assert.equal(searchIndex[0].url, '/manual/');
    await readFile(path.join(outputDirectory, 'manual', 'images', 'navigation-stacked.webp'));
    await readFile(path.join(outputDirectory, 'themes', 'tokyo-night', 'preview.png'));
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
