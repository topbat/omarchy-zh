import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { extractImageTargets } from './parity.mjs';

const CHAPTER_PATTERN = /^\d{2}-[a-z0-9-]+\.md$/;
const COMMIT_PATTERN = /^[0-9a-f]{40}$/i;

async function chapterFiles(directory) {
  return (await readdir(directory))
    .filter((filename) => CHAPTER_PATTERN.test(filename))
    .sort();
}

async function digest(filename) {
  return createHash('sha256').update(await readFile(filename)).digest('hex');
}

export function parseRemoteCommit(output) {
  const match = String(output).trim().match(/^([0-9a-f]{40})\s+refs\/heads\/[^\s]+$/i);
  if (!match) {
    throw new Error('Unable to resolve upstream commit from git ls-remote output');
  }
  return match[1].toLowerCase();
}

export function parsePinnedCommit(content) {
  const value = String(content).trim();
  if (COMMIT_PATTERN.test(value)) {
    return value.toLowerCase();
  }
  const match = String(content).match(/^Commit:\s*([0-9a-f]{40})\s*$/im);
  if (!match) {
    throw new Error('Unable to read pinned upstream commit from upstream/COMMIT');
  }
  return match[1].toLowerCase();
}

export function formatPinnedCommit(commit, capturedDate = new Date().toISOString().slice(0, 10)) {
  if (!COMMIT_PATTERN.test(commit)) {
    throw new Error(`Invalid upstream commit: ${commit}`);
  }
  return [
    'Repository: https://github.com/basecamp/omarchy',
    'Branch: quattro',
    `Commit: ${commit.toLowerCase()}`,
    `Captured: ${capturedDate}`,
    '',
  ].join('\n');
}

export async function diffManualDirectories(currentDirectory, candidateDirectory) {
  const [currentFiles, candidateFiles] = await Promise.all([
    chapterFiles(currentDirectory),
    chapterFiles(candidateDirectory),
  ]);
  const currentSet = new Set(currentFiles);
  const candidateSet = new Set(candidateFiles);
  const shared = currentFiles.filter((filename) => candidateSet.has(filename));
  const changed = [];
  const unchanged = [];

  for (const filename of shared) {
    const [before, after] = await Promise.all([
      digest(path.join(currentDirectory, filename)),
      digest(path.join(candidateDirectory, filename)),
    ]);
    (before === after ? unchanged : changed).push(filename);
  }

  return {
    added: candidateFiles.filter((filename) => !currentSet.has(filename)),
    changed,
    removed: currentFiles.filter((filename) => !candidateSet.has(filename)),
    unchanged,
  };
}

export async function collectReferencedAssets(manualDirectory) {
  const targets = new Set();
  for (const filename of await chapterFiles(manualDirectory)) {
    const markdown = await readFile(path.join(manualDirectory, filename), 'utf8');
    for (const target of extractImageTargets(markdown)) {
      if (target.startsWith('images/') || target.startsWith('../themes/')) {
        let decoded;
        try {
          decoded = decodeURIComponent(target).replaceAll('\\', '/');
        } catch {
          throw new Error(`Unsafe local image target in ${filename}: ${target}`);
        }
        const relative = decoded.startsWith('images/')
          ? decoded.slice('images/'.length)
          : decoded.slice('../themes/'.length);
        const segments = relative.split('/');
        if (!relative || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
          throw new Error(`Unsafe local image target in ${filename}: ${target}`);
        }
        targets.add(target);
      }
    }
  }
  return [...targets].sort();
}
