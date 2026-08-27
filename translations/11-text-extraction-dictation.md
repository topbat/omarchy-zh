# 文字提取与听写

### 文字提取

按下 `Super + Ctrl + PrtScr`，选择屏幕上的一个区域进行文字提取。随后，开源 OCR 模型 tesseract 会迅速将所选内容转换为文字，并将其放入剪贴板。接着只需按下 `Super + V` 即可粘贴。

这对于从图片页脚中提取地址，或从网站标题中提取嵌入的电话号码非常有帮助。

 ![text-extraction](images/text-extraction.webp)

### 听写

Omarchy 通过 [Voxtype](https://voxtype.io/) 提供 AI 听写功能。你可以通过 Omarchy 菜单中的 _Install > AI > Dictation_ 安装它。默认情况下，它会加载一个占用 150MB 的基础英语模型。不过，你可以在终端中运行 `voxtype setup model` 来调整要使用的模型，也可以通过 `~/.config/voxtype/config.toml` 调整所有设置。

安装完成后，按住 `F9`，或使用 `Super + Ctrl + X` 切换听写，即可开始听写；听写出的文字会出现在当前获得焦点的输入区域中。
