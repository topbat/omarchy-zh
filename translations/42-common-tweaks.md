# 常用调整

这里汇集了一些对 Omarchy 设置进行常见定制的方法。请注意，系统更新偶尔可能需要将某些配置恢复到原始状态。如果发生这种情况，你的更改不会丢失，而是会以 `.bak` 文件的形式保存在同一目录中。

如果你弄坏了某项设置，可以通过 Omarchy 菜单中的 _Update > Config_ 将单个配置恢复为原始设置。如果你把所有东西都弄得一团糟，可以使用 `omarchy-reinstall` 重置所有配置。

### 始终显示所有托盘图标

默认情况下，Dropbox、1password 或 Steam 等托盘图标会隐藏在托盘展开箭头后面，将鼠标悬停在箭头上时才会显示。如果你希望始终显示它们，请右键点击展开箭头打开托盘图标管理器，然后固定你想要保持可见的图标（也可以隐藏你永远不想看到的图标）。

### 圆角窗口

Omarchy 的默认设计采用直角，但如果你想让界面柔和一些，可以修改 `~/.config/hypr/looknfeel.lua`，取消圆角设置前的注释：

```
hl.config({
  decoration = {
    -- Use round window corners.
    rounding = 8,
  },
})
```

### 移除窗口间隙

在笔记本电脑显示屏上，有些人更喜欢不在窗口间隙上浪费任何像素（甚至也不需要顶部栏，可以使用 `Super + Shift + Space` 将其关闭）。你可以使用 `Super + Shift + Backspace` 关闭所有间隙和边框，或者从 `~/.config/hypr/looknfeel.lua` 的这一段中移除注释，以永久删除它们：

```
hl.config({
  general = {
    -- No gaps between windows or borders.
    gaps_in = 0,
    gaps_out = 0,
    border_size = 0,
  },
})
```
