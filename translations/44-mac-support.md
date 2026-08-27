# Mac 支持

Omarchy 内置支持 **Intel Macs**。目前存在一些已知限制，但只要你了解并接受这些限制，就可以通过安装 Omarchy 让旧 Mac 焕发新生。

请注意，目前不直接支持在 M 系列 Mac 上安装。你可以在我们的 [Discord](https://discord.gg/tXFUdasqhY) 的 #omarchy-on-other 频道中了解更多相关状态。

在一次简单测试中，我们仅通过安装 Omarchy，就让一台 2019 MacBook Pro 获得了 36% 的性能提升。

 ![macbook-omarchy](images/macbook-omarchy.webp)

### 在 Mac 上安装 Omarchy

目前 Omarchy 只支持作为唯一安装的 OS。安装过程中，驱动器会被擦除，MacOS 将不再能够启动。

如果你愿意，之后仍然可以通过 Internet Recovery 恢复它。

本节假设你已经阅读过 [入门指南](02-getting-started.md) 并准备好了 USB 驱动器。如果还没有，请现在就完成这些准备工作。

#### 禁用 Secure Boot

必须禁用 Apple 的 Secure Boot，才能从可启动 USB 以及安装好的 OS 启动。请按以下步骤操作：

1. 关闭 Mac
2. 开机后 _立即_ 按住 Command-R，直到看到加载画面出现
3. 选择你的用户，并在提示时输入密码
4. 进入恢复画面后，从菜单栏选择 **Utilities > Startup Security Utility**
5. 在提示进行身份验证时输入密码
6. 在 Secure Boot 选项中选择 "No Security"
7. 在 External Boot 选项中选择 "Allow booting from external or removable media"

#### 开始安装

1. 插入 USB 驱动器
2. 重启 Mac 后 _立即_ 按住 Option，直到看到启动设备画面
3. 选择橙色的 EFI Boot 设备
4. 按照[正常方式安装](02-getting-started.md)

安装程序会检测 Mac 硬件并自动应用所需的修复：Broadcom Wi-Fi 驱动程序和固件、需要该驱动的 MacBook 型号上的 SPI 键盘驱动程序，以及这些型号所需的 NVMe 挂起修复。

### 已知限制

社区成员一直在努力解决这些问题。如果这些问题会影响你的使用，请加入我们的 [Discord](https://discord.gg/tXFUdasqhY) 中的 #omarchy-on-other 频道，看看是否有最新的解决方法。

#### 配备 T1 芯片的设备

Apple T1 芯片于 2016 年末推出，专用于第一代带 Touch Bar 的 MacBook Pro 机型。
- MacBook Pro 13-inch (2016, two Thunderbolt 3 ports) – Model: A1706
- MacBook Pro 13-inch (2016, four Thunderbolt 3 ports) – Model: A1708
- MacBook Pro 15-inch (2016) – Model: A1707

#### 已知问题

- Touch Bar 无法使用
- 声音无法正常工作

#### 配备 T2 芯片的设备

Apple T2 Security Chip 于 2017 年推出。随着 2020 年 Apple silicon（M-series chips）的过渡，T2 芯片停止使用。

- iMac Pro (2017) – Model: A1862
- MacBook Pro 13-inch (2018, four Thunderbolt 3 ports) – Model: A1989
- MacBook Pro 15-inch (2018) – Model: A1990
- MacBook Air (Retina, 13-inch, 2018) – Model: A1932
- Mac mini (2018) – Model: A1998
- MacBook Pro 13-inch (2019, two Thunderbolt 3 ports) – Model: A2159
- MacBook Pro 13-inch (2019, four Thunderbolt 3 ports) – Model: A2178
- MacBook Pro 15-inch (2019) – Model: A1990
- MacBook Pro 13-inch (2020, two Thunderbolt 3 ports) – Model: A2265
- MacBook Pro 15-inch (2020) – Model: A1990

对于这些型号，安装程序会自动设置经过修补的 `linux-t2` 内核、T2 音频配置、Apple 的 Broadcom Wi-Fi/Bluetooth 固件，以及通过 `t2fanrd` 实现的风扇控制。Touch Bar 使用内核内置的 Boot Camp 风格支持运行。
