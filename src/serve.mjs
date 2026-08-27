import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
]);

export function resolveStaticPath(siteDirectory, requestPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath.split('?', 1)[0]);
  } catch {
    return null;
  }
  const segments = decoded.split('/');
  if (segments.includes('..')) {
    return null;
  }
  const relative = decoded.replace(/^\/+/, '');
  const target = path.resolve(siteDirectory, relative, decoded.endsWith('/') ? 'index.html' : '');
  const root = `${path.resolve(siteDirectory)}${path.sep}`;
  if (target !== path.resolve(siteDirectory) && !target.startsWith(root)) {
    return null;
  }
  return target;
}

export function createStaticServer(siteDirectory) {
  return createServer(async (request, response) => {
    if (request.url === '/') {
      response.writeHead(302, { Location: '/manual/' });
      response.end();
      return;
    }
    const target = resolveStaticPath(siteDirectory, request.url ?? '/');
    if (!target) {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Bad request');
      return;
    }
    try {
      const metadata = await stat(target);
      if (!metadata.isFile()) {
        throw new Error('Not a file');
      }
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Length': metadata.size,
        'Content-Type': contentTypes.get(path.extname(target)) ?? 'application/octet-stream',
      });
      createReadStream(target).pipe(response);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const siteDirectory = path.resolve('site');
  const host = process.env.HOST ?? '127.0.0.1';
  const port = Number(process.env.PORT ?? 4173);
  const server = createStaticServer(siteDirectory);
  server.listen(port, host, () => {
    console.log(`Omarchy 中文手册运行于 http://${host}:${port}/manual/`);
  });
}

