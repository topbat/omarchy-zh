import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildSite } from '../src/build.mjs';
import { collectSiteIssues, findEnglishLeaks } from '../src/validate.mjs';

test('findEnglishLeaks ignores code and flags untranslated prose', () => {
  const markdown = [
    '# 中文标题',
    '',
    '这是一段完整的中文说明，包含 Omarchy 和 Hyprland。',
    '',
    '```bash',
    'this is code and should never be treated as untranslated prose',
    '```',
    '',
    'This is a long untranslated English paragraph that should be reported because it remains visible to readers in the localized manual.',
  ].join('\n');
  const leaks = findEnglishLeaks(markdown);
  assert.equal(leaks.length, 1);
  assert.match(leaks[0].text, /long untranslated English paragraph/);
});

test('findEnglishLeaks catches shorter visible English descriptions', () => {
  const leaks = findEnglishLeaks('- MacBook Pro 13-inch with four Thunderbolt ports – Model A1989');
  assert.equal(leaks.length, 1);
});

test('built manual has no structural, asset, link, marker, or translation issues', async () => {
  const outputDirectory = await mkdtemp(path.join(os.tmpdir(), 'omarchy-zh-integrity-'));
  try {
    await buildSite({ rootDirectory: path.resolve('.'), outputDirectory });
    const issues = await collectSiteIssues({
      rootDirectory: path.resolve('.'),
      outputDirectory,
    });
    assert.deepEqual(issues, []);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
