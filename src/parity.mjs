import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

function normalizeCode(code) {
  return code.replace(/\r\n/g, '\n').replace(/\s+$/u, '');
}

export function extractCodeBlocks(markdown) {
  const blocks = [];
  const pattern = /^```([^\r\n]*)\r?\n([\s\S]*?)^```\s*$/gm;
  for (const match of markdown.matchAll(pattern)) {
    blocks.push({
      language: match[1].trim(),
      code: normalizeCode(match[2]),
    });
  }
  return blocks;
}

export function extractImageTargets(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
    .map((match) => match[1]);
}

export function extractLinkTargets(markdown) {
  return [...markdown.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
    .map((match) => match[1]);
}

async function markdownFiles(directory) {
  return (await readdir(directory))
    .filter((filename) => /^\d{2}-[a-z0-9-]+\.md$/.test(filename))
    .sort();
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export async function compareManuals(upstreamDirectory, translationDirectory) {
  const upstreamFiles = await markdownFiles(upstreamDirectory);
  const translationFiles = await markdownFiles(translationDirectory);
  const upstreamSet = new Set(upstreamFiles);
  const translationSet = new Set(translationFiles);
  const sharedFiles = upstreamFiles.filter((filename) => translationSet.has(filename));

  const report = {
    upstreamCount: upstreamFiles.length,
    translationCount: translationFiles.length,
    missingFiles: upstreamFiles.filter((filename) => !translationSet.has(filename)),
    extraFiles: translationFiles.filter((filename) => !upstreamSet.has(filename)),
    codeBlockMismatches: [],
    imageTargetMismatches: [],
    linkTargetMismatches: [],
  };

  for (const filename of sharedFiles) {
    const [upstream, translation] = await Promise.all([
      readFile(path.join(upstreamDirectory, filename), 'utf8'),
      readFile(path.join(translationDirectory, filename), 'utf8'),
    ]);

    if (!sameJson(extractCodeBlocks(upstream), extractCodeBlocks(translation))) {
      report.codeBlockMismatches.push(filename);
    }
    if (!sameJson(extractImageTargets(upstream), extractImageTargets(translation))) {
      report.imageTargetMismatches.push(filename);
    }
    if (!sameJson(extractLinkTargets(upstream), extractLinkTargets(translation))) {
      report.linkTargetMismatches.push(filename);
    }
  }

  return report;
}

