# 从 Mac 或 Windows 迁移

如果你在 macOS 或 Windows 上使用了多年，手指已经记住了许多大脑早已忘记的操作。本章是一张迁移地图：这些习惯在 Omarchy 中分别对应什么。具体功能会在其他章节深入介绍，这里只提供索引。

### Super 是一切的中心

你围绕 Cmd 或 Windows 键形成的肌肉记忆，都可以迁移到一个键：Super。在 PC 键盘上它就是 Windows 键，也是 Omarchy 几乎所有快捷键的核心。

Spotlight、Raycast 或开始菜单对应的是 `Super + Space`。它会打开 Omarchy 菜单，用于启动应用、修改设置、安装软件和截取屏幕，几乎无所不包。直接输入即可过滤。`Super + Alt + Space` 还会打开仅显示应用的菜单。请参阅[导航](04-navigation.md)。

### 没有 Dock，也没有桌面图标

你不会点击图标来启动应用，也不需要整理桌面图标。应用可以通过快捷键启动（终端是 `Super + Return`，浏览器是 `Super + Shift + Return`，查看所有已映射快捷键是 `Super + K`），也可以从菜单启动。唯一持续显示的界面元素是[顶部栏](05-the-top-bar.md)，它承担了过去菜单栏、系统托盘和通知中心的职责，而且其中几乎每个小组件的左键、右键和中键点击都有不同功能。

### 窗口会自动排列

最大的思维转变是：你不再拖动窗口或把窗口吸附到屏幕的一半。打开一个窗口，它会占满屏幕；再打开第二个，它们会自动分割空间。窗口不会彼此重叠，因此你不需要从另一个窗口底下寻找目标窗口。

真正需要浮动窗口时，可以使用 `Super + T` 在平铺和浮动之间切换当前窗口。但请先给平铺布局一个机会，它是整个系统的核心。[导航](04-navigation.md)会带你熟悉它。

工作区会很熟悉：它们类似 macOS 的 Space 或 Windows 的虚拟桌面，只是你会更频繁地使用它们，因为 `Super + 1/2/3/4` 可以直接跳转，`Super + Shift + 1/2/3/4` 可以把当前窗口发送到对应工作区。切换没有动画延迟，因此如果你过去习惯多显示器，现在甚至可能不再需要那么多显示器。

### 复制和粘贴开箱即用

Mac 上你到处使用 Cmd + C；Windows 上你到处使用 Ctrl + C，只是终端中的 Ctrl + C 会终止程序。Omarchy 提供 `Super + C`、`Super + X` 和 `Super + V`，它们在包括终端在内的任何地方都能工作，不需要为 Shell 单独学习一套操作。

Windows 用户熟悉的 Win + V 剪贴板历史记录对应 `Super + Ctrl + V`，而且它同时支持图片和文本。请参阅[统一剪贴板与历史记录](08-unified-clipboard-history.md)。

### 对照表

| 你熟悉的操作 | 在 Omarchy 中 |
| ------------- | ---------- |
| Spotlight / Raycast / 开始菜单 | `Super + Space`，打开 Omarchy 菜单 |
| AirDrop | LocalSend，使用 `Super + Ctrl + S`，请参阅[图形界面](22-guis.md) |
| Cmd + Shift + 4 / Win + Shift + S | `Print Screen`，请参阅[截图与录屏](12-screenshots-recording.md) |
| 通知中心 | `Super + Shift + Alt + ,`，打开通知历史 |
| Time Machine（系统备份） | 每次更新自动创建[系统快照](47-system-snapshots.md) |
| App Store / 下载安装程序 | 菜单中的 _Install_，或 `omarchy pkg add`，请参阅[其他软件包](29-other-packages.md) |
| 系统设置 / 控制面板 | 菜单中的 _Setup_，直接编辑普通配置文件，请参阅[Dotfiles](31-dotfiles.md) |

### 有些事情确实不同

许多设置保存在需要编辑的文本文件中，而不是需要逐层点击的面板里。这听起来原始，但也意味着每次调整都可以查看、复制到下一台机器，并纳入版本控制。_Setup_ 菜单会直接打开正确的文件，完成后重启需要重启的组件。

更新只需要一个入口：_Update > Omarchy_。它会先创建快照，然后同时更新 Omarchy 本身和系统中的所有软件包，不会有各个应用的更新器随机打扰你。请参阅[更新](30-updates.md)。

软件通过软件包管理器安装，而不是下载各自的安装程序。

关闭窗口时，应用会真正退出。不会出现 macOS 中没有窗口却仍在后台运行的状态。`Super + W`，或者你熟悉的 `Super + Q`，都会让应用退出。

### 在 Mac 硬件上

Omarchy 在 Intel Mac 上运行良好，请参阅 [Mac 支持](44-mac-support.md)。键盘也很友好：Omarchy 不会重新映射按键，而 Linux 会把 Command 键当作 Super，因此 Super 仍然位于过去 Cmd 所在的位置。

### 给它两周时间

这些操作习惯的迁移速度会比你想象得快。先浏览一次[快捷键](07-hotkeys.md)章节；忘记某个绑定时，按 `Super + K` 查看完整列表。真正需要记住的只有这一个快捷键。
