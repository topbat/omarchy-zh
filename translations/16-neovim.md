# Neovim

[Neovim](https://neovim.io/) 是 [vi 编辑器](<https://en.wikipedia.org/wiki/Vi_(text_editor)>) 的现代实现，由 Bill Joy 早在 1976 年创建。它是一种模态编辑器，将插入模式与命令模式分开；即使只学会这套极其深奥的按键命令集中的一部分，也会获得近乎超能力的体验。不过，它的学习曲线也相当陡峭！

如果你完全不了解 vim 风格的编辑，我建议你在 YouTube 上观看 [ThePrimeagen 的 Vim As Your Editor 系列](https://www.youtube.com/watch?v=X6AR2RMB5tE&list=PLm323Lc7iSW_wuxqmKx_xxNtJC_hJbQ7R)。它会教你基础知识。请注意，与更相似的主流编辑器不同，使用 vim 需要更长时间才能达到基本熟练程度。但一旦掌握，回报也会更大。

Neovim 现在基本上可以无限配置。如果你确实想尽情折腾，可以从头创建自己的 Neovim 配置。[Typecraft 有一门从头配置 Neovim 的优秀课程](https://www.youtube.com/watch?v=zHTeCSVAFNY)。[ThePrimeagen 也有一门](https://www.youtube.com/watch?v=w7i4amO_zaE)。

不过，Omarchy 附带完整的 Neovim 配置，即 `omarchy-nvim` 软件包；它经过精心调校，用来展示开箱即用所能实现的最佳效果，而且无需你编写任何配置代码！它构建于 [LazyVim](https://www.lazyvim.org/) 之上，后者是 Neovim 插件与配置的发行版。非常出色。

## LazyVim 基础

如前所述，我不会在这篇简短介绍中教你 vim，但可以展示 LazyVim 的一些基础知识以及如何进行操作。

首先，Neovim 有 leader 键的概念。它基本上是所有命令的入口。LazyVim 将其设置为 `Space`。只需按下它，等待一秒钟，你就会看到许多以内联方式解释的选项，如下所示：

下面是一些我一直在使用的基础命令：

- `Space Space` - 在当前目录中模糊查找任意文件。
- `Space S G` - 使用 grep 搜索所有文件，并显示预览。
- `Space E` - 开关文件树。
- `Ctrl + W W` - 在文件树和编辑器之间跳转。
- `Shift + H` - 在打开的标签页之间向左移动（vim 称之为缓冲区）。
- `Shift + L` - 在打开的标签页之间向右移动。
- `Space B D` - 关闭标签页。
- `Space B O` - 关闭当前标签页之外的所有其他标签页。
- `Space G G` - 从当前目录在浮动窗格中启动 LazyGit。
- `Space U W` - 开关软换行。

在文件树中时（按 `Space E` 显示它，按 `Ctrl + W W` 跳转到那里），可以按 `a` 添加新文件，或按 `A` 添加新目录。在树中按 `?` 可查看所有命令。

如果你想掌握基础的 vim 语言，我写过关于[三部分语法](https://world.hey.com/dhh/wonderful-vi-a1d034d3)以及如何完成那些酷炫组合操作的文章！

你可以在 [LazyVim Keymaps 页面](https://www.lazyvim.org/keymaps)查看所有可能的命令。

## 启动 Neovim

你可以使用 `Super + Shift + N` 启动 Neovim（该绑定会启动你的默认编辑器，开箱即为 Neovim），但通常更方便的方式是在终端中导航到希望工作的目录，然后输入 `n`。`n` 是 `nvim` 的别名，默认会使用当前目录打开。你可以使用 `n myfile.txt` 打开单个文件。

## 使用 Neovim 编辑 sudo 文件

如果需要编辑只有超级用户才能修改的文件，可以运行 `sudoedit /etc/sudoers.d/00-sudo-only-file`，使用配置好全部插件的 neovim 进行编辑。
