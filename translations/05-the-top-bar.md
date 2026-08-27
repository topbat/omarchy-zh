# 顶栏

屏幕顶部的条带就是 Omarchy bar。它不是后来加装的状态栏，而是 Omarchy shell 的一部分；Omarchy shell 是一个持续运行的 Quickshell 进程，同时负责绘制菜单、通知、OSD 弹窗和锁屏。这就是它能与其他所有界面完美使用同一主题的原因，也是面板打开时会立即出现而不是启动新应用的原因。

它也是桌面上始终显示的唯一部分，所以了解那些小图标各自的作用很值得。

## 默认显示的内容

顶栏分为三个区域。左侧是 Omarchy logo（菜单启动器）和工作区指示器。中间是状态指示器、时钟、键盘布局、天气和 Omarchy 更新徽章。右侧则是系统托盘、agents、bluetooth、network、audio、display 和 power。

其中有些内容只有在需要提示时才会显示。只有在配置了多个布局后，键盘布局才会出现。只有在有 Omarchy 更新等待安装时，更新徽章才会出现。而 agents 图标则会在 Omarchy 首次发现这台机器上有 AI coding 使用记录时出现（参见 [AI](17-ai.md)）。

## 点击操作

几乎每个小组件在左键、右键和中键点击时都会执行不同操作，其中几个还会响应滚动。这部分很容易被忽略——许多实用功能都藏在右键和中键里。

| Widget | 左键 | 右键 | 中键 / 滚动 |
| --- | --- | --- | --- |
| Menu | Omarchy 菜单 | 新建终端 | — |
| Workspaces | 聚焦该工作区 | — | — |
| Clock | 日历弹窗 | 循环切换标签格式 | 中键：时区选择器 |
| Weather | 预报弹窗 | 将完整天气信息作为通知显示 | 中键：刷新 |
| Audio | Audio 面板 | 静音 | 中键：面板 · 滚动：音量 |
| Microphone | 将麦克风静音 | — | 中键：Audio 面板 · 滚动：输入音量 |
| Network | Network 面板 | — | — |
| Bluetooth | Bluetooth 面板 | 切换无线电 | — |
| Display | Display 面板 | — | 滚动：亮度 |
| Power | Power 面板 | 切换电池百分比显示 | — |
| Media | 播放/暂停 | 封面弹窗 | 中键：下一首 · 滚动：上一首/下一首 |
| Agents | Agents 面板 | 启动你的 agent | 中键：下一个订阅 |
| Tray | 悬停以显示抽屉 | 右键点击箭头进行管理 | — |
| Omarchy update | 运行更新 | — | — |

上表中的内容并非全部默认显示在顶栏上。媒体小组件（MPRIS now-playing，带有滚动显示的曲目和艺术家）和麦克风小组件都已内置，但默认关闭；如果需要，可以按下文所述添加它们。

## 面板

点击顶栏图标会打开一个面板。它是真正的弹出面板，提供滑块、列表和键盘导航，而不是工具提示。每个面板也都有对应的快捷键，因此无需瞄准一个 16 像素的图标：

| Hotkey | Panel |
| --- | --- |
| `Super + Ctrl + A` | Audio |
| `Super + Ctrl + W` | Network |
| `Super + Ctrl + B` | Bluetooth |
| `Super + Ctrl + D` | Display |
| `Super + Ctrl + P` | Power |
| `Super + Ctrl + Alt + D` | Calendar |
| `Super + Ctrl + 1-9` | 切换右侧区域中的第 n 个面板 |

这些面板不是用来只读查看信息的，而是用来真正执行操作的：

- **Audio** 提供主音量滑块、输出设备选择器和按应用分别调节的混音器，因此可以调低某个浏览器标签页的音量，而不影响其他所有声音。
- **Network** 会扫描 Wi-Fi、显示信号强度、进行连接，并允许选择 DNS 提供商。
- **Bluetooth** 会列出设备，并显示连接/断开控制和电池电量。
- **Power** 显示电池统计信息、切换电源配置（它会分别记住电池供电和 AC 供电时的选择），并输出一些系统信息。
- **Display** 提供亮度滑块、文本大小、显示器缩放预设；当连接了多个屏幕时，还提供按显示器分别控制的选项。更深入的说明参见 [显示器](33-monitors.md)。
- **Clock** 打开一个带 ISO 周数和月份切换功能的月历网格。

每个面板既支持键盘也支持鼠标：方向键移动，Return 激活，Tab 切换到相邻面板，Escape 关闭。

`Super + Ctrl + 1-9` 会从左到右计算右侧区域中的面板，并跳过托盘，因为托盘没有自己的面板。因此，数字对应的就是你要指向的图标。

### Tailscale 和 Dropbox

只有在通过 **Install → Service** 安装了相应服务后，顶栏才会出现另外两个小组件。它们都值得了解，因为作用不只是报告状态。

**Tailscale** 面板可以连接和断开 tailnet、在账户之间切换，以及选择 exit node（你自己的设备和 Mullvad 区域都会显示在列表中）。它还可以浏览你的设备；选中一台设备后，按 `s` 就能通过 Taildrop 向它发送文件，这是将文件传到手机或另一台笔记本电脑的最快方式。按 `c` 可复制设备的 IP，按 `n` 可复制其名称，按 `d` 可复制其完整 DNS 名称。每一行设备旁也有发送按钮，如果更喜欢点击操作，可以使用该按钮。在终端中执行同样的操作是 `omarchy tailscale send <machine> [file...]`。

**Dropbox** 面板负责登录、显示已使用的存储空间，并列出最近同步的文件。

移除任一服务后，其小组件也会从顶栏移除。

## 指示器

中间的小图标组就是 indicators 小组件。这些是已启用模式的状态图标：免打扰、夜灯、排队中的 [提醒](09-reminders.md)、正在进行的屏幕录制、保持唤醒和 [听写](11-text-extraction-dictation.md)。模式启用时它们会亮起，其他时候则不会妨碍使用——将鼠标悬停在顶栏中央，可以查看未激活的指示器。点击某个指示器即可切换对应模式。

如果希望它们始终可见，可以将该小组件的 `alwaysShow` 设置为 `true`。如果只关注其中一部分，可以在 `items` 中列出所需项目：`["Dnd", "Reminder", "NightLight"]`。可以添加多个 indicators 小组件，让不同区域显示不同的子集。

## 重新排列顶栏

顶栏会自行配置，无需打开配置文件即可移动内容。

抓住顶栏中央附近的一块空白区域，将它拖向屏幕的另一条边缘，顶栏就会移动到那里——左、右、上、下都可以，并且所有小组件都会自适应（垂直顶栏会改用紧凑的纯图标形式）。点击并按住也会开始同样的拖动操作。双击左键同一块空白区域可以切换透明度。拖动任意小组件可以重新排序，也可以将它拖到另一个区域。

如果更喜欢从菜单中选择，**Style → Menu Bar** 同时提供位置和透明度设置。

这些操作也都有对应的命令，这正适合用于 [dotfiles](31-dotfiles.md) 配置：

```bash
omarchy bar position bottom
omarchy bar transparent toggle
omarchy bar move omarchy.clock --section center --index 0
omarchy bar set omarchy.clock format "HH:mm"
omarchy bar defaults          # back to the shipped layout
```

若要彻底添加或移除一个小组件，请使用 plugin 命令。`omarchy plugin list` 会输出 shell 知道的所有小组件及其 id，然后执行：

```bash
omarchy plugin enable omarchy.media --section center
omarchy plugin disable omarchy.weather
```

## 隐藏顶栏

`Super + Shift + Space` 可以关闭和重新显示顶栏，不会终止 shell；面板和快捷键仍然有效，只是可以重新获得屏幕空间。菜单中的 **Trigger → Toggle → Menu Bar** 也提供同一操作。

## 配置文件

所有配置都存储在 `~/.config/omarchy/shell.json` 中的 `bar` 键下。以下是一个经过删减的版本：

```json
{
  "version": 1,
  "bar": {
    "position": "top",
    "transparent": false,
    "centerAnchor": "omarchy.clock",
    "layout": {
      "left": [{ "id": "omarchy.menu" }, { "id": "omarchy.workspaces" }],
      "center": [{ "id": "omarchy.clock", "format": "HH:mm" }],
      "right": [{ "id": "omarchy.audio" }, { "id": "omarchy.power" }]
    }
  }
}
```

每个小组件都是三个布局数组之一中的一个条目，其设置直接写在该条目中——没有单独的设置文件，也没有 `config` 子对象。时钟的 `format`、`formatAlt`（右键循环切换的格式）和 `verticalFormat` 都直接写在 `{ "id": "omarchy.clock" }` 上。

`centerAnchor` 指定一个固定在屏幕正中心的中心小组件，其他小组件排列在它两侧。这就是即使天气和更新徽章出现或消失，时钟仍能稳稳保持在正中央的原因。将它设置为空字符串后，center 列表会作为一个整体居中。

有一条规则值得牢记：**一旦拥有自己的 `shell.json`，它就是规范配置**。在进行任何自定义之前，shell 会读取 Omarchy 的默认文件。拖动小组件、运行 `omarchy bar` 或自行编辑文件后，配置就归你所有——这里没有深度合并，因此未来 Omarchy 版本中新加入的默认小组件不会自动出现在你的顶栏上。无论何时想恢复一个干净的初始状态，都可以运行 `omarchy bar defaults` 来还原随附的布局。

同一个文件还在顶层保存空闲计时设置，位于 `bar` 键之外：`idle.screensaver` 和 `idle.lock`，单位都是进入空闲状态后的秒数。因此，默认情况下屏幕保护程序会在 150 秒后启动，锁屏会在 300 秒后启动。
