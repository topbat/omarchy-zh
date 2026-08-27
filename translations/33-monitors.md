# 显示器

Omarchy 默认假设你使用的是支持 2x 缩放的视网膜级显示器。这是获得漂亮、清晰程序员字体所需要的条件。几乎所有配备高分辨率屏幕的新款高端笔记本电脑都针对这种配置进行了优化。如果你使用的是 27 英寸 5K [Apple Studio Display](https://www.apple.com/studio-display/)/[ProArt PA27JCV](https://www.asus.com/us/displays-desktops/monitors/proart/proart-display-5k-pa27jcv/)/[Samsung S9](https://www.samsung.com/us/computing/monitors/5k/27-viewfinity-s9-5k-monitor-with-thunderbolt-4-matte-display-and-smart-features-ls27c900panxza/)/[Kuycon G27P](https://kuycon.us/monitors/G27P/)，或 32 英寸 6K [Apple XDR](https://www.apple.com/pro-display-xdr/)/[ProArt PA32QCV](https://www.asus.com/displays-desktops/monitors/proart/proart-display-6k-pa32qcv/)/[Kuycon G32P](https://kuycon.us/monitors/G32P/)，这也是你希望使用的配置。

但如果你使用的显示器 PPI 低于 218，就需要修改显示器设置。例如，如果你有 27 英寸或 32 英寸 4K 显示器，可以打开 `~/.config/hypr/monitors.lua`（通过 Omarchy 菜单中的 _Setup > Monitors_），并切换到该组合对应的推荐设置：

```lua
local omarchy_gdk_scale = 2
local omarchy_monitor_scale = 1.6
```

如果你使用的是 1080p 或 1440p 显示器，通常只需使用 1x 缩放，因此可以使用：

```lua
local omarchy_gdk_scale = 1
local omarchy_monitor_scale = 1
```

对 `GDK_SCALE` 的修改只会应用于修改后启动的应用程序（而且 GTK 只接受整数，因此请将其保持为显示器缩放比例最接近的整数）。因此，修改后请务必退出那些尺寸过大的窗口（或者用 `Ctrl + Alt + Del` 关闭所有窗口！）。

你还可以使用 `Super + /` 提高、使用 `Super + Alt + /` 降低，在主要的显示器缩放比例（1x、1.25x、1.6x、2x、3x、4x）之间快速切换。如果你使用默认配置，这些修改在重启后也会保留。

### 放大或缩小文字

显示器缩放会改变所有内容的大小。如果你只想放大或缩小_文字_，这里只有一个设置项：

```
omarchy display text size 14
```

该命令接受 9 到 20 之间的像素大小，并会同时调整 Omarchy shell、GTK 应用程序和终端的大小，使整个桌面保持比例。无参数运行它可以查看当前值，运行 `omarchy display text size reset` 可恢复默认值。Foot 是唯一的例外：它无法重新加载配置，因此正在运行的终端会保持旧字号，直到你打开一个新终端。

### 扩展和镜像笔记本电脑显示屏

将外接屏幕连接到笔记本电脑时，显示会自动扩展。但你可以通过 Omarchy 菜单中的 _Trigger > Hardware_ 或 `Super + Ctrl + Alt + Delete` 将其改为镜像。这在外接屏幕是投影仪时尤其有用，因为你可以在工作的同时进行展示。

使用扩展显示时，合上笔记本电脑盖会自动关闭内置屏幕。打开盖子会重新开启它。你也可以通过 Omarchy 菜单中的 _Trigger > Hardware_ 或 `Super + Ctrl + Delete` 手动控制。

### 排列多个屏幕

Hyprland 对多屏幕支持得很好。请阅读[Hyprland 显示器文档](https://wiki.hypr.land/Configuring/Basics/Monitors/)，了解如何布局。你也可以[将特定工作区绑定到特定显示器](https://wiki.hypr.land/Configuring/Basics/Workspace-Rules/)。在 Omarchy 中，这些规则写在 `~/.config/hypr/monitors.lua` 中，形式为 `hl.monitor` 条目——该文件自带注释示例，用于将特定显示器固定到指定分辨率、位置和旋转角度。

如果你希望使用 TUI 来辅助定位多个屏幕，也可以试试 [Hyprmon](https://github.com/erans/hyprmon/)。

### 控制亮度

显示器亮度由专用的亮度增加/减少功能键控制。按下这些按键时按住 Shift，可以直接调到最高或最低亮度。这些按键控制当前聚焦的显示器，因此支持 DDC/CI 的外接显示器也可以用同样的方式调节，和笔记本电脑屏幕一样。

### Apple 显示器

如果你使用 Apple 显示器，当前聚焦在 Apple 显示器上时，常规键盘亮度键也会自动生效。这是通过 `asdcontrol` 命令实现的。

请注意，如果你使用的是 Apple 6K XDR 显示器，可能会在 `hyprctl monitors` 列表中看到一个虚拟屏幕。你可以通过 _Setup > Monitors_ 使用类似 `hl.monitor({ output = "DP-2", disabled = true })` 的设置将其关闭。

在 Intel 机器上，你应使用普通 Thunderbolt 线缆连接 Apple 显示器。在没有 Thunderbolt 的其他机器上，通常必须使用 [DP + USB-A -> USB-C cable](https://www.amazon.com/dp/B0BNX7MS6N) 才能正常工作。
