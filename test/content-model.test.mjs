import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { loadChapters, parseChapterFilename } from '../src/content.mjs';

const upstreamDir = path.resolve('upstream/manual');

test('parseChapterFilename extracts order and stable slug', () => {
  assert.deepEqual(parseChapterFilename('01-welcome-to-omarchy.md'), {
    order: 1,
    slug: '',
    sourceSlug: 'welcome-to-omarchy',
  });
  assert.deepEqual(parseChapterFilename('17-ai.md'), {
    order: 17,
    slug: 'ai',
    sourceSlug: 'ai',
  });
});

test('loadChapters returns all official chapters in numeric order', async () => {
  const filenames = (await readdir(upstreamDir)).filter((filename) => /^\d{2}-[a-z0-9-]+\.md$/.test(filename));
  const chapters = await loadChapters(upstreamDir);
  assert.equal(chapters.length, filenames.length);
  assert.ok(chapters.length > 0);
  assert.equal(chapters[0].filename, '01-welcome-to-omarchy.md');
  assert.equal(chapters[0].title, 'Welcome to Omarchy!');
  assert.deepEqual(
    chapters.map((chapter) => chapter.order),
    [...chapters].map((chapter) => chapter.order).sort((left, right) => left - right),
  );
});

