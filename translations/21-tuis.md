# TUI

## Lazygit

[Lazygit](https://github.com/jesseduffield/lazygit) 是类似 GitHub Desktop 应用的优秀替代品，而且运行在终端中。

你可以直接运行它：进入任意由 git 管理的目录并执行 `lazygit`。也可以在 Neovim 中运行，使用 `Space G G` 启动。

使用 `Tab` 在不同窗格之间切换。在 Files 窗格中，使用 `Space` 选择要暂存的文件，然后按 `c` 创建新的提交。使用 `?` 可以查看所有可用命令。

## Lazydocker

[Lazydocker](https://github.com/jesseduffield/lazydocker) 与 Lazygit 秉持相同理念，也提供了用于管理容器和镜像的终端界面。

你可以使用 `Super + Shift + D` 启动它。

使用 `s` 停止容器，或使用 `r` 启动/重启容器。使用 `?` 查看所有命令。

## Btop

[Btop](https://github.com/aristocratos/btop) 是一款出色的资源管理器，可显示内存、CPU、磁盘和网络使用情况。它还会列出所有活动进程，并允许你管理这些进程。

Omarchy 将其称为 Activity，你可以按下 `Super + Ctrl + T` 启动。它会以浮动窗口打开，你可以使用 `Super + T` 将其平铺。

## Herdr

[Herdr](https://github.com/omacom-io/herdr) 是一个终端工作区管理器，提供工作区、标签页和窗格，并让它们都持续运行在持久会话中；你可以从会话中分离，稍后再回来。

使用 `Super + Ctrl + Return` 启动它（或重新连接到现有会话）。Omarchy 附带的 Herdr 配置与其 Tmux 配置相对应，因此这里的前缀键同样是 `Ctrl + Space`。使用 `Super + Ctrl + K` 可以浏览所有键绑定。

## Fastfetch

[Fastfetch](https://github.com/fastfetch-cli/fastfetch) 显示系统信息，例如内核版本、运行时间、主题、CPU、内存等。它是热门 neofetch 工具的后继者。

Omarchy 在 Omarchy 菜单中将其打包为 _About_（`Super + Space`）。

## 磁盘使用情况

当驱动器空间已满，而你完全不知道是什么占用了空间时，可以从应用启动器（`Super + Space`）启动 _Disk Usage_。它是以交互模式运行、指向整个文件系统的 [dua](https://github.com/Byron/dua-cli)，因此你可以进入有问题的目录，目录按占用空间从大到小排序，并直接在其中删除内容。

## Cliamp

[Cliamp](https://www.cliamp.stream/) 是一款受 Winamp 2.x 启发的复古终端音乐播放器，内置用于播放 lo-fi 节目的电台。使用 `Super + Shift + Alt + M` 启动，或从 Omarchy 菜单的 _Apps_ 中启动。按 `?` 查看完整的键绑定列表。

## Wi-Fi 和 Bluetooth 怎么办？

你不会找到用于 Wi-Fi 和 Bluetooth 的 TUI，这些工作由 Omarchy shell 负责。点击顶栏中的 Wi-Fi 图标（或按 `Super + Ctrl + W`）查看网络并连接，点击 Bluetooth 图标（或按 `Super + Ctrl + B`）配对并连接设备。完整说明请参阅 [networking](35-networking.md)。

## 添加你自己的程序

任何终端程序都可以获得完整的应用待遇。进入 Omarchy 菜单中的 _Install > TUI_（`Super + Space`），填写名称、启动命令、窗口样式和图标，它就会像其他应用一样显示在应用启动器中。你也可以在 _Remove > TUI_ 下将其移除。
