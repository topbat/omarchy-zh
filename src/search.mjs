import { chapterRoute } from './routes.mjs';

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN');
}

export function markdownToSearchText(markdown) {
  return markdown
    .replace(/^```[^\r\n]*\r?\n([\s\S]*?)^```\s*$/gm, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[#>*+-]+\s*/gm, '')
    .replace(/[`_*~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchIndex(chapters) {
  return chapters.map((chapter) => ({
    order: chapter.order,
    title: chapter.title,
    url: chapterRoute(chapter),
    text: markdownToSearchText(chapter.markdown.replace(/^#\s+.+$/m, '')),
  }));
}

export function searchIndex(index, query, limit = 12) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return [];
  }

  return index
    .map((entry) => {
      const title = normalize(entry.title);
      const text = normalize(entry.text);
      if (!tokens.every((token) => title.includes(token) || text.includes(token))) {
        return null;
      }
      const titleMatches = tokens.filter((token) => title.includes(token)).length;
      return { entry, score: tokens.length - titleMatches };
    })
    .filter(Boolean)
    .sort((left, right) => left.score - right.score || (left.entry.order ?? 0) - (right.entry.order ?? 0))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

