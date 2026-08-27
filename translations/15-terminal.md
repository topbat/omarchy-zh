# 终端

[Foot](https://codeberg.org/dnkl/foot) 是 Omarchy 的默认终端。它快速、轻量，即使在老旧电脑上也能兼容。不过，它不支持原生标签页或分屏。

如果你使用 Tmux，可能不会介意这一点；如果不使用，我们也完全支持将 _Alacritty_、_Ghostty_ 和 _Kitty_ 作为选项。请在 Omarchy 菜单的 _Install > Terminal_ 下选择你的偏好。

使用 `Super + Return` 启动新终端。（此绑定会自动指向你通过 _Install > Terminal_ 安装的终端，你也可以在 _Setup > Defaults > Terminal_ 下的已安装终端之间切换。）

## Tmux

无论使用哪种终端，Tmux 都能为窗格、窗口（也称标签页）和可恢复会话提供一致且可编程的界面。它甚至可以在远程主机上运行，因此通过 SSH 登录服务器时也能采用相同的操作方式。

在新终端中使用 `Super + Alt + Return` 启动新的 Tmux 会话。由于 Tmux 是持久运行的进程，即使关闭该终端，也可以恢复会话。只需按下 `Ctrl + Space`（称为前缀键），然后按 `s`，即可查看所有活动会话。

Omarchy 附带一套符合人体工学优化的 Tmux 配置，其中有许多需要学习的键绑定，因此请随手查看[快捷键速查表](07-hotkeys.md#tmux)。

## Tmux 布局函数

由于 Tmux 支持编程，我们可以使用函数创建布局。Omarchy 附带四个用于常见开发者布局的不同函数。

`tdl [agent]` 启动一个类似 IDE 的三向分屏界面：左侧是 `$EDITOR`，右侧是你选择的 AI 代理（例如用于 opencode 的 `c`、用于 Claude 的 `cx` 或用于 OpenAI 的 `codex`），底部则是终端。

因此，`tdl c` 会启动如下布局（或直接使用 `ic`）：

 ![tmux-tdl](images/tmux-tdl.webp)

你也可以使用 `tdl c cx` 启动第二个代理（opencode + claude）（或直接使用 `icx`）：

 ![tmux-tdl2](images/tmux-tdl2.webp)

此外还有 `tds`，它会启动一个四向方形布局：编辑器位于左上角，实时差异监视器位于右上角，终端位于左下角，opencode 位于右下角。

你还可以使用 `tdlm [agent]` 为当前目录中的每个子目录启动这种布局配置，然后使用 `alt + 1/2/3/4/5/...` 导航：

 ![tmux-tdlm](images/tmux-tdlm.webp)

最后，你可以使用 `tsl [panes] [command]` 启动代理集群。因此，`tsl 4 c` 会为你提供一个由 opencode 代理组成的四向网格：

 ![tmux-tsl](images/tmux-tsl.webp)
