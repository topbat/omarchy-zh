# 更新

Omarchy 及其软件包通过 Omarchy 菜单中的 _Update > Omarchy_（`Super + Space`）保持最新状态。

Omarchy 本身作为常规 pacman 软件包安装，来源是 [Omarchy Package Repository](https://github.com/omacom-io/omarchy-pkgs)，因此更新会安装[最新的 Omarchy 版本](https://github.com/basecamp/omarchy/releases)，运行所有待处理的迁移以使系统与最新版本同步，并从 [Omarchy Arch Mirror](https://github.com/omacom-io/omarchy-mirror) 和 [AUR](https://aur.archlinux.org/) 更新所有系统软件包（如果你安装过任何 AUR 软件包）。

发布新版本后，时钟右侧会出现一个圆形箭头图标。点击它即可开始更新过程。

![update-available](images/update-available.webp)

### 四个频道

Omarchy 通过四个频道更新：stable、RC、edge 和 dev。新安装默认使用 stable 频道，它跟踪[官方版本](https://github.com/basecamp/omarchy/releases/)，以及[稳定的 Omarchy Arch 镜像](https://github.com/omacom-io/omarchy-mirror)。该镜像比最新版本滞后一个月，以便我们在新不兼容问题导致用户遇到故障前，发现那些需要修改配置的问题。

但如果你愿意帮助发现这些潜在问题，可以使用 edge 频道。它会让你的 Omarchy 软件包跟踪最新的开发版本，并让你在最新 Arch 软件包可用后立即更新。只有当你熟悉 Linux，并且知道如何恢复出现问题的系统时，才应该这样做。

每次新的主要版本发布前，我们会使用 RC 频道进行最终验证。如果你有兴趣帮助完成最后的打磨，欢迎来 Discord 的 #omarchy-release-candidates 频道交流。

最后是 dev 频道，它会将 Omarchy 直接连接到 `~/omarchy` 中的源代码 git checkout，并结合 edge 软件包。只有当你是经验丰富的 Linux 用户、正在直接参与 Omarchy 开发，并且愿意接受系统可能损坏时，才应该使用此频道。

你可以在 Omarchy 菜单中通过 _Update > Channel_ 切换频道（也可以在终端中使用 `omarchy-channel-set`）。

### 固件更新

会变旧的不只是软件包。许多笔记本电脑和外设通过 Linux Vendor Firmware Service 提供 BIOS、SSD 和扩展坞固件，Omarchy 菜单中的 _Update > Firmware_ 会获取并安装硬件可用的更新。第一次运行它时会安装 `fwupd`。许多固件只能在重启期间写入，因此被要求重启时不必感到意外。

### 关于直接使用 pacman/yay 更新的警告

如果你已经熟悉 Arch，可能会想直接运行 `pacman -Syu` 或 `yay -Syu`，但这样做会错过 Omarchy 与新软件包一起执行的快照、迁移和配置更新。因此，Omarchy 实际上会阻止直接的系统升级，并引导你改用 `omarchy update`。（如果你确实知道自己在做什么，保护机制会告诉你如何为单次事务绕过它。）

### 回滚有问题的更新

如果更新后遇到问题，可以将系统回滚到更新前创建的快照。只需重启，然后在启动加载菜单中选择开始更新前的那个快照。

![bootloader](images/bootloader.webp)

如果配置文件不知何故已损坏，还可以在终端中使用 `omarchy reinstall` 重新安装 Omarchy。这会重新安装所有默认 Omarchy 软件包，将系统切换到 stable，并降级过新的软件包，同时重置所有配置文件。请注意，所有对 Omarchy 默认设置所做的用户配置修改都会在此过程中被覆盖！
