import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const CHAPTER_PATTERN = /^(\d{2})-([a-z0-9-]+)\.md$/;

export function parseChapterFilename(filename) {
  const match = filename.match(CHAPTER_PATTERN);
  if (!match) {
    throw new Error(`Invalid chapter filename: ${filename}`);
  }

  const order = Number(match[1]);
  const sourceSlug = match[2];

  return {
    order,
    slug: order === 1 ? '' : sourceSlug,
    sourceSlug,
  };
}

export function extractTitle(markdown, filename = 'chapter') {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) {
    throw new Error(`Missing H1 title in ${filename}`);
  }
  return match[1].trim();
}

export async function loadChapters(directory) {
  const filenames = (await readdir(directory))
    .filter((filename) => CHAPTER_PATTERN.test(filename))
    .sort((left, right) => parseChapterFilename(left).order - parseChapterFilename(right).order);

  return Promise.all(filenames.map(async (filename) => {
    const markdown = await readFile(path.join(directory, filename), 'utf8');
    const parsed = parseChapterFilename(filename);
    return {
      ...parsed,
      filename,
      title: extractTitle(markdown, filename),
      markdown,
    };
  }));
}

