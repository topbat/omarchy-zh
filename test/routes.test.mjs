import test from 'node:test';
import assert from 'node:assert/strict';
import { chapterRoute, outputPathForRoute, tocRoute } from '../src/routes.mjs';

test('chapterRoute preserves official manual URLs', () => {
  assert.equal(chapterRoute({ slug: '' }), '/manual/');
  assert.equal(chapterRoute({ slug: 'getting-started' }), '/manual/getting-started/');
});

test('table of contents has a stable route', () => {
  assert.equal(tocRoute(), '/manual/toc/');
});

test('route output paths use directory indexes', () => {
  assert.equal(outputPathForRoute('/manual/'), 'manual/index.html');
  assert.equal(outputPathForRoute('/manual/navigation/'), 'manual/navigation/index.html');
});

