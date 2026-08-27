# 故障排除

### 我在更新时弄坏了系统！

首先尝试将系统[回滚](47-system-snapshots.md)到最近一次更新之前的版本。如果不起作用，请使用 `omarchy-debug` 将问题分享到 Discord 的 #omarchy-help 频道。如果这些方法都失败了，你可以使用 `omarchy-reinstall` 重新安装默认配置和软件包。

### 为什么有些应用在我的显示器上特别大？

Omarchy 假设你使用的是 2x 高分辨率显示器，因此需要在 `~/.config/hypr/monitors.lua` 中将 `GDK_SCALE` 设置为 2。但如果你使用的是 1x 显示器，可以将 `local omarchy_gdk_scale = 2` 改为 1（然后重启尺寸过大的应用）。请参阅[显示器手册](33-monitors.md)。

对于 Spotify，你可以使用 `Ctrl + Minus` 缩小界面（使用 `Ctrl + Plus` 放大界面）。

### 为什么 Caps Lock 不起作用？

在 Omarchy 中，Caps Lock 被指定为 xcompose 键。你可以借此完成[快速输入 emoji](07-hotkeys.md#quick-emojis)和[其他自动补全](07-hotkeys.md#quick-completions)。如果你确实很想使用 Caps Lock，可以编辑 `~/.config/hypr/input.lua`，将 xcompose 键重新映射到其他按键，例如右 alt 键：

```
hl.config({
  input = {
    kb_options = "compose:ralt",
  },
})
```

### 我的 Wi-Fi、Bluetooth、音频或触控板突然停止工作了

重启之前，先尝试单独重启出问题的子系统。Omarchy 菜单中的 _Update > Hardware_ 提供 Wi-Fi、Bluetooth、Audio 和 Trackpad 选项，重新加载其中一个通常可以解决大多数“刚才还正常”的情况，例如 Bluetooth 耳机无法重新连接、触控板在挂起后失灵，或拔掉显示器后声音消失。

### 为什么我的外接扬声器没有播放声音？

可能是因为它们没有被设置为主要输出设备。点击栏右侧的扬声器图标，会打开音量弹窗，你可以在那里选择输出设备（也可以混合调整各应用的音量）。

### 我的笔记本扬声器听起来不对

在某些笔记本电脑上，Omarchy 会自动应用扬声器调音，以校正内置扬声器的频率响应。`omarchy audio tuning status` 会告诉你当前机器是否启用了调音；如果你更希望听到未经处理的扬声器声音，可以用 `omarchy audio tuning off` 将其关闭。

### 为什么我无法使用密码登录或执行 sudo？

你可能因为输错密码次数过多而被锁定。如果锁定发生在锁屏界面，可以按 `CTRL + ALT + F2` 启动新的 TTY，以 root 身份登录，然后运行 `faillock --reset --user [your-username]`。这会重置锁定状态，之后即可正常使用。

### 为什么 1Password SSH Agent / CLI 的 1Password 授权提示没有出现？

这可能有两个原因：

要显示丰富的批准提示，必须启用 Settings > Advanced > Use Hardware Acceleration。_注意：必须重启后才会开始生效。_

 ![troubleshooting-1password](images/troubleshooting-1password.webp)

或者，如果你在开机后还没有启动 1Password，也不会出现该提示。
