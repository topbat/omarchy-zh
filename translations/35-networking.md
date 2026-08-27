# 网络

Omarchy 的网络由 NetworkManager 管理，你可以通过[顶部栏](05-the-top-bar.md)中的网络图标或 `Super + Ctrl + W` 进行操作。

该面板会扫描 Wi-Fi 网络、显示信号强度并进行连接。以太网完全无需设置——插上网线即可使用。如果你更愿意留在终端中，`nmtui` 提供相同的控制功能，此外还有 `omarchy network` 命令组。

## 共享 Wi-Fi

在连接 Wi-Fi 时，运行 _Setup > Network > QR Code_，无需再把一长串密码大声念出来。屏幕上会显示一个二维码，任何手机摄像头都可以扫描它并加入网络。知道这个功能后，你会发现使用次数比预想的更多。

如果你确实需要密码本身，`omarchy network password <interface>` 会将其打印出来。

## DNS

Omarchy 使用网络通过 DHCP 下发的 DNS。你可以在 _Setup > Network > DNS_ 下为整台机器覆盖该设置，Cloudflare 和 Google 都可以一键选择。选择 _Custom_ 可输入你自己的服务器。

在终端中，`omarchy dns` 会打印当前服务商，`omarchy dns Cloudflare` 则会设置一个服务商。

## 固定 Wi-Fi 频段

如果你的路由器将 2.4GHz、5GHz 和 6GHz 放在同一个网络名称下，笔记本电脑有时会一直连接速度较慢的频段。`omarchy network band` 会显示当前使用的频段，而 `omarchy network band 5` 会将其固定为该频段。使用 `auto` 可恢复自动选择。

这会固定频段，而不是固定某个特定接入点，因此你仍可在 AP 之间正常漫游。

## 速度有多快？

_Trigger > Speed Test > Network Speed Test_ 会通过一对仪表测量实际的上行和下行速度。在终端中，可以运行 `omarchy network speedtest down` 或 `up`。（该菜单中它旁边还有一个磁盘速度测试，如果你要测试另一个瓶颈的话。）

## 防火墙

防火墙默认开启并阻止所有传入流量，但有一个例外：端口 53317，因此 [LocalSend](22-guis.md) 开箱即用。

SSH 默认关闭，直到你通过 _Setup > Security > SSHD_ 开启它。开启后会启动守护进程、打开端口 22 并限制速率以防止暴力破解，同时授权一个密钥。Docker 也受到限制，因此容器不会意外地将自身暴露给整个网络。完整说明请参阅[安全](48-security.md)。

## Tailscale

[Tailscale](https://tailscale.com/) 是一种网状 VPN，可让你简单、安全地通过互联网访问所有计算机和服务器。通过 _Install > Service > Tailscale_ 安装它。

安装后，顶部栏中会出现 Tailscale 面板，你可以在其中连接和断开 tailnet、切换账户以及选择出口节点——你自己的机器和 Mullvad 区域都会显示在列表中。它还可以浏览你的机器，这也是 Taildrop 所在的位置：选择一台机器并按 `s` 向其发送文件，或按 `c`、`n`、`d` 分别复制它的 IP、名称或完整 DNS 名称。终端中的对应命令是 `omarchy tailscale send <machine> [file...]`，发送给你的文件会自动放入 `~/Downloads`。提示文件到达的通知会一直等待，直到你点击打开或将其关闭，因此你离开电脑期间收到的文件仍会在那里，回来后仍可处理。

安装它还会为 Tailscale 管理控制台添加一个 Web 应用。

## 停止工作时

在重启之前，先尝试单独重启出问题的组件。_Update > Hardware_ 中提供 Wi-Fi、Bluetooth、Audio 和 Trackpad，重新加载其中一项通常就能解决大多数“刚才还正常”的情况。请参阅[故障排除](45-troubleshooting.md)。
