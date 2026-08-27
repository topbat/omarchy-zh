import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import { chapterRoute, tocRoute } from './routes.mjs';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugifyHeading(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, '')
    .replace(/^-+|-+$/g, '');
}

function localizeManualTarget(target) {
  const [pathname, fragment = ''] = target.split('#', 2);
  if (/^\d{2}-[a-z0-9-]+\.md$/.test(pathname)) {
    const slug = pathname.replace(/^\d{2}-/, '').replace(/\.md$/, '');
    return `/manual/${slug}/${fragment ? `#${fragment}` : ''}`;
  }
  return target;
}

function localizeImageTarget(target) {
  if (target.startsWith('images/')) {
    return `/manual/${target}`;
  }
  if (target.startsWith('../themes/')) {
    return target.replace('../themes/', '/themes/');
  }
  return target;
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return escapeHtml(code);
  },
});

markdown.use(markdownItAnchor, {
  level: [2, 3, 4, 5, 6],
  slugify: slugifyHeading,
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'after',
    class: 'manual__heading-link',
    ariaHidden: true,
  }),
});

const defaultLinkOpen = markdown.renderer.rules.link_open
  ?? ((tokens, index, options, environment, self) => self.renderToken(tokens, index, options));
markdown.renderer.rules.link_open = (tokens, index, options, environment, self) => {
  const hrefIndex = tokens[index].attrIndex('href');
  if (hrefIndex >= 0) {
    tokens[index].attrs[hrefIndex][1] = localizeManualTarget(tokens[index].attrs[hrefIndex][1]);
  }
  return defaultLinkOpen(tokens, index, options, environment, self);
};

const defaultImage = markdown.renderer.rules.image;
markdown.renderer.rules.image = (tokens, index, options, environment, self) => {
  const srcIndex = tokens[index].attrIndex('src');
  if (srcIndex >= 0) {
    tokens[index].attrs[srcIndex][1] = localizeImageTarget(tokens[index].attrs[srcIndex][1]);
  }
  return defaultImage(tokens, index, options, environment, self);
};

function headingSlugs(source) {
  return [...source.matchAll(/^#{2,6}\s+(.+)$/gm)]
    .map((match) => slugifyHeading(match[1].replace(/[`_*~\[\]]/g, '')));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function renderManualMarkdown(source, { anchorSource } = {}) {
  let html = markdown.render(source);
  if (!anchorSource) {
    return html;
  }

  const translatedSlugs = headingSlugs(source);
  const officialSlugs = headingSlugs(anchorSource);
  for (const [index, officialSlug] of officialSlugs.entries()) {
    const translatedSlug = translatedSlugs[index];
    if (!officialSlug || !translatedSlug || officialSlug === translatedSlug) {
      continue;
    }
    const headingPattern = new RegExp(`(<h[2-6]\\s+id="${escapeRegExp(translatedSlug)}")`);
    html = html.replace(
      headingPattern,
      `<span class="heading-alias" id="${escapeHtml(officialSlug)}" aria-hidden="true"></span>$1`,
    );
  }
  return html;
}

function stylesheetLinks() {
  const stylesheets = [
    'reset',
    'root',
    'fonts',
    'elements',
    'footer',
    'header',
    'main',
    'pre',
    'manual',
    'search',
    'site',
  ];
  return stylesheets.map((name) => `<link rel="stylesheet" href="/assets/css/${name}.css">`).join('\n    ');
}

function renderShell({ title, description, body, pageClass = '' }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="color-scheme" content="dark">
  <title>${escapeHtml(title)} — Omarchy 中文手册</title>
  ${stylesheetLinks()}
  <script type="module" src="/assets/js/manual.js"></script>
</head>
<body class="${escapeHtml(pageClass)}">
${body}
</body>
</html>`;
}

function renderBrand(logo) {
  return `<div class="pre"><a href="/manual/" aria-label="Omarchy 中文手册首页"><pre aria-hidden="true">${escapeHtml(logo.trim())}</pre></a></div>
<header class="header"><h1>中文手册</h1></header>`;
}

function renderSearch() {
  return `<search class="search" data-search>
  <label class="visually-hidden" for="manual-search">搜索手册</label>
  <div class="search__field">
    <input class="search__input" id="manual-search" type="search" role="combobox" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="搜索" aria-label="搜索手册" aria-expanded="false" aria-autocomplete="list" aria-controls="search-results">
    <kbd class="search__shortcut">/</kbd>
  </div>
  <div id="search-results" class="search__results" role="listbox" aria-label="搜索结果" hidden></div>
</search>`;
}

function renderChapterLinks(chapters, currentChapter) {
  return `<nav class="manual__toc" aria-label="章节">
  <ol>
    ${chapters.map((chapter) => {
      const current = currentChapter?.order === chapter.order ? ' aria-current="page"' : '';
      return `<li><a class="manual__toc-link" href="${chapterRoute(chapter)}"${current}>${escapeHtml(chapter.title)}</a></li>`;
    }).join('\n    ')}
  </ol>
</nav>`;
}

function renderPagination(chapter, chapters) {
  const index = chapters.findIndex((candidate) => candidate.order === chapter.order);
  const previous = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;
  return `<nav class="manual__pagination" aria-label="章节翻页">
  <div class="manual__pagination-previous">${previous ? `<a href="${chapterRoute(previous)}">← ${escapeHtml(previous.title)}</a>` : ''}</div>
  <a class="manual__pagination-contents" href="${tocRoute()}">完整目录</a>
  <div class="manual__pagination-next">${next ? `<a href="${chapterRoute(next)}">${escapeHtml(next.title)} →</a>` : ''}</div>
</nav>`;
}

export function renderChapterPage({ chapter, chapters, logo }) {
  const content = renderManualMarkdown(chapter.markdown, { anchorSource: chapter.anchorSource });
  const body = `${renderBrand(logo)}
<main class="main">
  <div class="manual manual--chapter">
    <aside class="manual__sidebar">
      ${renderSearch()}
      ${renderChapterLinks(chapters, chapter)}
    </aside>
    <article class="manual__content">
      ${content}
      ${renderPagination(chapter, chapters)}
      <footer class="translation-note">非官方简体中文翻译 · <a href="https://omarchy.org/manual/">英文原版</a></footer>
    </article>
  </div>
</main>`;
  return renderShell({
    title: chapter.title,
    description: `${chapter.title} — Omarchy 非官方简体中文手册`,
    body,
    pageClass: 'manual-page',
  });
}

export function renderTocPage({ chapters, logo }) {
  const body = `${renderBrand(logo)}
<main class="main">
  <div class="manual manual--index">
    ${renderSearch()}
    <nav class="manual__index" aria-label="完整目录">
      <ol>
        ${chapters.map((chapter) => `<li><a class="manual__index-link" href="${chapterRoute(chapter)}">${escapeHtml(chapter.title)}</a></li>`).join('\n        ')}
      </ol>
    </nav>
    <footer class="translation-note translation-note--index">非官方简体中文翻译 · <a href="https://omarchy.org/manual/">英文原版</a></footer>
  </div>
</main>`;
  return renderShell({
    title: '目录',
    description: 'Omarchy 非官方简体中文手册完整目录',
    body,
    pageClass: 'manual-index-page',
  });
}
