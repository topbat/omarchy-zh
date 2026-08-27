# 导航

Omarchy 中的一切都通过键盘完成，真的是一切！系统第一次启动时，只用鼠标几乎什么也做不了。但按下 `Super + Space` 就能打开 Omarchy 菜单，从这里可以完成绝大多数操作。

不过，Omarchy 菜单并不是大多数时候操作系统的主要方式。我们还可以更快：最重要的应用都直接绑定到了快捷键。用 `Super + Return` 启动终端，用 `Super + Shift + Return` 启动浏览器。连续尝试这两个快捷键，你会看到 Hyprland 平铺布局的效果：

![navigation-browser-terminal](images/navigation-browser-terminal.webp)

然后按 `Super + J`，窗口会前后堆叠，而不是并排显示：

![navigation-stacked](images/navigation-stacked.webp)

再次按 `Super + J`，窗口会回到并排位置。在浏览器窗口中按 `Super + Shift + Arrow Right`，可以尝试与另一个窗口交换位置。

现在按 `Super + Ctrl + T` 启动活动监视器。它会以浮动窗口出现。按 `Super + T` 可以将它平铺，再按一次即可恢复浮动。然后按 `Super + Shift + F` 打开文件管理器，你会得到整齐的四向布局：

![navigation-fourway-tiling](images/navigation-fourway-tiling.webp)

用 `Super + Arrow` 在窗口之间移动焦点。焦点切换后，光标也会移动到新应用的中心。

按 `Super + Shift + 2`，可以把当前聚焦的应用移到第二个工作区；`Super + Shift + 1` 可以移回第一个工作区。`Super + Shift + Alt + 2` 会把当前应用移到第二个工作区，但不会跟随切换过去。

按住 `Super` 再用鼠标点击窗口，可以重新排列窗口位置。按住 `Super` 并使用鼠标右键，可以自由调整窗口大小。

使用 `Super + W` 或 `Super + Q` 关闭窗口，使用 `Ctrl + Alt + Delete` 关闭所有窗口。

使用 `Super + F` 进入全屏；使用 `Super + Alt + F` 进入保留顶部栏的全宽模式；使用 `Super + Ctrl + F` 在窗口内部全屏显示，适合观看 YouTube。

### Dwindle 与滚动布局

Omarchy 的默认布局叫作 dwindle。它会让同一工作区中打开的所有窗口始终可见，即使这意味着窗口必须缩小：

![navigation-dwindle-layout](images/navigation-dwindle-layout.webp)

你也可以把工作区切换为滚动布局，让窗口并排排列到显示器可见范围之外。使用 `Super + L` 可将当前工作区切换为这种布局：

![navigation-scrolling-layout](images/navigation-scrolling-layout.webp)

每个工作区的布局选择会分别保存。例如，你可以让工作区 1 使用 dwindle 来浏览网页，让工作区 2 使用滚动布局来编程；重启后它们仍会保持原来的布局。Omarchy 菜单中的 _Trigger > Toggle > Workspace Layout_ 也提供同一个开关。

如果希望滚动布局成为默认布局，可以在 `~/.config/hypr/looknfeel.lua` 中设置：

```lua
hl.config({
  general = {
    layout = "scrolling",
  },
})
```

### 分组窗口

使用 `Super + G` 可以将窗口分组。进入分组后，在分组处于激活状态时启动的每个窗口都会加入该组。使用 `Super + Ctrl + Arrow Left/Right` 在组内窗口之间切换，或使用 `Super + Alt + 1/2/3/4` 直接跳转到组内对应顺序的窗口。

使用 `Super + Alt + G` 可将窗口移出分组；再次按 `Super + G` 可拆散整个分组。使用 `Super + Alt + Arrows` 可以将分组外的窗口移入分组。

### 弹出窗口

使用 `Super + O` 可以将窗口从工作区布局中弹出，使它成为会跟随你切换工作区的浮动窗口。这非常适合视频播放器等应用。

![navigation-popped-window](images/navigation-popped-window.webp)

### Scratchpad 工作区

最后还有一个特殊的 Scratchpad 工作区，它会像 Quake 控制台一样覆盖在当前工作区上方。使用 `Super + Grave` 或 `Super + S` 切换显示，使用 `Super + Shift + Grave` 或 `Super + Alt + S` 将窗口放入其中。

它非常适合运行代理的终端，或放置需要快速访问、又不想离开当前工作区的控制面板。要将窗口移出 Scratchpad，可使用 `Super + Shift + 1` 等快捷键把它直接发送到其他工作区。

### 需要一点适应时间

用这种方式导航桌面需要一点时间适应，但一旦习惯，就很难再回到传统的鼠标驱动桌面体验。
