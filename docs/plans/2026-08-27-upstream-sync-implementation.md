# Omarchy 上游中文同步 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为固定快照式中文手册增加可重复执行的上游变化检测、中文转换、守恒校验和 GitHub 手动同步入口。

**Architecture:** 以 `basecamp/omarchy` 的 `quattro` 分支为唯一上游，先在临时目录克隆并计算文件级差异，再用显式配置的 OpenAI 兼容接口仅重译新增或变化的 Markdown。所有候选译文必须通过章节、标题层级、代码块、图片目标、链接目标与中文覆盖校验后才能写回工作区；生成站点仍由现有静态构建器完成。

**Tech Stack:** Node.js 20 ESM、Node test runner、Git CLI、OpenAI-compatible Chat Completions API、GitHub Actions、GitHub CLI。

---

### Task 1: 定义同步领域模型

**Files:**
- Create: `src/upstream-sync.mjs`
- Test: `test/upstream-sync.test.mjs`

1. 先写差异分类、提交解析和图片引用收集的失败测试。
2. 运行 `node --test test/upstream-sync.test.mjs`，确认因导出不存在而失败。
3. 实现最小纯函数，并再次运行该测试直到通过。

### Task 2: 定义翻译适配器和守恒门禁

**Files:**
- Create: `src/translation-provider.mjs`
- Test: `test/translation-provider.test.mjs`
- Modify: `src/validate.mjs`
- Modify: `test/site-integrity.test.mjs`

1. 先写缺少配置时明确失败、请求格式、Markdown 外壳清理和技术内容不一致时拒绝的失败测试。
2. 用注入的 `fetch` 测试 OpenAI 兼容接口，不访问真实模型、不记录密钥。
3. 将固定页面数和图片数校验改为由当前上游内容动态推导。

### Task 3: 实现可执行同步入口

**Files:**
- Create: `src/sync-upstream.mjs`
- Modify: `package.json`
- Test: `test/sync-upstream.test.mjs`

1. 提供 `npm run upstream:check`，比较 `upstream/COMMIT` 与远端分支 HEAD。
2. 提供 `npm run upstream:sync`，在临时目录准备新上游、重译变化章节、校验并写回。
3. 支持 `--source-dir` 以便测试和离线演练；未配置翻译接口时遇到正文变化必须失败。
4. 同步后执行构建与完整性校验，保留工作区差异供人工复核，不自动提交。

### Task 4: 增加 GitHub 手动/定时入口

**Files:**
- Create: `.github/workflows/upstream-sync.yml`

1. 每周定时运行变化检测，使上游漂移在 Actions 中可见。
2. `workflow_dispatch` 的 apply 模式在仓库变量和密钥已配置时完成中文同步、测试和构建，并创建同步 PR。
3. 权限限制为工作流所需的 contents 和 pull-requests；密钥只从 Actions Secrets 注入。

### Task 5: 完善 README 与发布验证

**Files:**
- Modify: `README.md`
- Modify: `NOTICE.md`

1. 记录一键命令、提供商配置示例、数据流、失败策略、人工复核、GitHub Actions 配置和回滚方式。
2. 运行 `npm test`、`npm run build`、`npm run check`、`npm run upstream:check`、`git diff --check` 和敏感信息扫描。
3. 提交到 `main`，创建 `topbat/omarchy-zh` 私有仓库，推送并核对本地 HEAD、`origin/main`、可见性与工作区状态。
