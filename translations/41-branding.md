# 品牌

Omarchy 允许你为启动解锁界面、屏幕保护程序和关于界面设置公司徽标或个人图片。

### 启动解锁

你可以使用 `omarchy plymouth preview` 查看自定义徽标和颜色的效果。它接收背景颜色、文本颜色、徽标 png 文件以及预览图片路径：

```
omarchy plymouth preview '#1d2021' '#ebdbb2' logo.png preview.png
```

然后使用 `omarchy plymouth set '#1d2021' '#ebdbb2' logo.png` 应用设置，这也会让 SDDM 登录界面使用相同的颜色和徽标。如果想恢复，可以使用 `omarchy plymouth reset`。

 ![branding-plymouth-shopify](images/branding-plymouth-shopify.webp)

### 屏幕保护程序

你可以在 _Style > Screensaver_ 下更改屏幕保护程序使用的徽标。它是 ASCII 徽标，因此你可以直接编辑文本，也可以提供 png 或 svg 图片，我们会将其转换为 ASCII。效果相当不错。

 ![branding-screensaver](images/branding-screensaver.webp)

该菜单中有三个选项：

- **Edit Text** 会在编辑器中打开 `~/.config/omarchy/branding/screensaver.txt`。输入或粘贴任何你喜欢的内容——ASCII 艺术、你的名字，甚至粗俗的词语。保存并退出后，屏幕保护程序会立即启动，以便你查看效果。
- **Set From Image** 会打开一个用于选择 png 或 svg 的文件选择器，将其转换为 ASCII，并显示结果。轮廓清晰的徽标比照片的效果好得多。
- **Restore Default** 会恢复 Omarchy 徽标。

### 关于界面

Omarchy 菜单中 _Style > About_ 下的 _About_ 界面也提供相同的三个选项，工作方式完全相同——文件是 `~/.config/omarchy/branding/about.txt`，每次更改后都会弹出 About 窗口。About 艺术会被转换为比屏幕保护程序更小的尺寸，因为它需要适应窗口，而不是铺满整个显示屏。

窗口打开时，每隔几秒会有一道绿色的微光斜掠过图案，然后图案再次静止。只要你的自定义艺术中的每个字符都占一列宽度，它也会获得这一效果——**Set From Image** 生成的内容都符合这一条件。由 emoji 或双宽字符构成的艺术会保持静止；如果你保留了自己编写的 fastfetch 配置，屏幕也会保持静止：这些情况下徽标静止并不是动画失效，而是动画在主动避免干扰，因为在这些内容上滑动微光会使该行的其余部分错位。

 ![branding-about](images/branding-about.webp)

### 自行转换图片

两个 **Set From Image** 选项实际上都只是调用 `omarchy transcode ascii`；如果你想控制转换过程，也可以直接运行它：

```
omarchy transcode ascii ~/logo.svg ~/.config/omarchy/branding/screensaver.txt --width 100
```

它接受以终端列和行表示的 `--width` 与 `--height`，接受 `braille`（默认且精细得多）或 `block` 两种 `--mode`，接受用于判断哪些像素属于徽标的 `--threshold` 百分比，还接受用于徽标在深色背景上显示为浅色时的 `--invert`。如果转换结果变成一团，通常应该调整 threshold。

### 用文字代替徽标

`omarchy ascii` 使用 Delta Corps Priest 1 绘制文本，这是绘制 Omarchy 字标本身所用的 FIGlet 字体，因此屏幕保护程序可以显示文字，而不只是图片：

```
omarchy ascii "Back in five" > ~/.config/omarchy/branding/screensaver.txt
```

它可以将文本作为参数接收；如果未提供参数，也可以从管道读取。该字体只包含字母和空格——绘制时没有加入数字或标点——因此其他字符都会被丢弃，并在标准错误中报告其名称，而不是悄无声息地吞掉。
