# 切换项、空闲与屏幕保护程序

你每天更改的许多内容其实并不是设置，而是打开一小时、随后再关闭的模式：熬夜工作时开启夜间模式，演示时开启勿扰模式，观看内容时保持唤醒。Omarchy 将这些称为切换项，它们的工作方式都相同：快捷键、菜单项和命令都作用于同一个开关。

### 切换菜单

`Super + Ctrl + O` 会直接打开 _Trigger > Toggle_，也可以从 Omarchy 菜单（`Super + Space`）进入。列表中的每一项都是一个开关，你无需考虑其状态存储在哪里，就可以直接切换。

在终端中，相同的开关使用 `omarchy toggle <thing>`。单独运行 `omarchy toggle` 可以查看整个分组。

| 切换项 | 快捷键 | 命令 |
| ------ | ------ | ------- |
| 夜间模式 | `Super + Ctrl + N` | `omarchy toggle nightlight` |
| 静音通知 | `Super + Ctrl + ,` | `omarchy toggle notification silencing` |
| 保持唤醒（不锁定空闲状态） | `Super + Ctrl + I` | `omarchy toggle idle` |
| 崩溃捕获 | — | `omarchy toggle crash-capture` |
| 屏幕保护程序 | — | `omarchy toggle screensaver` |
| 菜单栏 | `Super + Shift + Space` | `omarchy toggle bar` |
| 触摸板 | `XF86TouchpadToggle` | `omarchy toggle touchpad` |
| 触摸屏 | — | `omarchy toggle touchscreen` |
| 挂起 | — | `omarchy toggle suspend` |
| 混合 GPU | — | `omarchy toggle hybrid gpu` |

触摸板、触摸屏和混合 GPU 开关位于 _Trigger > Hardware_（`Super + Ctrl + H`）下，而不是 Toggle 下，因为只有实际拥有相应硬件时它们才会显示。触摸板和触摸屏开关在重新加载 Hyprland 后仍然有效：被禁用设备的名称会保存到一个小型状态文件中，Hyprland 启动时会读取该文件并再次禁用设备。

Toggle 菜单中还有一些不是 `omarchy toggle` 命令、但行为相同的项目：菜单栏中的电池百分比、工作区布局（`Super + L`）、窗口间距（`Super + Shift + Backspace`），以及 1 窗口方形宽高比（`Super + Ctrl + Backspace`）。

其中大多数实际上只是 `~/.local/state/omarchy/toggles/` 下的一个标志文件。如果你想在脚本中根据某项进行分支判断，`omarchy-toggle-enabled` 会返回退出码，不必自行查找：

```bash
omarchy-toggle-enabled screensaver-off && echo "screensaver is off"
```

这些标志以关闭状态命名，例如 `screensaver-off`、`suspend-off`、`bar-off`，因此它们存在就表示相应功能已禁用。

### 菜单栏中的指示器

某种模式开启时，顶部栏中央的时钟旁边会出现一个小字形。这就是指示器小组件，它显示听写、录屏、待处理提醒、夜间模式、勿扰模式和保持唤醒状态。

未激活的指示器会隐藏。将鼠标悬停在其周围区域时，它们会以暗淡的状态淡入，这样你无需知道快捷键就可以点击其中一个来开启对应功能。点击已激活的指示器会将其关闭。如果你希望始终看到所有指示器，请在 `~/.config/omarchy/shell.json` 中 `omarchy.indicators` 条目上将 `alwaysShow` 设置为 `true`；关于菜单栏小组件的配置方式，请参阅[顶部栏](05-the-top-bar.md)。

### 夜间模式

`Super + Ctrl + N` 会将屏幕调暖至 4000K，再次按下则恢复为 6500K。该功能由 hyprsunset 驱动；如果它尚未运行，切换项会替你启动它。

默认情况下，hyprsunset 完全不会改变屏幕。`~/.config/hypr/hyprsunset.conf` 中附带了一个等效配置文件，正是为了让显示器在你要求调暖之前保持不变。如果希望它按时间切换，请将其替换为时间配置文件：

```
profile {
    time = 20:00
    temperature = 4000
}
```

然后，将 `o.launch_on_start("hyprsunset")` 添加到 `~/.config/hypr/autostart.lua`，使 hyprsunset 在登录时启动。切换项使用的 4000K/6500K 温度对是固定的；如果想使用其他温度，应在配置文件中设置。

### 勿扰模式

`Super + Ctrl + ,` 会静音通知。开启后不会弹出提示，菜单栏中会显示带斜线的铃铛指示器，提醒你桌面为何变得安静。

不过不会有任何内容丢失。被静音的通知会直接写入通知历史记录，这正是你回来后想知道错过了什么时需要查看的记录。使用 `Super + Shift + Alt + ,` 打开通知历史。通知的其他内容请参阅[通知](10-notices.md)。

仍有两类消息可以通过：Omarchy 对你刚刚执行的操作显示的确认提示（“Theme changed”“Screenshot saved”），以及从命令行发送的关键提醒。那些将所有消息都标记为关键、试图强行出现在你面前的聊天应用不属于此列。

### 空闲

Omarchy shell 负责管理空闲行为，相关时间设置位于 `~/.config/omarchy/shell.json` 顶层的 `idle` 块中：

```json
{
  "version": 1,
  "idle": {
    "screensaver": 150,
    "lock": 300
  }
}
```

两个数字都是从进入空闲状态的那一刻开始计算的秒数，而不是以前一个事件为起点。因此按默认值，屏幕保护程序会在两分半钟后出现，锁屏会在五分钟后接管，无论屏幕保护程序是否已经运行。保存文件后，shell 会立即应用新的时间设置。

如果你在锁定期限前关闭屏幕保护程序，这会被视为活动，待处理的锁屏也会取消。你不会因为看了一眼电脑就被锁定在外。

要完全停止空闲锁定，请按 `Super + Ctrl + I`，或运行 `omarchy toggle idle`，开启保持唤醒，菜单栏中会出现咖啡杯指示器。这是在长时间演示或想要观察构建过程之前应该使用的切换项。再次按下即可恢复正常。若脚本需要获取当前状态，`omarchy toggle idle status` 会以 JSON 打印状态。

这里讨论的是锁定和屏幕保护程序，而不是电源。挂起和休眠有各自的设置，详见[系统睡眠](36-system-sleep.md)。

### 屏幕保护程序

Omarchy 的屏幕保护程序是通过随机文字效果运行的 ASCII 艺术，每台显示器各运行一个实例。按下任意键或移动鼠标即可退出。

你可以从 _System > Screensaver_（`Super + Esc`）按需启动它；即使你已关闭空闲屏幕保护程序，这也会强制启动。默认情况下没有为它绑定快捷键。

如果你希望从工作状态直接进入锁定，可以使用 `omarchy toggle screensaver` 关闭空闲屏幕保护程序。它需要一个自己知道如何配置的终端，即 Alacritty、Foot、Ghostty 或 Kitty；如果默认终端是其他程序，它会提示你。

它绘制的标志可以在 _Style > Screensaver_ 下更换。上传 png 或 svg 后，Omarchy 会将其转换为 ASCII。请参阅[品牌设置](41-branding.md)。

### 锁屏

`Super + Ctrl + L` 会锁定计算机。这会从 Omarchy shell 运行锁屏、关闭显示器、将键盘布局重置为第一个布局以免你用错误的字母输入密码，并且如果你正在运行 1Password，还会在退出时锁定它。

锁屏接受密码；设置指纹后也可以使用指纹解锁。相关内容以及其他身份验证方式，请参阅[硬件身份验证](37-hardware-authentication.md)。
