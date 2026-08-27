# Shell 工具

除了标准 Linux 工具外，Omarchy 还附带了一系列增强型 Shell 工具。以下是其中的主要工具。

## fzf

[fzf](https://junegunn.github.io/fzf/) 通过 `ff` 别名提供文件模糊查找功能。进入任意目录，输入 `ff`，即可在该目录树中模糊查找文件，同时在右侧查看正在缩小范围的文件预览。

你可以使用 `Ctrl + R`，通过 fzf 在命令历史中进行模糊查找。

在 Neovim 中输入 `Space Space` 时，也会使用此工具。

完整手册可通过 `man fzf` 查看。

## Zoxide

[Zoxide](https://github.com/ajeetdsouza/zoxide) 是 cd 的替代工具。它会记住你访问过的目录，方便你下次更快地跳转到这些目录。比如你执行一次 `cd ~/.config/omarchy`。下次只需执行 `cd omarchy`（甚至只需 `cd oma`），Zoxide 就会直接带你到那里。

完整手册可通过 `man zoxide` 查看。

## ripgrep

[ripgrep](https://github.com/BurntSushi/ripgrep) 使用 `rg <pattern> <path>` 搜索文件内容，例如使用 `rg Controller app/`，即可在 app 目录中查找所有提到 `Controller` 的位置。

在 Neovim 中输入 `Space S G` 时，也会使用此工具。

完整手册可通过 `man rg` 查看。

## eza

[eza](https://eza.rocks/) 是 ls 的替代工具。它提供包含更多信息、颜色和图标的目录列表。默认情况下，eza 已被设置为 ls 的别名。你也可以使用 `lt` 查看两层深度的嵌套目录列表。`lsa` 会列出包括隐藏文件在内的内容，而 `lta` 会列出包含隐藏文件的嵌套目录。

完整手册可通过 `man eza` 查看。

## fd

[fd](https://github.com/sharkdp/fd) 是更易用的 `find` 替代工具。使用 `fd person.rb` 可在当前目录树中查找名为 `person.rb` 的文件。`fd person.rb /` 会搜索整个文件系统。`fd person.rb / -H` 会搜索整个文件系统，包括隐藏目录。

完整手册可通过 `man fd` 查看。

## bat

[bat](https://github.com/sharkdp/bat) 是带有语法高亮、行号和分页功能的 `cat`。运行 `bat somefile.rb`，你就会明白为什么很难再回去使用别的工具。它还会在其他地方默默为你工作：它负责为 man 页面着色，也负责渲染 `ff` 中的预览。

完整手册可通过 `man bat` 查看。

## tldr

[tldr](https://tldr.sh/) 是 man 手册的解药，后者往往先用三屏内容介绍历史，才给出一个示例。`tldr tar` 会直接给出你真正需要的几个调用方式。

## yt-dlp

[yt-dlp](https://github.com/yt-dlp/yt-dlp) 可从 YouTube 和数百个其他网站下载视频。`yt-dlp <url>` 会将可用的最佳画质下载到当前目录。

完整手册可通过 `man yt-dlp` 查看。

## try

[try](https://github.com/tobi/try) 通过带日期的目录，让管理编程实验变得简单。所有实验都位于 `~/Work/tries`，你可以通过 `try` 访问它们。
