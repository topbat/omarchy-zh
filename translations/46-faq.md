# 常见问题

### 如何在键盘布局之间切换？

编辑 `~/.config/hypr/input.lua` 文件，并添加以下内容，即可使用 `Left Alt + Right Alt` 在布局之间切换：

```
hl.config({
  input = {
    -- Use multiple keyboard layouts and switch between them with Left Alt + Right Alt
    kb_layout = "us,fr",
    kb_options = "compose:caps,shift:both_capslock_cancel,grp:alts_toggle",
  },
})
```

配置多个布局后，栏会自动显示当前键盘布局（你也可以点击它进行切换）。

### 如何将时钟格式改为 12 小时制？

右键点击栏中的时钟，在常用格式之间循环切换，其中包括 12 小时制格式。你也可以直接设置格式：

```
omarchy bar set omarchy.clock format "dddd h:mm AP"
```

这会显示 Sunday 10:55 AM。

### 如何更改时区？

在 Omarchy 菜单中运行 _Update > Timezone_，然后从列表中选择。如果时区正确但时钟本身出现偏差，运行 _Update > Time_ 即可重启时间同步。

### 如何更改 DNS、共享 Wi-Fi 或检查连接速度？

这些内容都在[网络](35-networking.md)章节中。

### 如何检查磁盘速度？

_Trigger > Speed Test > Disk Speed Test_ 会测量驱动器当前的读写速度，也可以在终端中运行 `omarchy disk speedtest`。

### 为什么我无法在 Chromium 中登录 Google 账号？

纯开源 Chromium 构建版本没有 Google 账号登录所需的 OAuth 凭据。在 Omarchy 菜单中运行 _Install > Service > Chromium Account_ 来添加凭据，重启浏览器后即可登录。

### 如何添加打印机？

打印功能开箱即用，因此网络中的打印机通常已经会被发现。从应用启动器（`Super + Space`）启动 _Print Settings_，即可查看已发现的打印机、手动添加打印机或设置默认打印机。即使没有任何打印机，也可以打印到 PDF 文件。

### 如何更改截图或屏幕录制的保存位置？

如果你希望将截图保存到 `~/Pictures/Screenshots` 而不是 `~/Pictures`，可以在 `~/.config/uwsm/env.d/` 下的文件中添加以下内容（例如 `~/.config/uwsm/env.d/capture`）：

```
export OMARCHY_SCREENSHOT_DIR="$HOME/Pictures/Screenshots"
```

屏幕录制也可以用同样的方式设置，配置键为 `OMARCHY_SCREENRECORD_DIR`。

请记得创建用于保存文件的目录，并重启 Omarchy，设置才会生效。

### 如何让 Apple Studio Display 的扬声器和摄像头正常工作？

你可能会认为只要插上 USB C 就应该一切正常，但遗憾的是事实并非如此。我找到的可靠解决方案是使用 [WJESOG DisplayPort + USB-A => USB-C cable](https://www.amazon.com/WJESOG-DisplayPort-Adapter-Converter-Thunderbolt/dp/B0BNX7MS6N/)。这样扬声器和摄像头就能正常工作了。

请记住，Omarchy 内置了 Apple Displays（包括 Studio 和 XDR）的亮度控制，可以使用普通的键盘亮度按键调节。

### 如何删除所有多余的软件？

如果你不想要 Obsidian、LibreOffice 或其他预装软件，可以非常轻松地将它们删除。

运行 _Remove > Package_ 查看已安装的所有软件包。然后使用 tab 选择要删除的软件包，并按 return 开始删除所选内容。

你也可以在 Omarchy 菜单中使用 _Remove > Web App_，删除不需要的预装 Web 应用。

或者运行 _Remove > Preinstalls_，一次性清除所有预装的额外内容，包括 Web 应用、TUI 和可选应用。启动这些内容的快捷键也会随之移除，之后你可以在 `~/.config/hypr/bindings.lua` 中自由添加自己的快捷键绑定。

---

关于错误和故障，请参阅[故障排除章节](45-troubleshooting.md)。
