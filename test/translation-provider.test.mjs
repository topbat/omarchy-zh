import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTranslationProvider,
  loadTranslationConfig,
  validateTranslationCandidate,
} from '../src/translation-provider.mjs';

const source = [
  '# Navigation',
  '',
  'Use the terminal.',
  '',
  '[Manual](02-getting-started.md)',
  '',
  '![Layout](images/layout.webp)',
  '',
  '```bash',
  'echo "do not translate"',
  '```',
].join('\n');

const translated = [
  '# 导航',
  '',
  '使用终端。',
  '',
  '[手册](02-getting-started.md)',
  '',
  '![布局](images/layout.webp)',
  '',
  '```bash',
  'echo "do not translate"',
  '```',
].join('\n');

test('loadTranslationConfig requires an explicit OpenAI-compatible endpoint, key, and model', () => {
  assert.throws(
    () => loadTranslationConfig({}),
    /OMARCHY_TRANSLATION_API_URL, OMARCHY_TRANSLATION_API_KEY, OMARCHY_TRANSLATION_MODEL/,
  );
  assert.deepEqual(loadTranslationConfig({
    OMARCHY_TRANSLATION_API_URL: 'https://api.example.test/v1/',
    OMARCHY_TRANSLATION_API_KEY: 'secret-value',
    OMARCHY_TRANSLATION_MODEL: 'model-name',
  }), {
    apiUrl: 'https://api.example.test/v1',
    apiKey: 'secret-value',
    model: 'model-name',
    maxTokens: 32768,
  });
});

test('translation provider sends a complete preservation prompt and unwraps markdown output', async () => {
  let request;
  const provider = createTranslationProvider({
    config: {
      apiUrl: 'https://api.example.test/v1',
      apiKey: 'secret-value',
      model: 'model-name',
      maxTokens: 32768,
    },
    fetchImpl: async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: `\`\`\`markdown\n${translated}\n\`\`\`` } }] }),
      };
    },
  });

  const result = await provider.translate({
    filename: '04-navigation.md',
    sourceMarkdown: source,
    previousTranslation: translated,
    glossary: { Navigation: '导航' },
  });

  assert.equal(result, translated);
  assert.equal(request.url, 'https://api.example.test/v1/chat/completions');
  assert.equal(request.options.headers.Authorization, 'Bearer secret-value');
  const payload = JSON.parse(request.options.body);
  assert.equal(payload.model, 'model-name');
  assert.equal(payload.max_tokens, 32768);
  assert.match(payload.messages[1].content, /04-navigation\.md/);
  assert.match(payload.messages[1].content, /代码块.*逐字符/u);
  assert.match(payload.messages[1].content, /Navigation.*导航/u);
  assert.doesNotMatch(request.options.body, /secret-value/);
});

test('translation provider rejects a response reported as truncated', async () => {
  const provider = createTranslationProvider({
    config: {
      apiUrl: 'https://api.example.test/v1',
      apiKey: 'secret-value',
      model: 'model-name',
      maxTokens: 32768,
    },
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ choices: [{ finish_reason: 'length', message: { content: translated } }] }),
    }),
  });
  await assert.rejects(
    provider.translate({ filename: '04-navigation.md', sourceMarkdown: source, glossary: {} }),
    /truncated.*04-navigation\.md/i,
  );
});

test('validateTranslationCandidate accepts Chinese prose with preserved technical content', () => {
  assert.deepEqual(validateTranslationCandidate({ filename: '04-navigation.md', sourceMarkdown: source, translatedMarkdown: translated }), []);
});

test('validateTranslationCandidate rejects changed code, links, images, heading structure, and missing Chinese', () => {
  const invalid = source
    .replace('echo "do not translate"', 'echo "changed"')
    .replace('02-getting-started.md', 'wrong.md')
    .replace('images/layout.webp', 'images/wrong.webp')
    .replace('# Navigation', '## Navigation');
  const issues = validateTranslationCandidate({ filename: '04-navigation.md', sourceMarkdown: source, translatedMarkdown: invalid });
  assert.ok(issues.some((issue) => issue.includes('code blocks')));
  assert.ok(issues.some((issue) => issue.includes('link targets')));
  assert.ok(issues.some((issue) => issue.includes('image targets')));
  assert.ok(issues.some((issue) => issue.includes('heading structure')));
  assert.ok(issues.some((issue) => issue.includes('Chinese text')));
});
