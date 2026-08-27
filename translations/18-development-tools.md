# 开发工具

## 其他编辑器

Omarchy 默认附带 [Neovim](https://neovim.io/)，但如果你想使用更主流、更熟悉的编辑器，可以打开 Omarchy 菜单（`Super + Space`），在 _Install > Editor_ 下查看选项。那里列出了 VSCode、Cursor、Zed、Sublime Text、Helix、Vim 和 Emacs。如果没有找到想要的编辑器，请查看 _Install > Package_，确认它是否属于 Arch 软件包（如果不是，再尝试 _Install > AUR_ 检查 AUR）。

`VSCode`、`Cursor`、`VSCodium` 和 `Helix` 提供主题匹配。

你可以在 `Setup > Defaults > Editor` 下设置系统范围的默认编辑器。

## 环境

Omarchy 支持通过 Omarchy 菜单的 _Install > Development_ 部分（`Super + Space`）设置大量开发环境。这里当然有 _Ruby on Rails_，也有 JavaScript 的三大运行时（Node.js、Bun、Deno），以及 Laravel 和 Symfony 等常用 PHP 框架。此外还有 Go、Rust、Python、Java、Elixir（含 Phoenix）、.NET、OCaml、Zig、Clojure 和 Scala。选择非常广泛！

这些环境大多由 [Mise](https://mise.jdx.dev/) 管理。它可以让你在同一台机器上安装并运行同一种编程语言的多个版本。它类似于 Ruby 的 rbenv 或 rvm，也类似于 Python 的 virtualenv，但适用于许多不同的环境。

例如，要安装 Ruby，可以运行 `mise use -g ruby`，这会同时安装 Ruby 并将其设为全局默认版本。或者，如果项目中有 .ruby-version 文件，只需在该项目根目录运行 `mise i` 即可。

## Docker

[Docker](https://www.docker.com/) 几乎无需介绍。它允许你运行隔离的容器，而 Omarchy 会安装顺利运行 Docker 所需的一切，包括 Docker 本身和 [Docker Compose](https://docs.docker.com/compose/)。

默认情况下，你的用户**不**属于 `docker` 组。该组实际上等同于无需密码的 root 权限：组内任何人都可以执行 `docker run -v /:/host` 并接管整台机器。因此，如果某个以你的身份运行的恶意脚本或依赖存在，你距离 root 权限实际上只差一条命令。在命令行中，你需要使用 `sudo` 运行 Docker（`sudo docker ps`、`sudo docker compose up`）；而连接到守护进程的图形工具，即 `Super + Shift + D` 上的 Docker TUI 和 Windows VM，会在需要时请求授权。如果你想恢复无需加入该组的便利方式，并且理解其中的权衡，请在 **Setup > Security > Sudoless Docker** 中启用（或运行 `omarchy-setup-security-sudoless-docker`）；这会在发出警告后将你加入 `docker` 组，之后普通的 `docker` 命令和 `d` 别名即可再次无需 `sudo` 使用。

记得使用 `Super + Shift + D` 调用 Lazydocker，以便通过简洁的 TUI 管理容器；除非你已启用无 sudo Docker，否则它会在首次使用时请求授权。

你可以在 Omarchy 菜单的 _Install > Development > Docker DB_ 中使用 Docker 设置本地开发所需的常见数据库。

## GitHub CLI

[GitHub CLI](https://cli.github.com/) 允许你通过 GitHub 账户完成身份验证，并使用它克隆私有仓库。它被配置为 mise 的延迟安装存根之一，因此首次运行 `gh` 时会自行安装。要进行身份验证，请运行 `gh auth login`。然后可以使用 `gh repo clone org/repo` 克隆私有仓库。

你还可以使用此命令执行许多其他 GitHub 操作。只需运行 `gh` 即可查看所有可用功能。

此外还有一个用于在 TUI 中管理拉取请求的 `ghui` 延迟安装存根。如果你也想在 TUI 中操作 git 本身，系统还预装了 [lazygit](https://github.com/jesseduffield/lazygit)。
