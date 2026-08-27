# 开始使用

Omarchy 通过 ISO 安装。你可以选择接管整块硬盘的完整安装，也可以选择将 Omarchy 放入磁盘未分配空间的空闲空间安装，用于和 Windows 或其他操作系统双系统（请参阅[双系统安装](50-dual-boot-install.md)，并记得先在 Windows 中关闭 BitLocker）。两种方式默认都启用完整加密；完整磁盘安装会清除所选磁盘，因此使用现有磁盘前务必备份！

先[下载 Omarchy ISO](https://omarchy.org/)，将它写入 U 盘（Mac/Windows 使用 [balenaEtcher](https://etcher.balena.io/)，Linux 使用 [caligula](https://github.com/ifd3f/caligula)），然后从 U 盘启动。

_必须在 BIOS 中关闭 Secure Boot 和/或 TPM。只有关闭这些功能才能安装 Omarchy。它们是面向 Windows 和微软关联 Linux 发行版的 Microsoft 安全方案。_

然后回答配置问题并确认：

 ![install-config](images/install-config.webp)

然后选择安装磁盘，等待安装过程完成。在最快的现代计算机上，安装可以在不到一分钟内完成；即使在较旧的计算机上，也不应超过 5 分钟。

 ![install-done](images/install-done.webp)

现在就可以开始使用 Omarchy 了！

### 使用有线或 2.4ghz 键盘！

完整磁盘加密在启动时不允许使用蓝牙键盘输入密码，就像你不能使用蓝牙键盘在 PC 上进入 BIOS 一样。你需要使用带 2.4ghz 接收器或有线连接的键盘（无论如何，有线连接的延迟也低得多！）。我个人很喜欢 [Lofree Flow84](https://www.lofree.co/products/lofree-flow-the-smoothest-mechanical-keyboard)！

### 为其他所有者安装

如果你是在为其他人设置电脑——家人、新员工或买家——不应该代替他们回答个人设置问题。请在安装器第一屏（键盘选择界面）按下 `Ctrl + C`，Omarchy 会转而提供为其他所有者准备电脑的选项。系统会立即安装，但所有个人设置——键盘布局、用户名、密码——会延迟到电脑首次启动时进行。磁盘仍然默认加密，新所有者在首次启动时设置的密码也会成为加密密码。（无需重新安装，也可以将已经使用中的电脑交给他人——请参阅[重置电脑](48-security.md)。）

### 无人值守安装

如果在 ISO 启动时通过第二块硬盘提供配置，ISO 也可以完全自行安装——无需键盘，也无需向导。这就是将 Omarchy 作为虚拟机和设备集群机器基础镜像时应采用的方式。请参阅[无人值守安装](51-unattended-installs.md)。

### 无加密安装

Omarchy 默认启用加密。这是任何可能丢失或被盗的计算机都应采用的安全、负责任的选择！你不希望任何能够接触到你硬件的人获取你的数据。

但在某些特殊情况下，例如在受保护的计算机上远程安装 Omarchy，或进行不含敏感数据的一次性安装时，你可能希望不使用加密。你可以在磁盘格式化确认界面按下 `Ctrl + C`，切换到无加密安装。

### 遇到问题时获取帮助

如果你遇到问题，通常可以在[社区 Discord](https://omarchy.org/discord) 的 _#omarchy-help_ 频道找到愿意提供帮助的人。
