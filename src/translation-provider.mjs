import {
  extractCodeBlocks,
  extractImageTargets,
  extractLinkTargets,
} from './parity.mjs';

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function headingLevels(markdown) {
  const withoutCode = markdown.replace(/^```[^\r\n]*\r?\n[\s\S]*?^```\s*$/gm, '');
  return [...withoutCode.matchAll(/^(#{1,6})\s+/gm)].map((match) => match[1].length);
}

function stripMarkdownEnvelope(content) {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:markdown|md)?\s*\r?\n([\s\S]*?)\r?\n```$/i);
  return (match ? match[1] : trimmed).replace(/\r\n/g, '\n');
}

export function loadTranslationConfig(environment = process.env) {
  const required = [
    'OMARCHY_TRANSLATION_API_URL',
    'OMARCHY_TRANSLATION_API_KEY',
    'OMARCHY_TRANSLATION_MODEL',
  ];
  const missing = required.filter((name) => !environment[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing translation configuration: ${missing.join(', ')}`);
  }
  const maxTokens = Number(environment.OMARCHY_TRANSLATION_MAX_TOKENS ?? 32768);
  if (!Number.isSafeInteger(maxTokens) || maxTokens <= 0) {
    throw new Error('OMARCHY_TRANSLATION_MAX_TOKENS must be a positive integer');
  }
  return {
    apiUrl: environment.OMARCHY_TRANSLATION_API_URL.replace(/\/+$/, ''),
    apiKey: environment.OMARCHY_TRANSLATION_API_KEY,
    model: environment.OMARCHY_TRANSLATION_MODEL,
    maxTokens,
  };
}

export function validateTranslationCandidate({ filename, sourceMarkdown, translatedMarkdown }) {
  const issues = [];
  if (!same(extractCodeBlocks(sourceMarkdown), extractCodeBlocks(translatedMarkdown))) {
    issues.push(`${filename}: code blocks changed`);
  }
  if (!same(extractImageTargets(sourceMarkdown), extractImageTargets(translatedMarkdown))) {
    issues.push(`${filename}: image targets changed`);
  }
  if (!same(extractLinkTargets(sourceMarkdown), extractLinkTargets(translatedMarkdown))) {
    issues.push(`${filename}: link targets changed`);
  }
  if (!same(headingLevels(sourceMarkdown), headingLevels(translatedMarkdown))) {
    issues.push(`${filename}: heading structure changed`);
  }
  if (!/[\p{Script=Han}]/u.test(translatedMarkdown.replace(/^```[^\r\n]*\r?\n[\s\S]*?^```\s*$/gm, ''))) {
    issues.push(`${filename}: translation contains no Chinese text`);
  }
  return issues;
}

function translationPrompt({ filename, sourceMarkdown, previousTranslation, glossary }) {
  const previous = previousTranslation
    ? `\n现有中文译文（仅作为措辞与增量更新参考）：\n<previous>\n${previousTranslation}\n</previous>\n`
    : '';
  return `请把 Omarchy 官方手册文件 ${filename} 完整翻译为专业、自然的简体中文。\n\n硬性规则：\n1. 输出完整 Markdown，且只输出 Markdown 正文。\n2. 所有代码块（fenced code block）的语言标签、内容、空白和顺序必须逐字符保持不变。\n3. 所有链接目标与图片目标必须逐字符保持不变；可翻译链接文字和图片替代文本。\n4. 保持标题数量、层级、表格结构和章节顺序。\n5. 产品名、命令、参数、快捷键、路径、环境变量、配置键与专业缩写保持原样。\n6. 不得加入原文没有的信息，不得留下 TODO 或待翻译标记。\n\n术语表：\n${JSON.stringify(glossary, null, 2)}\n${previous}\n官方英文原文：\n<source>\n${sourceMarkdown}\n</source>`;
}

export function createTranslationProvider({ config = loadTranslationConfig(), fetchImpl = fetch } = {}) {
  return {
    async translate({ filename, sourceMarkdown, previousTranslation, glossary }) {
      const response = await fetchImpl(`${config.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          temperature: 0,
          max_tokens: config.maxTokens ?? 32768,
          messages: [
            {
              role: 'system',
              content: '你是严谨的技术文档本地化编辑，必须遵守格式和技术内容守恒规则。',
            },
            {
              role: 'user',
              content: translationPrompt({ filename, sourceMarkdown, previousTranslation, glossary }),
            },
          ],
        }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Translation API request failed (${response.status}): ${detail.slice(0, 500)}`);
      }
      const payload = await response.json();
      const choice = payload?.choices?.[0];
      if (choice?.finish_reason === 'length') {
        throw new Error(`Translation response was truncated for ${filename}; increase OMARCHY_TRANSLATION_MAX_TOKENS or choose a model with a larger output limit`);
      }
      const content = choice?.message?.content;
      if (typeof content !== 'string' || !content.trim()) {
        throw new Error(`Translation API returned no Markdown for ${filename}`);
      }
      return stripMarkdownEnvelope(content);
    },
  };
}
