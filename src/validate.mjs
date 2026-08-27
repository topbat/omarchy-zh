import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadChapters } from './content.mjs';
import { compareManuals, extractImageTargets } from './parity.mjs';

function withoutFencedCode(markdown) {
  return markdown.replace(/^```[^\r\n]*\r?\n[\s\S]*?^```\s*$/gm, '');
}

export function findEnglishLeaks(markdown) {
  const visible = withoutFencedCode(markdown);
  const leaks = [];
  for (const [index, originalLine] of visible.split(/\r?\n/).entries()) {
    if (!originalLine.trim() || /^\s*!\[/.test(originalLine) || /^\s*\|?\s*:?-{3,}/.test(originalLine)) {
      continue;
    }
    const line = originalLine
      .replace(/`[^`]*`/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/<[^>]+>/g, ' ');
    const asciiLetters = (line.match(/[A-Za-z]/g) ?? []).length;
    const hanCharacters = (line.match(/[\p{Script=Han}]/gu) ?? []).length;
    const isHeading = /^\s*#{1,6}\s+/.test(originalLine);
    const proseLeak = asciiLetters >= 30 && hanCharacters === 0;
    const headingLeak = isHeading && asciiLetters >= 16 && hanCharacters === 0;
    if (proseLeak || headingLeak) {
      leaks.push({ line: index + 1, text: originalLine.trim() });
    }
  }
  return leaks;
}

function headingLevels(markdown) {
  return [...withoutFencedCode(markdown).matchAll(/^(#{1,6})\s+/gm)].map((match) => match[1].length);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(target));
    } else {
      files.push(target);
    }
  }
  return files;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function imageSourcePath(rootDirectory, target) {
  if (target.startsWith('images/')) {
    return path.join(rootDirectory, 'upstream', 'manual', target);
  }
  if (target.startsWith('../themes/')) {
    return path.join(rootDirectory, 'upstream', target.replace('../', ''));
  }
  return null;
}

function outputPathForUrl(outputDirectory, pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\//, '');
  if (!clean || pathname.endsWith('/')) {
    return path.join(outputDirectory, clean, 'index.html');
  }
  return path.join(outputDirectory, clean);
}

async function validateGeneratedLinks(outputDirectory, htmlFiles) {
  const issues = [];
  const htmlCache = new Map();
  const readHtml = async (filename) => {
    if (!htmlCache.has(filename)) {
      htmlCache.set(filename, await readFile(filename, 'utf8'));
    }
    return htmlCache.get(filename);
  };

  for (const filename of htmlFiles) {
    const html = await readHtml(filename);
    const relativeFilename = path.relative(outputDirectory, filename).replaceAll('\\', '/');
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|tel:|data:)/.test(target)) {
        continue;
      }

      const [pathname, fragment] = target.split('#', 2);
      let targetFile = filename;
      if (pathname) {
        targetFile = pathname.startsWith('/')
          ? outputPathForUrl(outputDirectory, pathname)
          : path.resolve(path.dirname(filename), pathname);
      }
      if (!(await exists(targetFile))) {
        issues.push(`broken generated link: ${relativeFilename} -> ${target}`);
        continue;
      }
      if (fragment && targetFile.endsWith('.html')) {
        const targetHtml = await readHtml(targetFile);
        const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`\\bid="${escapedFragment}"`).test(targetHtml)) {
          issues.push(`missing generated anchor: ${relativeFilename} -> ${target}`);
        }
      }
    }
  }
  return issues;
}

export async function collectSiteIssues({
  rootDirectory = path.resolve('.'),
  outputDirectory = path.resolve('site'),
} = {}) {
  const issues = [];
  const upstreamDirectory = path.join(rootDirectory, 'upstream', 'manual');
  const translationDirectory = path.join(rootDirectory, 'translations');
  const parity = await compareManuals(upstreamDirectory, translationDirectory);

  for (const [key, values] of Object.entries(parity)) {
    if (Array.isArray(values)) {
      values.forEach((filename) => issues.push(`${key}: ${filename}`));
    }
  }

  const [upstreamChapters, translatedChapters] = await Promise.all([
    loadChapters(upstreamDirectory),
    loadChapters(translationDirectory),
  ]);
  const upstreamByFilename = new Map(upstreamChapters.map((chapter) => [chapter.filename, chapter]));
  const imageTargets = new Set();
  const expectedImageTargets = new Set(
    upstreamChapters.flatMap((chapter) => extractImageTargets(chapter.markdown)),
  );

  for (const chapter of translatedChapters) {
    const upstream = upstreamByFilename.get(chapter.filename);
    if (upstream && JSON.stringify(headingLevels(upstream.markdown)) !== JSON.stringify(headingLevels(chapter.markdown))) {
      issues.push(`heading structure mismatch: ${chapter.filename}`);
    }
    if (/\b(?:TODO|TBD|translation pending)\b|待翻译/iu.test(withoutFencedCode(chapter.markdown))) {
      issues.push(`translation marker: ${chapter.filename}`);
    }
    if ((chapter.markdown.match(/[\p{Script=Han}]/gu) ?? []).length === 0) {
      issues.push(`no Chinese text: ${chapter.filename}`);
    }
    for (const leak of findEnglishLeaks(chapter.markdown)) {
      issues.push(`possible English leak: ${chapter.filename}:${leak.line}: ${leak.text}`);
    }
    for (const target of extractImageTargets(chapter.markdown)) {
      imageTargets.add(target);
      if (/^https?:/i.test(target)) {
        issues.push(`remote image is not localized: ${chapter.filename} -> ${target}`);
        continue;
      }
      const sourcePath = imageSourcePath(rootDirectory, target);
      if (!sourcePath || !(await exists(sourcePath))) {
        issues.push(`missing source image: ${chapter.filename} -> ${target}`);
      }
    }
  }

  if (imageTargets.size !== expectedImageTargets.size) {
    issues.push(`expected ${expectedImageTargets.size} unique image targets, found ${imageTargets.size}`);
  }

  const htmlFiles = (await walk(path.join(outputDirectory, 'manual')))
    .filter((filename) => filename.endsWith('index.html'));
  const expectedHtmlPageCount = translatedChapters.length + 1;
  if (htmlFiles.length !== expectedHtmlPageCount) {
    issues.push(`expected ${expectedHtmlPageCount} generated manual pages, found ${htmlFiles.length}`);
  }
  issues.push(...await validateGeneratedLinks(outputDirectory, htmlFiles));

  return issues.sort();
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const issues = await collectSiteIssues();
  if (issues.length > 0) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Site integrity checks passed');
  }
}
