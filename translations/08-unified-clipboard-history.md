# 统一剪贴板与历史记录

通常在 Linux 中，终端需要使用 `Ctrl + Shift + C/V` 复制粘贴，其他地方则使用 `Ctrl + C/V`。对于不是从小使用 Linux 的人来说，这很难适应；如果你从 Mac 迁移而来，把 Super 换成 Ctrl 也同样不习惯。

Omarchy 用一组几乎在所有地方都能工作的统一剪贴板快捷键解决这两个问题：

| 快捷键 | 功能 |
| --- | --- |
| Super + C | 复制 |
| Super + X | 剪切 |
| Super + V | 粘贴 |
| Super + Ctrl + V | 剪贴板历史记录 |

_注意：大多数代理环境会使用 `Ctrl + V` 粘贴图片，但使用 `Super + V` 粘贴文本。_

### 剪贴板历史记录

剪贴板历史记录由 Omarchy Shell 提供，同时支持文本和图片。按 `Super + Ctrl + V` 打开，使用 Return 选择条目；条目会放入剪贴板，然后可以用 `Super + V` 粘贴。

![clipboard-history](images/clipboard-history.webp)

直接开始输入即可搜索历史记录：

![clipboard-history-search](images/clipboard-history-search.webp)
