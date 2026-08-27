import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
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

test('site integrity derives page and image totals from the current upstream snapshot', async () => {
  const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'omarchy-zh-dynamic-integrity-'));
  const outputDirectory = path.join(rootDirectory, 'site');
  try {
    await mkdir(path.join(rootDirectory, 'upstream', 'manual', 'images'), { recursive: true });
    await mkdir(path.join(rootDirectory, 'translations'), { recursive: true });
    await writeFile(path.join(rootDirectory, 'upstream', 'logo.txt'), 'OMARCHY', 'utf8');
    await writeFile(path.join(rootDirectory, 'upstream', 'manual', 'images', 'one.webp'), 'image', 'utf8');
    await writeFile(
      path.join(rootDirectory, 'upstream', 'manual', '01-one.md'),
      '# One\n\nEnglish source.\n\n![One](images/one.webp)\n',
      'utf8',
    );
    await writeFile(
      path.join(rootDirectory, 'translations', '01-one.md'),
      '# 第一章\n\n中文正文。\n\n![图片](images/one.webp)\n',
      'utf8',
    );
    await cp(path.resolve('assets'), path.join(rootDirectory, 'assets'), { recursive: true });

    await buildSite({ rootDirectory, outputDirectory });
    assert.deepEqual(await collectSiteIssues({ rootDirectory, outputDirectory }), []);
  } finally {
    await rm(rootDirectory, { recursive: true, force: true });
  }
});
