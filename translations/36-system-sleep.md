# 系统睡眠

Omarchy 默认启用挂起和休眠，但如果你的机器在其中任一功能上遇到问题，可以将其关闭。

### 电源配置

在笔记本电脑上，Omarchy 会分别记住接通电源和使用电池时的电源配置，并在插入或拔出电源时在两者之间切换。开箱即用的设置是接通交流电时使用性能模式，使用电池时使用平衡模式。

你可以使用 `omarchy powerprofiles list` 查看机器提供的配置，并使用 `omarchy powerprofiles set autodetect power-saver` 为当前所处状态设置所需配置。若不拔掉电源就要设置另一种状态，可以直接指定它：`omarchy powerprofiles set battery power-saver`。无论你选择什么，下次进入该状态时都会继续使用它。

### 切换挂起

在终端中运行 `omarchy toggle suspend` 即可切换挂起功能。该命令只会显示/隐藏 _System_ 下的选项（或 `Super + Esc`），之后你可以检查它在系统上是否始终正常工作。如果不正常，可以再次运行同一命令将其隐藏。

### 切换休眠

在终端中运行 `omarchy hibernation setup` 可以设置休眠。休眠会在启动盘上创建一个大小等于物理 RAM 容量的 /swap 子卷，因此请确保有充足的剩余空间。在 32GB 的机器上，该子卷始终需要 32GB 以上的可用空间。休眠还要求使用默认的 Limine 引导加载程序。

设置完成后，你会在 _System_ 下看到休眠选项（或通过 `Super + Esc`），之后可以检查它在系统上是否始终正常工作。如果不正常，可以再次运行 `omarchy hibernation remove` 将其移除。
