# GUI

## 文件

Files（Nautilus）是图形文件管理器。`Super + Shift + F` 可以打开它，`Super + Shift + Alt + F` 可以在终端当前所在的目录中打开它，从而省去大量点击。`Ctrl + L` 可以让你输入路径，在任意文件上按 `Space` 可以快速预览，而无需打开文件。

插入 USB 闪存盘或 SD 卡后，它会自动挂载，因此会直接显示在侧边栏中。对于更复杂的操作，例如格式化驱动器、检查 SMART 健康状况和创建分区，请从应用启动器（`Super + Space`）启动 _Disks_。

双击会遵循合理的默认设置：图像使用 imv 打开，视频使用 mpv 打开，PDF 使用 Document Viewer 打开，纯文本使用 Neovim 打开。

## Obsidian

[Obsidian](https://obsidian.md/) 是一款免费且高度可扩展的笔记应用，使用简单的 Markdown 文件进行存储。

Obsidian 在所有用途下都免费，包括个人、商业和非营利用途。

Obsidian 还提供用于与 iOS 和 Android 移动应用同步的[商业附加组件](https://obsidian.md/sync)。（https://obsidian.md/pricing）。

使用 `Super + Shift + O` 启动 Obsidian。若要使用主题同步，必须在设置中选择 `Omarchy` 主题。

## Omawrite

[Omawrite](https://github.com/omacom-io/omawrite) 是 Omarchy 自有的极简 Markdown 写作应用。没有库，没有插件，只有你和文字。

使用 `Super + Shift + W` 启动 Omawrite。

## Pinta

[Pinta](https://www.pinta-project.com/) 是一款基础图像编辑工具，非常适合裁剪、调整大小和其他基本处理。不要指望它能替代 Photoshop，但它仍然有魔棒和图层！

通过应用启动器（`Super + Space`）启动 Pinta。

## Aether

[Aether](https://github.com/bjarneo/aether) 是一款主题应用，可以从背景图片中提取颜色，并将其转换为完整且协调的主题。这是[制作你自己的主题](43-making-your-own-theme.md)最简单的方法。

通过应用启动器（`Super + Space`）启动 Aether。

## LocalSend

[LocalSend](https://localsend.org/) 可以让你向同一网络中运行该应用的其他设备发送文件，类似 Apple 的 AirDrop。它支持跨平台，因此你可以在 Windows、macOS、Android、iOS，当然还有 Linux 之间互相收发文件。

你可以通过 `Super + Ctrl + S` 或 Omarchy 菜单中的 _Trigger > Share_ 打开 Share 菜单。它提供四个选项：

- **Clipboard** 会将你复制的内容作为文本文件发送。非常适合将链接或代码片段发送到手机上，而不必给自己发邮件。
- **File** 会打开文件选择器，你可以一次选择多个文件。
- **Folder** 会发送整个目录。
- **Receive** 会打开完整的 LocalSend，让其他设备可以向你发送内容。

在终端中使用 `omarchy share clipboard`、`omarchy share file [path]` 和 `omarchy share folder [path]` 也可以完成同样的操作。省略 path 即可打开选择器。

你也可以直接从文件管理器发送：在 Nautilus 中右键点击任意选中的内容，然后选择 _Send via LocalSend_。

Omarchy 的防火墙默认关闭所有端口，但 LocalSend 的端口除外，因此在全新安装后即可开箱使用。请参阅 [security](48-security.md)。

## LibreOffice

[LibreOffice](https://www.libreoffice.org/) 是完整的办公套件，包含文字处理器、电子表格、演示文稿、绘图应用等。它兼容 Microsoft Office 文件，因此非常适合用来打开 Word 文档。

通过应用启动器（`Super + Space`）启动 LibreOffice。

## Omacalc

[Omacalc](https://github.com/omacom-io/omacalc) 是 Omarchy 自有的极简计算器，会在浮动窗口中打开。

使用 `Super + Ctrl + Q` 启动 Omacalc（如果键盘上有计算器键，也可以使用该键）。

## Signal

[Signal](https://signal.org/) 是端到端加密消息应用的先驱，也是那些不愿通过大型科技集团进行通信的人的绝佳选择。

使用 `Super + Shift + G` 启动 Signal。它不属于基础安装，因此第一次按下该快捷键时，Omarchy 会提供安装选项（也可以在 Omarchy 菜单的 _Install > Service_ 下找到）。

## mpv

[mpv](https://mpv.io/) 是一款简单、快速的媒体播放器，几乎可以播放来自任何来源的所有内容。非常适合观看视频。

通过应用启动器（`Super + Space`）启动 mpv，或者直接在文件管理器中双击视频。

## OBS Studio

[OBS Studio](https://obsproject.com/) 可以从多个输入源录制或串流视频。你可以将屏幕录制、摄像头和麦克风输入混合使用。Omarchy 的屏幕录制就是使用它完成的。

通过应用启动器（`Super + Space`）启动 OBS Studio。

## Kdenlive

[Kdenlive](https://kdenlive.org/) 是一款优秀的视频编辑器，非常适合处理由 OBS Studio 录制的视频，然后进行分享。

通过应用启动器（`Super + Space`）启动 Kdenlive。

## Omacut

[Omacut](https://github.com/omacom-io/omacut) 是 Omarchy 自有的极简视频裁剪工具。当你只需要剪掉片段的开头和结尾时，用它比启动完整的视频编辑器更方便。

通过应用启动器（`Super + Space`）启动 Omacut。
