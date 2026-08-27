# Shell 函数

Omarchy 附带了一组 Shell 函数，用于简化常见任务，并封装复杂的参数调用。

## 压缩

- `compress [file/dir]`：从文件/目录创建 tar.gz 压缩包。
- `decompress [file.tar.gz]`：解开 tar.gz 文件。

## 驱动器

- `iso2sd [image.iso]`：使用指定的 iso 文件在 SD 卡上创建可启动驱动器，并以交互方式选择驱动器。
- `format-drive [device] [name]`：将整个磁盘格式化为单个 exFAT 分区（Windows 和 macOS 也可使用）。不带参数运行即可查看可用驱动器。请务必小心！

## 开发布局

用于 tmux 的即时多窗格开发布局：

- `tdl [ai]`：创建一个 Tmux Dev Layout，其中包含编辑器、AI 代理和终端。使用代理别名，例如 `tdl c` 启动 opencode，或 `tdl cx` 启动 Claude Code；也可以传入第二个代理同时运行两者，例如 `tdl c cx`。
- `tds`：创建一个 Tmux Dev Square，其中包含编辑器、差异监视（通过 `hunk diff --watch`）、终端和 opencode。
- `tdlm [ai]`：为当前目录中的每个子目录创建一个 `tdl` 窗口。
- `tsl [count] [command]`：创建平铺成网格的窗格集，所有窗格都运行相同的命令（非常适合 AI 代理）。

Herdr 也提供同样的布局，命令分别为 `hdl`、`hds`、`hdlm` 和 `hsl`。

## Git 工作树

- `ga [branch]`：在当前仓库旁创建新的工作树和分支，并进入其中。
- `gd`：移除当前工作树及其分支（会先询问确认）。

## Rsync 监视器

- `rsw [source] [destination]`：启动后台监视器，每当发生任何变化时，就将 source rsync 到 destination。destination 可以是远程主机，例如 `rsw ~/Work/app nyc-dev:Work/app`。
- `lsw`：列出所有活动监视器。
- `dsw`：停止所有活动监视器。

## SSH 端口转发

适合在远程主机上进行网页开发，同时让 localhost 具备安全上下文权限。

- `fip`：通过 SSH 将远程主机的一个或多个端口转发到 localhost。
- `dip`：断开一个或多个已转发的端口。
- `lip`：列出所有活动的 SSH 端口转发。

假设你在一台可通过 `nyc-dev` 访问的机器上启动了端口 `3000` 的开发服务器，那么可以运行 `fip nyc-dev 3000` 转发该端口。这样，`localhost:3000` 实际上会连接到 `nyc-dev:3000`，而无需 SSL 证书即可建立测试 WebSocket 等功能所需的安全上下文。

## SSH 重连

`ssh` 本身被一个函数包装：当远程 tmux、Herdr 或编辑器占用终端的连接断开时，它会清理终端，并在交互式会话中断后自动重新连接（Ctrl-C 会停止重试循环）。
