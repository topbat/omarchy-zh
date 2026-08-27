# 浏览器

Omarchy 默认搭载 [Chromium](https://www.chromium.org/) 浏览器。它是纯粹的开源构建版本，主题与系统其余部分相匹配；`Super + Shift + Return` 打开的就是它，每个 [Web 应用](25-web-apps.md)也都在其中运行。

如果 Chromium 不合你的口味，你并非只能使用它。在 Omarchy 菜单的 _Install > Browser_ 下，你会看到 Chrome、Edge、Brave、Brave Origin、Firefox 和 [Zen](https://zen-browser.app/)。选择一个，Omarchy 就会安装它、设置其策略目录，并为其应用你当前的主题。

## 设为默认浏览器

安装浏览器并不会自动将其设为默认浏览器。安装完成后，前往 _Setup > Defaults > Browser_ 并选择它。该菜单只会列出实际已安装的浏览器，并用勾号标出当前的默认浏览器。

在终端中，命令是：

```bash
omarchy default browser firefox
```

不带参数运行该命令，它会告诉你当前的默认浏览器。此操作会设置 XDG 处理程序，因此不只是 Omarchy 的快捷键会随之更改：任何打开链接的操作，从聊天应用到终端命令，都会使用你所选择的浏览器。

## 复制 URL 和下载视频

Chromium 系浏览器（Chromium 本身、Chrome、Edge 和 Brave）附带两个 Omarchy 扩展，它们可以连接浏览器与系统的其余部分。

**Copy URL** 使用 `Alt + Shift + L` 将当前标签页的地址放入剪贴板。这比点击地址栏再复制更快；而且由于它使用的是系统剪贴板而非浏览器剪贴板，你会收到一条 Omarchy 通知作为确认，该 URL 也会立即出现在[剪贴板历史记录](08-unified-clipboard-history.md)和其他所有应用中。如果你更喜欢点击操作，工具栏上也有一个按钮。

**Download Video** 使用 `Alt + Shift + D` 抓取你正在查看的页面上播放的视频。它会将 URL 交给 [yt-dlp](https://github.com/yt-dlp/yt-dlp)，因此远不止适用于 YouTube，下载内容会保存到 `~/Videos`。进度会显示在音量和亮度所使用的同一个屏幕显示区域中，并在原位置更新，而不会堆叠通知。如果你希望文件保存到其他位置，请设置 `OMARCHY_YTDLP_DIR`；有关环境变量应放在哪里，请参阅[常见问题](46-faq.md)。

这两个扩展都通过一个小型原生消息传递主机与 Omarchy 通信；安装浏览器时，该主机也会一并安装。正是这个组件让网页中的视频能够保存到你的主目录，并让 URL 能够进入剪贴板管理器，而普通扩展自身无法做到这些。

这些功能仅适用于 Chromium 系浏览器。Firefox 和 Zen 不支持它们。

## Firefox 和 Zen

Firefox 和 Zen 属于不同的浏览器系列，因此 Omarchy 会以不同方式处理它们：Omarchy 会安装一个策略文件以提供合理的默认设置，并将它们切换到原生 Wayland 模式，这是实现分数缩放和平滑触控板滚动所需要的。

它们不会获得上述 Chromium 扩展，Omarchy 也不会为其设置主题，因此这些部分需要由你自行配置。

## 再次移除浏览器

在这里安装的任何浏览器都可以通过 _Remove > Browser_ 移除。Chromium 不在该列表中，因为它是基础系统的一部分。
