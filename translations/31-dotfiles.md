# Dotfiles

Omarchy 主要通过位于 `~/.config` 中的所谓 dotfiles 进行配置。这些文件被视为供你修改的文件。位于 `/usr/share/omarchy` 中的文件属于 Omarchy 本身，你不应该修改它们。如果需要更改 `/usr/share/omarchy` 中的任何内容，应当改为在 `~/.config` 中覆盖相应值。

可以直接从 Omarchy 菜单（`Super + Space`）编辑关键配置，例如 _Setup > Monitors_、_Setup > Keybindings_、_Setup > Input_ 和 _Setup > Config > [file]_。这样操作时，任何需要在编辑配置后重启的进程，都会在你退出编辑器后自动重启（默认编辑器是 Neovim，请记住使用 `:wq`！但你可以通过 _Setup > Defaults > Editor_ 更改编辑器）。

下面列出 `~/.config` 中的关键文件及其控制内容：

| 文件                  | 作用              |
| ----------------------- | --------------------- |
| `~/.config/hypr/hyprland.lua` | Hyprland 主配置。加载 Omarchy 默认设置以及下面的覆盖文件。[详细了解 Hyprland 配置](https://wiki.hypr.land/Configuring/)。  |
| `~/.config/hypr/bindings.lua` | 你自己的快捷键绑定以及对默认设置的覆盖。 |
| `~/.config/hypr/monitors.lua` | 控制显示器、分辨率和位置。 |
| `~/.config/hypr/input.lua` | 控制键盘布局、鼠标和触控板设置。 |
| `~/.config/hypr/looknfeel.lua` | 控制间距、边框、动画和其他外观设置。 |
| `~/.config/hypr/autostart.lua` | 控制随会话启动的额外进程。 |
| `~/.config/omarchy/shell.json` | 控制 Omarchy shell：顶栏位置、布局和小组件，以及屏保、锁定和空闲计时。 |
| `~/.config/foot/foot.ini` | 控制终端（foot 是默认终端）。 |
| `~/.XCompose` | 定义快速访问的表情符号以及姓名/电子邮件自动补全。修改后务必运行 `omarchy-restart-xcompose`。 |

如果你为了调整自己的设置而做了大量修改，最好备份所有这些 dotfiles。[Stow 是一个很好的工具](https://www.youtube.com/watch?v=NoFiYOqnC4o)。

### 随会话启动自己的应用

如果希望某个程序在每次登录时运行，例如同步守护进程、聊天应用或自己的脚本，请将它放入 `~/.config/hypr/autostart.lua`：

```lua
o.launch_on_start("my-service")
```

这会将该命令作为会话的一部分启动，因此你退出登录时它也会被正确清理。

### 在系统事件上运行脚本

Omarchy 会在一些时刻触发钩子，你可以让自己的脚本挂接到这些钩子上。它们位于 `~/.config/omarchy/hooks/<event>.d/`，每个事件对应一个目录，其中的每个可执行文件都会在事件发生时运行：

| 事件 | 运行时机 |
| ----- | ------------ |
| `post-boot` | 桌面启动后立即运行 |
| `post-update` | 在 `omarchy update` 期间、软件包和迁移完成后运行 |
| `pre-refresh-pacman` | `omarchy refresh pacman` 重新同步软件包配置前运行 |
| `theme-set` | 主题更改后运行（主题名称位于 `$1`） |
| `font-set` | 字体更改后运行（字体名称位于 `$1`） |
| `battery-low` | 电池电量不足时运行（百分比位于 `$1`） |

每个目录中已经有一个 `.sample` 文件，展示钩子的格式。去掉文件名中的 `.sample`，即可启用它。要安装在其他位置编写的脚本，请使用 `omarchy hook install post-boot ~/my-hook`，它会将脚本复制到目录中并使其可执行。

### 添加自己的菜单项

Omarchy 菜单（`Super + Space`）可以通过编辑 `~/.config/omarchy/extensions/omarchy-menu.jsonc` 扩展为包含自己的行。条目使用带点号的 id 作为键，id 决定它在树中的位置，因此 `personal` 会显示在根菜单中，而 `personal.notes` 会显示在其中的子菜单中：

```jsonc
"personal": {"icon":"","label":"Personal"},
"personal.notes": {"icon":"󰎞","label":"Notes","action":"omarchy-launch-editor ~/notes"},
```

复用已有 id 会覆盖该行，而不是添加新行。该文件附带了以注释形式记录的所有可用字段。

### 添加自己的 shell 导出变量、函数和别名

Omarchy 附带许多符合人体工学的别名和实用函数，但很常见的需求是添加自己的内容。你应该将别名、函数和导出变量都添加到 `~/.bashrc` 中。更新时不会覆盖此文件。如果想更改 Omarchy 的默认设置，也可以放心地在这里添加覆盖内容。

### 更改 Omarchy 内部文件

这是你的电脑，你想怎么做都可以，但我建议不要直接修改 `/usr/share/omarchy` 中的文件。它们属于 Omarchy pacman 软件包，因此你的修改会在下一次更新时被直接覆盖。更好的做法是在 `~/.config/*` 文件夹中覆盖你不喜欢的默认值。

这样几乎所有内容都可以更改，例如默认快捷键。只需编辑 `~/.config/hypr/bindings.lua`，比如将 [Obsidian](https://obsidian.md/) 替换为 [Joplin](https://joplinapp.org/)（使用 `omarchy-pkg-add joplin-bin` 安装）：

```
hl.unbind("SUPER + SHIFT + O")
o.bind("SUPER + SHIFT + O", "Joplin", "joplin-desktop")
```

如果你坚持修改 Omarchy 内部文件，请通过 _Update > Channel > Dev_ 切换到 dev 频道。这样会将 Omarchy 连接到 `~/omarchy` 中的源代码 git checkout，你可以随心所欲地修改它。这里没人会告诉你该怎么做！

### 重置所有修改

如果配置最终变得一团糟，可以通过 Omarchy 菜单中的 _Update > Config_ 将其恢复为默认值。也可以运行 `omarchy reinstall configs` 来重置所有内容。
