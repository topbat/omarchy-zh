# Windows 虚拟机

Omarchy 提供了一种通过 Docker VM 运行 Windows 的简便方式。你可以从 Omarchy 菜单（`Super + Space`）中选择 _Install > Windows_ 进行安装。

你的计算机需要 KVM virtualization 才能使用此功能，大多数计算机都具备，但它有时会在 BIOS 中被关闭；如果确实如此，安装程序会提示你。你还需要准备磁盘空间：分配给 Windows 的空间，再加上约 10GB 的镜像空间。

安装程序会询问要分配多少 RAM、多少 CPU cores 以及多少磁盘空间（64GB 或更多是合理的下限），然后询问 Windows 用户名和密码。将这些留空，就会使用 `docker` / `admin`。下载需要一段时间，通常 10-15 分钟；你可以在浏览器中通过 `http://127.0.0.1:8006` 查看进度。

 ![windows-vm](images/windows-vm.webp)

## 使用方法

安装完成后，从应用启动器启动 _Windows_。如果虚拟机尚未运行，这会先启动虚拟机，然后通过 RDP 以全屏方式连接。冷启动时请等待 15-30 秒。

RDP 会话支持声音、麦克风和共享剪贴板，因此在 Linux 与 Windows 之间复制文本可以直接使用。分辨率会跟随窗口变化，Omarchy 也会传递显示缩放设置，因此在 HiDPI 屏幕上不会模糊不清。

关闭 RDP 窗口后，虚拟机会自动关机。如果希望让它继续运行，例如其中有任务正在进行，请改用 `omarchy windows vm launch --keep-alive` 启动。

其余控制也使用同一条命令：

```bash
omarchy windows vm status    # is it running?
omarchy windows vm stop      # shut it down
omarchy windows vm launch    # start and connect
```

## 共享文件

主目录中的 `~/Windows` 目录会自动与虚拟机共享。如果希望 Windows 能访问某些文件，请将文件放在那里。虚拟机无法访问文件系统的其他部分，因此 Windows 端的恶意内容不会影响你的其他文件。虚拟机自己的虚拟磁盘位于 `~/.windows`。

虚拟机的端口仅绑定到 localhost，因此网络上的其他设备无法访问 Windows 机器。

## 限制和许可

此设置不支持 GPU passthrough，因此不适合游戏或视频编辑。但它非常适合运行 Microsoft Office 或其他你确实必须使用的软件。

安装的版本是未激活的 Windows 11 Pro。你需要自己的 license key 才能使用受限功能。

如果这台计算机出厂时预装了 Windows，那么即使安装 Omarchy 后，OEM key 仍保存在固件中。使用 `omarchy windows key` 可将其打印出来。该密钥与这台机器绑定：它可以激活在这台硬件上重新安装的 Windows，但通常无法激活虚拟机中的 Windows。

之后可以重新运行 `omarchy-windows-vm install` 来更改资源分配；它会根据你的回答重写虚拟机配置。compose file 现在位于 `/var/lib/omarchy/windows/docker-compose.yml`，并由 root 拥有，这是有意为之：这样，以你的身份运行的进程就无法重写它，也无法让特权启动过程将整个磁盘挂载到容器中。如果需要手动编辑它（例如挂载 USB 设备），请使用 `sudo` 编辑，并参阅 [the Dockur Windows project](https://github.com/dockur/windows) 中的所有选项。

要彻底移除整个虚拟机，请从 Omarchy 菜单选择 _Remove > Windows_。这会删除虚拟机磁盘及其所有数据，因此请先确认 `~/Windows` 中需要保留的内容都已移出。
