import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { compareManuals, extractCodeBlocks, extractImageTargets, extractLinkTargets } from '../src/parity.mjs';

const upstreamDir = path.resolve('upstream/manual');
const translationsDir = path.resolve('translations');

test('markdown structure extractors preserve literal technical content', () => {
  const markdown = [
    '[外部链接](https://example.com/path)',
    '![图片](images/example.webp)',
    '```bash',
    'echo "hello"',
    '```',
  ].join('\n');

  assert.deepEqual(extractCodeBlocks(markdown), [{ language: 'bash', code: 'echo "hello"' }]);
  assert.deepEqual(extractImageTargets(markdown), ['images/example.webp']);
  assert.deepEqual(extractLinkTargets(markdown), ['https://example.com/path']);
});

test('all translated chapters preserve official code, images, and link targets', async () => {
  const report = await compareManuals(upstreamDir, translationsDir);
  assert.ok(report.upstreamCount > 0);
  assert.equal(report.translationCount, report.upstreamCount);
  assert.deepEqual(report.missingFiles, []);
  assert.deepEqual(report.extraFiles, []);
  assert.deepEqual(report.codeBlockMismatches, []);
  assert.deepEqual(report.imageTargetMismatches, []);
  assert.deepEqual(report.linkTargetMismatches, []);
});

