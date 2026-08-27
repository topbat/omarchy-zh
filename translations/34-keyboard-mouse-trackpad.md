# 键盘、鼠标和触控板

Hyprland 允许你非常细致地配置所有输入设备。你可以将键盘重复速度调到超高速，也可以让触控板使用自然滚动。所有设置都在 `~/.config/hypr/input.lua` 中修改，也可以通过 Omarchy 菜单中的 _Setup > Input_（`Super + Space`）进入。你在那里设置的任何内容都会替代 Omarchy 的默认值。

下面是一个示例：

```lua
hl.config({
  input = {
    -- Use multiple keyboard layouts and switch between them with Left Alt + Right Alt
    kb_layout = "us,dk",
    kb_options = "compose:caps,shift:both_capslock_cancel,grp:alts_toggle",

    -- Change speed of keyboard repeat
    repeat_rate = 40,
    repeat_delay = 600,

    -- Increase sensitivity for mouse/trackpad (default: 0)
    sensitivity = 0.35,

    touchpad = {
      -- Use natural (inverse) scrolling
      natural_scroll = true,

      -- Use two-finger clicks for right-click instead of lower-right corner
      clickfinger_behavior = true,

      -- Control the speed of your scrolling
      scroll_factor = 0.3,
    },
  },
})

-- Scroll faster in the terminal
o.window("(Alacritty|kitty|foot)", { scroll_touchpad = 1.5 })
```

你可以在 Hyprland wiki 的[输入文档](https://wiki.hypr.land/Configuring/Basics/Variables/#input)中查看所有输入选项。

默认情况下，Omarchy 使用 CapsLock 作为[快速表情符号](07-hotkeys.md#quick-emojis)和[其他补全](07-hotkeys.md#quick-completions)的 compose 键。如果你希望将 CapsLock 用作 Caps Lock，可以修改 `compose:caps`（它位于 `kb_options` 中），把 compose 键移到其他位置。例如，下面的设置会将 compose 键移到 Right Alt：

```lua
hl.config({
  input = {
    kb_options = "compose:ralt",
  },
})
```

### 触控板手势

你还可以开启[触控板手势](https://wiki.hypr.land/Configuring/Advanced-and-Cool/Gestures/)，例如用三指水平滑动切换工作区：

```lua
hl.gesture({ fingers = 3, direction = "horizontal", action = "workspace" })
```

在配备触觉触控板的 Dell XPS 笔记本电脑上，你还可以在 _Trigger > Hardware > Touchpad Haptics_ 下将点击力度设置为 low、mid 或 high。

### 输入中文、日文和其他语言

Omarchy 会在每个会话中运行 [fcitx5](https://fcitx-im.org/) 输入法框架——它正是 CapsLock compose 序列的驱动程序。这意味着非拉丁文字输入所需的基础设施已经就绪：安装 `fcitx5-mozc`（日语）或 `fcitx5-chinese-addons`（中文）等输入引擎时使用 `omarchy pkg add`，再安装 `fcitx5-configtool`，即可将输入引擎添加到输入法并设置在它们之间切换的按键。

### 使用 ALT 作为 SUPER

在某些键盘上，使用主 meta 键（Windows/cmd 键）作为 SUPER 不太方便。你可以通过以下修改改用 ALT：

```lua
hl.config({
  input = {
    kb_options = "compose:caps,shift:both_capslock_cancel,altwin:swap_alt_win",
  },
})
```
