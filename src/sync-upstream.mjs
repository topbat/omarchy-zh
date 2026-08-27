import { execFile } from 'node:child_process';
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build.mjs';
import { compareManuals } from './parity.mjs';
import { collectSiteIssues, findEnglishLeaks } from './validate.mjs';
import {
  collectReferencedAssets,
  diffManualDirectories,
  formatPinnedCommit,
  parsePinnedCommit,
  parseRemoteCommit,
} from './upstream-sync.mjs';
import {
  createTranslationProvider,
  validateTranslationCandidate,
} from './translation-provider.mjs';

const execFileAsync = promisify(execFile);
const UPSTREAM_URL = 'https://github.com/basecamp/omarchy.git';
const UPSTREAM_BRANCH = 'quattro';

export function assertSyncTargetsClean(statusOutput) {
  const dirty = String(statusOutput).trim();
  if (dirty) {
    throw new Error(`Refusing to overwrite a working tree with local upstream/ or translations/ edits:\n${dirty}`);
  }
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function replaceDirectory(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function copyReferencedThemes(checkoutDirectory, stageUpstreamDirectory, targets) {
  for (const target of targets.filter((value) => value.startsWith('../themes/'))) {
    const relative = target.replace(/^\.\.\/themes\//, '');
    const source = path.join(checkoutDirectory, 'themes', relative);
    const destination = path.join(stageUpstreamDirectory, 'themes', relative);
    if (!(await exists(source))) {
      throw new Error(`Referenced upstream theme asset is missing: ${target}`);
    }
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(source, destination);
  }
}

async function assertManualAssets(manualDirectory, targets) {
  for (const target of targets.filter((value) => value.startsWith('images/'))) {
    if (!(await exists(path.join(manualDirectory, target)))) {
      throw new Error(`Referenced upstream manual asset is missing: ${target}`);
    }
  }
}

function parityIssues(report) {
  return Object.entries(report)
    .filter(([, values]) => Array.isArray(values))
    .flatMap(([key, values]) => values.map((filename) => `${key}: ${filename}`));
}

export async function applySyncFromCheckout({
  rootDirectory = path.resolve('.'),
  checkoutDirectory,
  commit,
  translator,
}) {
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new Error(`Invalid upstream commit: ${commit}`);
  }
  const currentManual = path.join(rootDirectory, 'upstream', 'manual');
  const candidateManual = path.join(checkoutDirectory, 'manual');
  const changes = await diffManualDirectories(currentManual, candidateManual);
  const translatedFiles = [...changes.added, ...changes.changed].sort();
  if (translatedFiles.length > 0 && !translator?.translate) {
    throw new Error('Upstream Markdown changed, but no translation provider is configured');
  }

  const temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-zh-sync-stage-'));
  const stageRoot = path.join(temporary, 'stage');
  const backupRoot = path.join(temporary, 'backup');
  const stageUpstream = path.join(stageRoot, 'upstream');
  const stageTranslations = path.join(stageRoot, 'translations');
  let mutationStarted = false;

  try {
    await mkdir(stageUpstream, { recursive: true });
    await mkdir(path.join(stageUpstream, 'themes'), { recursive: true });
    await cp(candidateManual, path.join(stageUpstream, 'manual'), { recursive: true });
    await cp(path.join(rootDirectory, 'translations'), stageTranslations, { recursive: true });

    for (const filename of changes.removed) {
      await rm(path.join(stageTranslations, filename), { force: true });
    }

    const glossary = JSON.parse(await readFile(path.join(stageTranslations, 'glossary.json'), 'utf8'));
    for (const filename of translatedFiles) {
      const sourceMarkdown = await readFile(path.join(candidateManual, filename), 'utf8');
      const previousPath = path.join(rootDirectory, 'translations', filename);
      const previousTranslation = await exists(previousPath)
        ? await readFile(previousPath, 'utf8')
        : null;
      const translatedMarkdown = await translator.translate({
        filename,
        sourceMarkdown,
        previousTranslation,
        glossary,
      });
      const issues = validateTranslationCandidate({ filename, sourceMarkdown, translatedMarkdown });
      for (const leak of findEnglishLeaks(translatedMarkdown)) {
        issues.push(`${filename}:${leak.line}: possible English leak: ${leak.text}`);
      }
      if (issues.length > 0) {
        throw new Error(`Translation validation failed:\n${issues.join('\n')}`);
      }
      await writeFile(path.join(stageTranslations, filename), translatedMarkdown, 'utf8');
    }

    const targets = await collectReferencedAssets(candidateManual);
    await assertManualAssets(path.join(stageUpstream, 'manual'), targets);
    await copyReferencedThemes(checkoutDirectory, stageUpstream, targets);

    const licenseSource = path.join(checkoutDirectory, 'LICENSE');
    if (await exists(licenseSource)) {
      await cp(licenseSource, path.join(stageUpstream, 'LICENSE'));
    } else {
      await cp(path.join(rootDirectory, 'upstream', 'LICENSE'), path.join(stageUpstream, 'LICENSE'));
    }
    await writeFile(path.join(stageUpstream, 'COMMIT'), formatPinnedCommit(commit), 'utf8');

    const report = await compareManuals(path.join(stageUpstream, 'manual'), stageTranslations);
    const issues = parityIssues(report);
    if (issues.length > 0) {
      throw new Error(`Candidate snapshot parity failed:\n${issues.join('\n')}`);
    }

    await cp(path.join(rootDirectory, 'upstream', 'logo.txt'), path.join(stageUpstream, 'logo.txt'));
    if (await exists(path.join(rootDirectory, 'assets'))) {
      await cp(path.join(rootDirectory, 'assets'), path.join(stageRoot, 'assets'), { recursive: true });
    }
    const stageOutput = path.join(stageRoot, 'site');
    await buildSite({ rootDirectory: stageRoot, outputDirectory: stageOutput });
    const siteIssues = await collectSiteIssues({ rootDirectory: stageRoot, outputDirectory: stageOutput });
    if (siteIssues.length > 0) {
      throw new Error(`Candidate site integrity failed:\n${siteIssues.join('\n')}`);
    }

    await cp(path.join(rootDirectory, 'upstream'), path.join(backupRoot, 'upstream'), { recursive: true });
    await cp(path.join(rootDirectory, 'translations'), path.join(backupRoot, 'translations'), { recursive: true });
    mutationStarted = true;
    await replaceDirectory(path.join(stageUpstream, 'manual'), path.join(rootDirectory, 'upstream', 'manual'));
    await replaceDirectory(path.join(stageUpstream, 'themes'), path.join(rootDirectory, 'upstream', 'themes'));
    await replaceDirectory(stageTranslations, path.join(rootDirectory, 'translations'));
    await cp(path.join(stageUpstream, 'LICENSE'), path.join(rootDirectory, 'upstream', 'LICENSE'));
    await cp(path.join(stageUpstream, 'COMMIT'), path.join(rootDirectory, 'upstream', 'COMMIT'));

    return { commit: commit.toLowerCase(), changes, translatedFiles, referencedAssetCount: targets.length };
  } catch (error) {
    if (mutationStarted) {
      await replaceDirectory(path.join(backupRoot, 'upstream'), path.join(rootDirectory, 'upstream'));
      await replaceDirectory(path.join(backupRoot, 'translations'), path.join(rootDirectory, 'translations'));
    }
    throw error;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export async function resolveRemoteCommit({
  upstreamUrl = UPSTREAM_URL,
  branch = UPSTREAM_BRANCH,
} = {}) {
  const { stdout } = await execFileAsync('git', ['ls-remote', upstreamUrl, `refs/heads/${branch}`], {
    encoding: 'utf8',
  });
  return parseRemoteCommit(stdout);
}

async function checkoutUpstream({ destination, upstreamUrl = UPSTREAM_URL, branch = UPSTREAM_BRANCH }) {
  await execFileAsync('git', [
    'clone', '--depth', '1', '--single-branch', '--branch', branch, upstreamUrl, destination,
  ], { encoding: 'utf8' });
  const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: destination, encoding: 'utf8' });
  return stdout.trim().toLowerCase();
}

function argumentValue(argumentsList, name) {
  const index = argumentsList.indexOf(name);
  return index >= 0 ? argumentsList[index + 1] : undefined;
}

async function runCli() {
  const argumentsList = process.argv.slice(2);
  const rootDirectory = path.resolve(argumentValue(argumentsList, '--root') ?? '.');
  const pinned = parsePinnedCommit(await readFile(path.join(rootDirectory, 'upstream', 'COMMIT'), 'utf8'));
  const json = argumentsList.includes('--json');
  const checkOnly = argumentsList.includes('--check') || !argumentsList.includes('--apply');

  if (checkOnly) {
    const remote = await resolveRemoteCommit();
    const status = { branch: UPSTREAM_BRANCH, pinnedCommit: pinned, remoteCommit: remote, needsUpdate: pinned !== remote };
    console.log(json ? JSON.stringify(status, null, 2) : status.needsUpdate
      ? `Upstream update available: ${pinned} -> ${remote}`
      : `Upstream is current at ${pinned}`);
    if (status.needsUpdate) process.exitCode = 2;
    return;
  }

  const suppliedCheckout = argumentValue(argumentsList, '--source-dir');
  const force = argumentsList.includes('--force');
  let temporary = null;
  let checkoutDirectory;
  let commit;

  if (suppliedCheckout) {
    checkoutDirectory = path.resolve(suppliedCheckout);
    commit = argumentValue(argumentsList, '--source-commit')
      ?? (await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: checkoutDirectory, encoding: 'utf8' })).stdout.trim();
  } else {
    commit = await resolveRemoteCommit();
  }

  if (commit.toLowerCase() === pinned && !force) {
    console.log(`Upstream is already pinned at ${pinned}; no files changed.`);
    return;
  }

  const { stdout: syncTargetStatus } = await execFileAsync(
    'git',
    ['status', '--porcelain', '--', 'upstream', 'translations'],
    { cwd: rootDirectory, encoding: 'utf8' },
  );
  assertSyncTargetsClean(syncTargetStatus);

  try {
    if (!suppliedCheckout) {
      temporary = await mkdtemp(path.join(os.tmpdir(), 'omarchy-zh-upstream-'));
      checkoutDirectory = path.join(temporary, 'omarchy');
      const checkedOutCommit = await checkoutUpstream({ destination: checkoutDirectory });
      if (checkedOutCommit !== commit.toLowerCase()) {
        throw new Error(`Upstream moved during sync: expected ${commit}, cloned ${checkedOutCommit}. Run the command again.`);
      }
    }

    const changes = await diffManualDirectories(
      path.join(rootDirectory, 'upstream', 'manual'),
      path.join(checkoutDirectory, 'manual'),
    );
    const needsTranslation = changes.added.length + changes.changed.length > 0;
    const translator = needsTranslation ? createTranslationProvider() : undefined;
    const result = await applySyncFromCheckout({ rootDirectory, checkoutDirectory, commit, translator });
    await buildSite({ rootDirectory, outputDirectory: path.join(rootDirectory, 'site') });
    const issues = await collectSiteIssues({ rootDirectory, outputDirectory: path.join(rootDirectory, 'site') });
    if (issues.length > 0) {
      throw new Error(`Post-sync site validation failed:\n${issues.join('\n')}`);
    }
    console.log(json ? JSON.stringify(result, null, 2) : [
      `Pinned upstream ${result.commit}.`,
      `Translated ${result.translatedFiles.length} changed chapter(s).`,
      `Preserved ${result.referencedAssetCount} referenced local image target(s).`,
      'Build and site integrity validation passed. Review git diff before committing.',
    ].join('\n'));
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true });
  }
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  runCli().catch((error) => {
    console.error(error.stack ?? error.message);
    process.exitCode = 1;
  });
}
