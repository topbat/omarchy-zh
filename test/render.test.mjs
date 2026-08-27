import test from 'node:test';
import assert from 'node:assert/strict';
import { renderChapterPage, renderManualMarkdown, renderTocPage } from '../src/render.mjs';

const chapters = Array.from({ length: 51 }, (_, index) => ({
  order: index + 1,
  slug: index === 0 ? '' : `chapter-${index + 1}`,
  title: index === 0 ? '欢迎使用 Omarchy！' : `章节 ${index + 1}`,
  markdown: index === 0 ? '# 欢迎使用 Omarchy！\n\n## 开始使用\n\n正文。' : `# 章节 ${index + 1}`,
}));

test('renderManualMarkdown adds stable heading anchors', () => {
  const html = renderManualMarkdown('# 标题\n\n## 开始使用');
  assert.match(html, /<h1[^>]*>标题<\/h1>/);
  assert.match(html, /id="开始使用"/);
  assert.match(html, /class="manual__heading-link"/);
});

test('renderManualMarkdown keeps official English anchor aliases after headings are translated', () => {
  const html = renderManualMarkdown('# 中文标题\n\n## 快速补全', {
    anchorSource: '# English title\n\n## Quick completions',
  });
  assert.match(html, /id="快速补全"/);
  assert.match(html, /id="quick-completions"/);
});

test('chapter page includes localized shell, complete navigation, and pagination', () => {
  const html = renderChapterPage({
    chapter: chapters[0],
    chapters,
    logo: 'OMARCHY',
  });

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>欢迎使用 Omarchy！ — Omarchy 中文手册<\/title>/);
  assert.equal((html.match(/class="manual__toc-link/g) ?? []).length, 51);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /非官方简体中文翻译/);
  assert.match(html, /完整目录/);
  assert.match(html, /章节 2 →/);
});

test('table of contents renders all chapters in a numbered index', () => {
  const html = renderTocPage({ chapters, logo: 'OMARCHY' });
  assert.match(html, /<title>目录 — Omarchy 中文手册<\/title>/);
  assert.equal((html.match(/class="manual__index-link/g) ?? []).length, 51);
  assert.match(html, /欢迎使用 Omarchy！/);
  assert.match(html, /章节 51/);
});
