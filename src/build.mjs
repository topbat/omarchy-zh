import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChapters } from './content.mjs';
import { renderChapterPage, renderTocPage } from './render.mjs';
import { chapterRoute, outputPathForRoute, tocRoute } from './routes.mjs';
import { buildSearchIndex } from './search.mjs';

async function writeRoute(outputDirectory, route, html) {
  const outputPath = path.join(outputDirectory, outputPathForRoute(route));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
}

async function copyIfPresent(source, destination) {
  try {
    await cp(source, destination, { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

export async function buildSite({
  rootDirectory = path.resolve('.'),
  outputDirectory = path.resolve('site'),
} = {}) {
  const translationsDirectory = path.join(rootDirectory, 'translations');
  const chapters = await loadChapters(translationsDirectory);
  const logo = await readFile(path.join(rootDirectory, 'upstream', 'logo.txt'), 'utf8');

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  for (const chapter of chapters) {
    await writeRoute(
      outputDirectory,
      chapterRoute(chapter),
      renderChapterPage({ chapter, chapters, logo }),
    );
  }

  await writeRoute(outputDirectory, tocRoute(), renderTocPage({ chapters, logo }));

  await Promise.all([
    copyIfPresent(path.join(rootDirectory, 'assets'), path.join(outputDirectory, 'assets')),
    copyIfPresent(path.join(rootDirectory, 'upstream', 'manual', 'images'), path.join(outputDirectory, 'manual', 'images')),
    copyIfPresent(path.join(rootDirectory, 'upstream', 'themes'), path.join(outputDirectory, 'themes')),
  ]);

  await mkdir(path.join(outputDirectory, 'assets'), { recursive: true });
  await writeFile(
    path.join(outputDirectory, 'assets', 'search-index.json'),
    JSON.stringify(buildSearchIndex(chapters)),
    'utf8',
  );

  return {
    chapterCount: chapters.length,
    htmlPageCount: chapters.length + 1,
    outputDirectory,
  };
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const result = await buildSite();
  console.log(`Built ${result.htmlPageCount} pages in ${result.outputDirectory}`);
}
