# Omarchy 中文手册站 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建并验证一套完整覆盖 Omarchy 官方目录页和 51 个章节的简体中文静态手册站。

**Architecture:** 使用 Node.js 读取固定上游 Markdown 快照和一一对应的中文译文，生成纯静态 HTML、中文搜索索引、目录页与本地静态资源。内容一致性检查把代码块、图片、链接、章节顺序和漏译检测作为阻断条件，浏览器验收再核对桌面与移动布局。

**Tech Stack:** Node.js、markdown-it、highlight.js、原生 HTML/CSS/JavaScript、node:test、agent-browser。

---

### Task 1: 固定上游内容与视觉证据

**Files:**
- Create: `upstream/COMMIT`
- Create: `upstream/LICENSE`
- Create: `upstream/manual/*.md`
- Create: `upstream/manual/images/*.webp`
- Create: `evidence/source/*.png`
- Create: `evidence/source/page-structure.txt`

**Steps:**
1. 用 `agent-browser` 分别以 1440×900 和 390×844 打开官方手册，采集首页、目录页、图片密集页、代码密集页与交互状态。
2. 从 `basecamp/omarchy` 的 `quattro` 分支固定当前提交，复制 51 个 Markdown、44 张图片和许可证。
3. 记录提交 SHA，不在后续构建中自动更新。
4. 运行计数命令，期望 51 个 Markdown、44 张 WebP、39 个代码块和 82 个图片引用。
5. 提交：`chore: snapshot official omarchy manual`。

### Task 2: 先写内容模型与路由测试

**Files:**
- Create: `package.json`
- Create: `test/content-model.test.mjs`
- Create: `test/routes.test.mjs`
- Create: `src/content.mjs`
- Create: `src/routes.mjs`

**Steps:**
1. 写失败测试：章节文件按数字排序，首页 slug 为空，其余 slug 来自文件名，目录页路径固定为 `/manual/toc/`。
2. 运行 `npm test`，确认因模块缺失而失败。
3. 实现最小内容模型和路由函数。
4. 再次运行 `npm test`，确认测试通过。
5. 提交：`feat: add manual content model and routes`。

### Task 3: 先写结构一致性测试

**Files:**
- Create: `test/parity.test.mjs`
- Create: `src/parity.mjs`
- Create: `translations/glossary.json`
- Create: `translations/*.md`

**Steps:**
1. 写失败测试：译文必须覆盖 51 个同名文件，标题、代码块数量与文本、图片目标、Markdown 链接目标保持一致。
2. 运行指定测试，确认译文目录缺失导致预期失败。
3. 导入第三方 MIT 译文作为参考稿，逐页对照当前官方快照并补齐差异。
4. 实现结构解析与一致性检查。
5. 运行测试，修复所有缺失段落、代码变化、图片或链接变化。
6. 提交：`feat: add complete chinese manual translations`。

### Task 4: 先写静态页面生成测试

**Files:**
- Create: `test/render.test.mjs`
- Create: `src/render.mjs`
- Create: `src/build.mjs`
- Create: `src/templates.mjs`

**Steps:**
1. 写失败测试：生成页面必须包含 `lang=zh-CN`、中文标题、左侧 01–51 目录、当前页状态、标题锚点、前后页导航和非官方声明。
2. 运行测试，确认渲染模块缺失导致预期失败。
3. 实现 Markdown 渲染、模板和页面生成。
4. 运行测试并构建 `site/`，确认生成 52 个可访问 HTML 路由。
5. 提交：`feat: generate localized static manual pages`。

### Task 5: 先写搜索和交互测试

**Files:**
- Create: `test/search.test.mjs`
- Create: `src/search.mjs`
- Create: `assets/js/manual.js`
- Create: `assets/css/*.css`

**Steps:**
1. 写失败测试：搜索索引包含 51 个中文章节，中文关键词可匹配标题和正文，搜索结果 URL 正确。
2. 运行测试，确认搜索模块缺失导致预期失败。
3. 实现搜索索引构建、中文分词兼容的子串匹配、`/` 聚焦和 Escape 关闭结果。
4. 本地化并整理官方 CSS、字体和响应式规则，不复制统计脚本。
5. 运行单元测试和构建。
6. 提交：`feat: add chinese search and faithful manual styling`。

### Task 6: 先写站点完整性与漏译测试

**Files:**
- Create: `test/site-integrity.test.mjs`
- Create: `src/validate.mjs`
- Modify: `package.json`

**Steps:**
1. 写失败测试：所有内部链接、图片、锚点、代码块和页面数量必须有效；不允许 TODO、待翻译或空正文。
2. 增加英文漏译检测，排除代码、URL、产品名、命令和术语表允许项。
3. 运行测试确认发现现存问题。
4. 修正译文与生成器，直到 `npm test`、`npm run build`、`npm run check` 全部通过。
5. 提交：`test: enforce translated site integrity`。

### Task 7: 浏览器验收与设计 QA

**Files:**
- Create: `evidence/implementation/*.png`
- Create: `evidence/comparisons/*.png`
- Create: `design-qa.md`

**Steps:**
1. 启动本地静态服务器并保持运行。
2. 用 `agent-browser` 在 1440×900 和 390×844 采集与源站相同的路由、滚动位置和状态。
3. 验证首页、目录、图片页、代码页、搜索、前后页导航和移动端无横向溢出；检查浏览器控制台错误。
4. 把同尺寸源图和实现图组合比较，记录 P0/P1/P2/P3。
5. 对每个 P0/P1/P2 写失败测试或可复现验收，再修复并重新截图比较。
6. 只有没有可执行的 P0/P1/P2 时，将 `design-qa.md` 写为 `final result: passed`。
7. 提交：`test: complete responsive visual acceptance`。

### Task 8: 文档、最终验证与合并

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Modify: `package.json`

**Steps:**
1. 编写来源、许可证、翻译边界、项目结构、本地运行、构建和上游更新说明。
2. 运行 `npm ci`、`npm test`、`npm run build`、`npm run check`。
3. 重新运行关键浏览器验收并确认 `design-qa.md` 为 `passed`。
4. 检查 `git status`、提交范围和敏感信息。
5. 使用 `finishing-a-development-branch` 流程将功能分支合并回 `main`。
6. 在项目根目录重新安装、测试、构建和启动预览，交付可点击本地地址。

