# Omarchy 中文手册

这是 [Omarchy 官方手册](https://omarchy.org/manual/) 的非官方简体中文本地化站点。它完整覆盖当前上游目录和全部章节，保留官方命令、快捷键、配置、代码块、链接、图片和终端视觉；同时提供可重复执行的上游变化检测与中文同步入口。

![Omarchy 中文手册桌面端](evidence/implementation/manual-home-desktop-top.png)

## 初始基线（2026-08-27）

- 上游仓库：[`basecamp/omarchy`](https://github.com/basecamp/omarchy)
- 上游分支：`quattro`
- 固定提交：以 [`upstream/COMMIT`](upstream/COMMIT) 为准
- 页面：51 个章节页面 + 1 个完整目录页
- 图片：44 张手册 WebP + 38 张主题 PNG
- 代码块：39 个，逐块与上游进行文本比对
- 路由：与官方 `/manual/` 路径保持一致

本项目不代表 Omarchy 官方，也不构成官方背书。Omarchy、其标志和第三方产品名称属于各自权利人。

## 功能

- 完整中文目录和当前上游的全部章节
- 桌面端粘性左侧章节导航及当前章节状态
- 中文标题和正文全文搜索，按 `/` 快速聚焦
- 搜索结果键盘选择、Escape 关闭及直接跳转
- 上一章、完整目录、下一章导航
- 中文标题锚点及官方英文深链接兼容别名
- 代码高亮、表格、引用、图片与横向代码滚动
- 与官方相同的 64em 桌面/移动响应式断点
- 本地字体和图片，不依赖官方站点热链

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm ci
npm test
npm run build
npm run check
npm run dev
```

浏览器打开：<http://127.0.0.1:4173/manual/>

`npm run build` 会重新生成 `site/`。`npm run check` 会检查所有生成页面、内部路由、标题锚点、图片、翻译标记、英文漏译以及与上游的代码/图片/链接一致性。也可以用 `npm run verify` 一次完成测试、构建和完整性检查。

## 内容数据流

```text
upstream/manual/*.md ─┐
                     ├─ 结构与技术内容一致性检查 ─┐
translations/*.md ───┘                            │
                                                  ├─ Node 静态生成器 ── site/manual/**/index.html
upstream/manual/images/*.webp ────────────────────┤
upstream/themes/*/preview*.png ───────────────────┤
assets/css + assets/js + assets/fonts ────────────┘
```

日常构建不会自动访问网络，也不会静默更新上游。这样可以保证一次发布中的原文、译文和资源始终对应同一个提交。只有下文的显式同步命令会访问 GitHub 和已配置的翻译接口。

## 翻译边界

会翻译：

- 页面标题、章节标题和说明性正文
- 目录、搜索、翻页和非官方声明
- 表格中的说明文字和图片替代文本

保持原样：

- Omarchy、Arch Linux、Hyprland、Quickshell、Neovim 等产品名称
- TUI、GUI、CLI、API、SSH、VM 等专业缩写
- 命令、参数、快捷键、文件路径、环境变量和配置键值
- 代码块、URL、图片文件与设备型号

统一术语位于 `translations/glossary.json`。

## 项目结构

```text
assets/                 本地 CSS、搜索脚本和 JetBrains Mono 字体
docs/plans/             已确认的设计和实施计划
evidence/source/        官方站桌面/移动视觉证据
evidence/implementation 本地实现浏览器截图
evidence/comparisons/   同尺寸源站/实现并排对比
src/                    内容、路由、渲染、搜索、构建和校验模块
test/                   Node 测试套件
translations/           与当前上游同名的中文译文和术语表
upstream/               固定提交的官方原文、图片与许可证
design-qa.md            响应式和视觉验收报告
```

## 跟进官方手册更新

### 1. 检查上游是否变化

```bash
npm run upstream:check
```

该命令只读取 `basecamp/omarchy` 的 `quattro` 分支 HEAD，并与 `upstream/COMMIT` 比较，不改文件。退出码含义：`0` 表示已同频，`2` 表示发现新提交，`1` 表示网络或 Git 错误。

### 2. 配置中文翻译器

同步器使用 OpenAI-compatible Chat Completions 接口，不绑定单一厂商。必须显式配置接口地址、密钥和模型；缺少任何一项都会停止，不会静默改用其他模型。

PowerShell 示例：

```powershell
$env:OMARCHY_TRANSLATION_API_URL = 'https://your-provider.example/v1'
$env:OMARCHY_TRANSLATION_API_KEY = '<仅放在环境变量或 GitHub Secret 中>'
$env:OMARCHY_TRANSLATION_MODEL = '<支持长上下文的模型名>'
# 可选，默认 32768；遇到合法超长章节时再按模型能力调整
$env:OMARCHY_TRANSLATION_MAX_TOKENS = '32768'
```

不要把真实密钥写进 `.env`、README、Git 历史或命令输出。可使用 OpenAI、Qwen、DeepSeek 等提供的兼容接口，但模型必须能输出完整长篇 Markdown；接口地址和模型名以所选提供商的当前官方文档为准。

### 3. 执行同步与中文转换

```bash
npm run upstream:sync
```

一次同步会完成以下数据流：

```text
quattro HEAD
  │
  ├─ 临时浅克隆 ── 章节级 added / changed / removed 差异
  │                    │
  │                    ├─ unchanged：复用现有中文译文
  │                    └─ added / changed：调用显式配置的翻译模型
  │
  ├─ 候选区守恒门禁：标题层级 / 代码块 / 链接目标 / 图片目标 / 中文覆盖
  ├─ 复制官方 Markdown、许可证及正文实际引用的本地图片
  ├─ 更新 upstream/COMMIT
  └─ npm run build + npm run check
```

模型会收到旧译文作为增量措辞参考，但必须返回完整的新译文。任何代码块、链接地址、图片地址或标题结构被模型改动，候选内容都会被拒绝；拒绝发生在写回前。正常写回阶段若发生文件错误，同步器会恢复原快照。

同步命令不会自动提交或推送。完成后应至少检查：

```bash
git status --short
git diff -- upstream/COMMIT upstream/manual upstream/themes translations
npm run verify
```

人工复核重点是中文表达、专业术语、新增功能说明以及桌面端和 390×844 移动端视觉。上游 Markdown 应视为不可信输入；即使自动守恒校验通过，也不要跳过 PR 审核或直接自动合并。

## GitHub Actions 同步入口

工作流位于 [`.github/workflows/upstream-sync.yml`](.github/workflows/upstream-sync.yml)：

- 每周一 09:00（北京时间）只检查上游；发现变化时工作流以失败状态提醒维护者。
- 在 Actions 页面手动运行 `Omarchy upstream sync`，并将 `apply` 设为 `true`，即可翻译变化章节、执行完整校验并新建审核 PR。
- 工作流不会自动合并 PR，也不会直接改写 `main`。

首次使用 apply 模式前，在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 配置：

| 类型 | 名称 | 用途 |
| --- | --- | --- |
| Repository variable | `OMARCHY_TRANSLATION_API_URL` | OpenAI-compatible API 根地址 |
| Repository variable | `OMARCHY_TRANSLATION_MODEL` | 明确选定的翻译模型 |
| Repository secret | `OMARCHY_TRANSLATION_API_KEY` | 翻译接口密钥 |

定时检查只有只读权限；只有手动 apply 任务拥有创建分支和 PR 所需的最小写权限。翻译密钥只注入 apply 任务。

## 更新失败与恢复

- 远端不可达：当前快照不变，稍后重试 `npm run upstream:check`。
- 翻译接口未配置或返回错误：当前快照不变，检查三个环境变量和提供商配额。
- 守恒校验失败：查看报错章节，修正模型配置或人工更新对应译文后重新验证。
- 同步成功但人工复核不通过：不要提交；确认开始前工作区干净后，可用 `git restore --source=HEAD -- upstream translations` 放弃本次同步变化。
- 官方页面结构或视觉发生变化：除正文同步外，重新执行桌面端和 390×844 移动端浏览器验收，并更新 `design-qa.md`。

## 许可证与来源

本项目原创生成器、测试和交互代码采用 [MIT License](LICENSE)。官方手册内容和图片保留在 `upstream/` 中，并附带其原始 MIT 许可证。JetBrains Mono 使用 SIL Open Font License 1.1。第三方译文参考、视觉样式和不属于本项目的品牌资产不自动包含在本项目 MIT 授权范围内，详细说明见 [NOTICE.md](NOTICE.md)。

