import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { loadChapters } from '../src/content.mjs';
import { buildSearchIndex, searchIndex } from '../src/search.mjs';

test('buildSearchIndex emits one localized entry per chapter', async () => {
  const chapters = await loadChapters(path.resolve('translations'));
  const index = buildSearchIndex(chapters);
  assert.equal(index.length, chapters.length);
  assert.equal(index[0].url, '/manual/');
  assert.match(index[0].title, /Omarchy/);
  assert.equal(index.at(-1).url, '/manual/unattended-installs/');
});

test('searchIndex matches Chinese body text and ranks title matches first', () => {
  const index = [
    { title: '终端', url: '/manual/terminal/', text: '使用终端模拟器运行命令' },
    { title: '开发工具', url: '/manual/development-tools/', text: '终端工具和编译器' },
    { title: '浏览器', url: '/manual/browsers/', text: 'Chromium 浏览器' },
  ];

  assert.deepEqual(searchIndex(index, '终端').map((entry) => entry.url), [
    '/manual/terminal/',
    '/manual/development-tools/',
  ]);
  assert.deepEqual(searchIndex(index, 'chromium').map((entry) => entry.url), [
    '/manual/browsers/',
  ]);
  assert.deepEqual(searchIndex(index, '不存在的词'), []);
});

