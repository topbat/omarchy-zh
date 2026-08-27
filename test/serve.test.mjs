import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolveStaticPath } from '../src/serve.mjs';

const siteDirectory = path.resolve('site');

test('resolveStaticPath maps clean manual routes to directory indexes', () => {
  assert.equal(resolveStaticPath(siteDirectory, '/manual/'), path.join(siteDirectory, 'manual', 'index.html'));
  assert.equal(resolveStaticPath(siteDirectory, '/manual/navigation/'), path.join(siteDirectory, 'manual', 'navigation', 'index.html'));
  assert.equal(resolveStaticPath(siteDirectory, '/assets/css/site.css'), path.join(siteDirectory, 'assets', 'css', 'site.css'));
});

test('resolveStaticPath rejects traversal outside the built site', () => {
  assert.equal(resolveStaticPath(siteDirectory, '/../../package.json'), null);
  assert.equal(resolveStaticPath(siteDirectory, '/%2e%2e/%2e%2e/package.json'), null);
});

