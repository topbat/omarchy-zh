# 游戏

Omarchy 不只用于 _生 产 力_，也可以用来享受乐趣，还有什么比玩游戏更有趣呢？Omarchy 附带一整套游戏选项：用于原生和复古游戏的 Steam 与 RetroArch，用于非 Steam 商店的 Battle.net、Lutris 和 Heroic，用于 PC 串流的 Moonlight，用于云游戏的 Xbox Cloud Gaming + NVIDIA GeForce NOW，此外还有经久不衰的 Minecraft。

得益于 Valve 在 [Proton 兼容层](https://en.wikipedia.org/wiki/Proton_(software))上令人难以置信的工作，如今已有数以万计的现代游戏可以在 Linux 上游玩。对了，你知道 [Steam Deck](https://store.steampowered.com/steamdeck/) 实际运行的是 Arch 吗？

所有游戏安装程序都位于 Omarchy 菜单（`Super + Space`）的 _Install > Gaming_ 下。如果之后想撤销某项安装，请使用 _Remove > Gaming_。

## Steam

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Steam_ 来安装 [Steam](https://store.steampowered.com/)。

安装完成后，可以使用 `Super + Space` 启动 Steam。

请注意，Steam 可能需要 10-20 秒才能启动，而且加载时不会提供任何视觉反馈。

 ![gaming-steam](images/gaming-steam.webp)

## RetroArch

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > RetroArch_ 来安装 [RetroArch](https://www.retroarch.com/)。它附带完整的 libretro 核心，因此涵盖了所有经典系统。

RetroArch 已经完全预配置了精美的 CRT Royale 着色器，可呈现完美的复古观感。

开始使用：

1. 将 BIOS 文件放入 `~/Games/bios`，将 ROM 放入 `~/Games/roms`。
2. 使用 `Super + Space` 启动 RetroArch，然后输入 `retro`。
3. 扫描 `~/Games/roms` 目录，之后就可以开始游戏了。

你还可以通过 _Install > Gaming > RetroArch Game Launcher_ 为喜爱的游戏在应用启动器中添加专属条目；该功能可让你选择一个核心和一个 ROM，然后通过 `Super + Space` 直接进入游戏。

 ![gaming-retroarch](images/gaming-retroarch.webp)

## Xbox Cloud Gaming

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Xbox Cloud Gaming_ 来安装 Xbox Cloud Gaming Web 应用。它“只是”该服务的一个 Web 应用，但启动迅速，并且能以 1080p 流畅运行。

如果你已经订阅 Xbox Game Pass，这是游玩 Fortnite 和其他无法在 Linux 上原生运行的游戏的可靠方式。

 ![gaming-xbox-cloud](images/gaming-xbox-cloud.webp)

## NVIDIA GeForce Now

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > NVIDIA GeForce NOW_ 来安装云游戏服务 [NVIDIA GeForce NOW](https://www.nvidia.com/en-us/geforce-now/)。这也是游玩无法在 Linux 上原生运行的游戏的好方法。

 ![gaming-geforce-now](images/gaming-geforce-now.webp)

## Minecraft

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Minecraft_ 来安装 Minecraft。

与 Steam 类似，请注意，登录或启动后可能需要等待一段时间才会出现下一个画面，而且等待期间不会收到任何反馈。

 ![gaming-minecraft](images/gaming-minecraft.webp)

## Xbox 控制器

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Xbox Controllers_ 来安装对蓝牙 Xbox 控制器的支持。通过蓝牙（`Super + Ctrl + B`）配对控制器后，它们就能在你的所有游戏中使用。如果只是用 USB-C 线缆直接连接控制器，则不需要安装此项支持。

## Moonlight（从 PC 串流游戏）

Omarchy 预装了 [Moonlight 客户端](https://github.com/moonlight-stream/moonlight-qt)，因此你可以立即从运行 [Sunshine](https://app.lizardbyte.dev/Sunshine/) 的 Windows PC 串流游戏。通过 `Super + Space` 启动 Moonlight。

如果 Omarchy 计算机和远程游戏 PC 都使用有线网络连接，体验会与本地游玩没有区别。将分辨率调至原生分辨率，把刷新率设为 120Hz，并将比特率调至最高：这是在 Linux 上游玩 Fortnite 等竞技射击游戏的最佳方式。

你也可以运行 `omarchy install service sunshine`，将 Omarchy 计算机变成主机；该命令会安装 Sunshine，并为你的局域网和 Tailscale 开放 Moonlight 串流端口。

## Battle.net

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Battle.net_ 来安装 [Battle.net](https://eu.shop.battle.net/en-us)。这样可以将 Diablo、Starcraft 和 World of Warcraft 等游戏作为独立安装项在 GE-Proton 下运行，无需 Steam、Lutris 或 Heroic。

 ![gaming-starcraft](images/gaming-starcraft.webp)

## Lutris（Windows 游戏）

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Lutris_ 来安装 [Lutris](https://lutris.net/)。对于 EA 和 Ubisoft Connect 等商店中没有上述专用安装程序的 Windows 游戏，Lutris 是游玩这些游戏的方式。

安装过程有些不顺畅，有时看起来像是什么也没有发生；请耐心等待，它正在后台运行。

## Heroic Launcher（Epic Games）

从 Omarchy 菜单（`Super + Space`）中选择 _Install > Gaming > Heroic (Epic Games)_ 来安装 [Heroic Launcher](https://heroicgameslauncher.com/)。Heroic 可让你运行不依赖反作弊机制的 Epic Games 游戏，例如 OddSparks，还能运行来自 GOG 和 Amazon Prime Gaming 的游戏。遗憾的是，这意味着无法游玩 Fortnite 和 Rocket League；在 Tim Sweeney 支持 Linux 之前，这已经是最接近的方案。

与 Lutris 一样，安装游戏时可能会感觉缓慢且不顺畅。请给它一些时间。
