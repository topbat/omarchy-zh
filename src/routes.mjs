import path from 'node:path';

export function chapterRoute(chapter) {
  return chapter.slug ? `/manual/${chapter.slug}/` : '/manual/';
}

export function tocRoute() {
  return '/manual/toc/';
}

export function outputPathForRoute(route) {
  const normalized = route.replace(/^\/+|\/+$/g, '');
  return path.posix.join(normalized, 'index.html');
}

