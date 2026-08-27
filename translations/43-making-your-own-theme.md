# 制作自己的主题

你可以将自己的主题添加到 `~/.config/omarchy/themes`。只需复制一个现有主题作为基础（查看 `/usr/share/omarchy/themes`），然后尽情调整。只要主题位于该文件夹中，它就会被纳入主题选择菜单。

你需要调整的主要文件是 `colors.toml`。它定义了颜色集合，随后用于为终端（Foot/Alacritty/Ghostty/Kitty）、btop、Chromium、Hyprland、Neovim、Helix、VSCode、Obsidian 以及整个 Omarchy shell（顶部栏、菜单、通知、OSD 和锁定屏幕）生成配置。

你还可以使用随附的 Aether 应用，通过漂亮的图形界面调整颜色并搜索背景，从而创建新主题。按下 `Super + Alt + Space`，通过应用菜单启动它即可。

### 已安装主题可以包含的内容

你在 `~/.config/omarchy/themes` 中编写的主题可以包含任意内容——这是你的机器和你的文件，Omarchy 会应用其中的全部内容。

你通过别人的仓库使用 `omarchy theme install` 安装的主题会保留所有颜色相关内容，并删除少数会在你的机器上运行代码的文件：任何 `.lua` 文件、终端配置（`alacritty.toml`、`foot.ini`、`ghostty.conf`、`kitty.conf`）以及 `vscode.json`。主题的 `hyprland.lua` 是登录时由合成器运行的 Lua 文件，终端配置会指定终端启动的程序，而 `vscode.json` 会指定要安装的 VSCode 扩展。安装他人的主题应该只改变桌面的外观，而不改变它运行的内容。

其他内容仍会完全按照主题作者编写的方式工作——`btop.theme`、`chromium.theme`、`helix.toml`、`icons.theme`、`shell.toml`、背景和预览都会保留。只有被删除的内容会在你的机器上根据 `colors.toml` 重新生成。

Omarchy 根据主题内部是否有自己的 git 仓库来区分两者；`omarchy theme install` 克隆主题时会留下该仓库。因此，你编写的主题仍然属于你，而从互联网获取的主题则只保留颜色相关内容。

### 浅色模式

如果你正在制作浅色模式主题，请在 `colors.toml` 顶部设置 `mode = "light"`。这样，所有应用就会自动配套使用浅色模式。（过去在主题根目录放置一个名为 `light.mode` 的空文件的方法仍然有效。）

### 图标颜色

如果你希望文件管理器图标与主题颜色匹配，请添加名为 `icons.theme` 的文件，并在其中写入你想使用的图标集名称。默认选项为：`Yaru Yaru-blue Yaru-dark Yaru-magenta Yaru-olive Yaru-prussiangreen Yaru-purple Yaru-red Yaru-sage Yaru-wartybrown Yaru-yellow`。

### 解锁图片

带有 `unlock.png` 和 `preview-unlock.png` 图片的主题会显示在 _Style > Unlock_ 下。你的 `unlock.png` 最好是透明 png。你可以使用 `omarchy plymouth preview` 创建预览图片。

### 为 Omarchy 未覆盖的应用设置主题

如果你使用的应用不在上述列表中，可以通过模板教会 Omarchy 为它设置主题。将文件放入 `~/.config/omarchy/themed/`，文件名使用它生成的配置名并加上 `.tpl` 扩展名，然后使用 `{{ background }}`、`{{ foreground }}`、`{{ accent }}`、`{{ red }}`、`{{ color0 }}` 到 `{{ color15 }}` 以及调色板中的其余颜色作为占位符编写配置。每次切换主题时，都会使用该主题的颜色重新生成文件。

该文件夹中有一个注释完整的 `alacritty.toml.tpl.sample`，可以复制它作为起点——其中列出了所有可用变量，以及供应用在需要时使用的 `_strip` 和 `_rgb` 修饰符，前者去除 `#`，后者转换为十进制 RGB。你的模板优先级高于 Omarchy 自己的模板，因此也可以用它来覆盖内置应用的主题设置方式。

### 分发你的主题

如果你想分发主题供他人使用，需要将其放到公共 git 服务器上，例如 GitHub。之后，他人就可以在 Omarchy 菜单中使用该 URL 通过 _Install > Style > Theme_ 安装主题。建议遵循 `omarchy-[themename]-theme` 的命名约定，这样安装后，主题会在主题选择菜单中正确显示为 `[themename]`。

请记住，主题从仓库安装后，其中附带的任何 `.lua` 文件、终端配置或 `vscode.json` 都会被删除，因此不要围绕这些文件来设计主题。

你可以将主题加入[额外主题页面](https://omarchy.org/themes/)；只需向 [omarchy-site 仓库](https://github.com/omacom-io/omarchy-site)提交 pull request。
