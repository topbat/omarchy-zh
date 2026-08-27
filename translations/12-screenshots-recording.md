# 截图与录屏

所有屏幕捕获功能都围绕 Print Screen 键设计。单独按下可截图，配合修饰键则可以录屏、取色或提取区域内的文字。如果键盘没有 Print Screen 键，`Super + Ctrl + C` 会以菜单形式提供相同功能。

| 快捷键 | 功能 |
| --- | --- |
| `Print Screen` | 截图 |
| `Alt + Print Screen` | 开始录屏，或停止正在进行的录屏 |
| `Super + Print Screen` | 取色器 |
| `Super + Ctrl + Print Screen` | 提取区域中的文字 |
| `Super + Ctrl + C` | 捕获菜单 |
| `Super + Ctrl + .` | 转码图片或视频 |

## 截图

按下 `Print Screen` 后，屏幕会冻结，避免你选择目标时画面发生移动。拖动可选择任意区域；单击一次则会自动捕获点击位置对应的矩形区域：点击窗口就捕获窗口，点击顶部栏或空白处就捕获整个显示器。改变主意时，再按一次 `Print Screen` 即可关闭选择器。

结果会同时保存到两个位置：图片目录中的 PNG 文件和剪贴板，因此可以直接使用 `Super + V` 粘贴到聊天窗口。系统还会显示带缩略图的通知。点击通知，或按 `Super + Alt + ,` 调用最近通知，截图会在标注编辑器 Tensaku 中打开，发送前可在上面绘制箭头和方框。

文件默认保存到 `~/Pictures`，文件名类似 `screenshot-2026-08-13_14-22-05.png`。如果希望单独存放，可以设置 `OMARCHY_SCREENSHOT_DIR`；会话环境变量应放在哪里，请参阅[常见问题](46-faq.md)。目录不存在时 Omarchy 会自动创建。也可以通过 `OMARCHY_SCREENSHOT_EDITOR` 更换编辑器。

在终端中，`omarchy screenshot` 会执行相同的截图。也可以明确指定模式：`omarchy capture screenshot region` 只允许自由选择区域，`windows` 捕获窗口和显示器矩形，`fullscreen` 跳过选择器并直接捕获当前聚焦的显示器。第二个参数设为 `copy` 时只复制到剪贴板，设为 `save` 时只保存到磁盘。

### 使用键盘操作选择器

显示选择界面时，不必使用鼠标：

| 按键 | 功能 |
| --- | --- |
| `Return` | 捕获高亮窗口 |
| `Ctrl + Return` | 捕获整个屏幕 |
| `Tab` / `Ctrl + Tab` | 高亮下一个/上一个窗口 |
| 方向键 | 高亮对应方向的窗口 |

方向键和 Tab 会把光标移动到选中的窗口，突出显示会随之变化，让你能看清即将捕获的内容。这些绑定只在选择界面显示时存在，因此不会与你自己的配置冲突。

## 录屏

`Alt + Print Screen` 会打开 _Trigger > Capture > Screenrecord_，询问录制哪些声音：无音频、桌面音频、桌面加麦克风，或桌面加麦克风和摄像头。最后一个选项仅在实际连接摄像头时显示。选择后会出现与截图相同的选择器，可以拖动选择区域，或单击窗口和显示器。

录制由 gpu-screen-recorder 完成，它默认使用 GPU 以 60fps 编码，必要时会回退到 CPU。结果是保存在 `~/Videos` 中的 MP4 文件，文件名类似 `screenrecording-2026-08-13_14-22-05.mp4`。使用 `OMARCHY_SCREENRECORD_DIR` 可以修改目录。需要注意：与截图目录不同，录屏目录必须预先存在，否则录制不会开始。

录制期间，顶部栏会出现一个小指示器，点击即可停止。也可以再次按 `Alt + Print Screen`，或使用 _Trigger > Capture > Screenrecord_ 下仅在录制期间出现的 _Stop Screenrecording_ 项。

停止录制后，系统会先做一些整理：裁掉第一帧；如果有音频，则标准化到 -14 LUFS，并静音开头的 PipeWire 捕获爆音。之后会显示带有视频缩略图的通知，点击即可用 mpv 播放。

### 摄像头叠加层

使用摄像头录制时，摄像头画面会作为固定、裁剪过的竖向浮动窗口显示在录制区域右下角。如果挡住了需要的内容，可以在录制过程中调整大小：

| 快捷键 | 功能 |
| --- | --- |
| `Super + Alt + [` | 缩小摄像头叠加层 |
| `Super + Alt + ]` | 放大摄像头叠加层 |

叠加层有小、中、大三档，快捷键会依次切换，默认是中等。尺寸按录制画面比例计算，因此无论录制 1080p 还是 6K 显示器，摄像头占画面的比例都相同。如果录制的是一个区域而不是整个显示器，叠加层会固定在该区域的角落，确保它位于录制范围内。

也可以直接运行 `omarchy-capture-webcam-resize small`，或使用 `reset` 恢复中等大小。

## 文字、二维码和颜色

`Super + Ctrl + Print Screen` 选择区域后执行 OCR，并把文字放入剪贴板。详细说明请参阅[文字提取与听写](11-text-extraction-dictation.md)。

_Trigger > Capture > QR Code_ 会以相同方式识别二维码。选择包含二维码的区域后，解码值会进入剪贴板。它只查找二维码，避免复杂屏幕内容被误识别为普通条形码。解码值只会进入剪贴板，不会打印、不会出现在通知中，而且会标记为敏感信息，因此不会保留在[剪贴板历史记录](08-unified-clipboard-history.md)里。二维码经常包含机密数据，例如设置双重验证时的 `otpauth://` URI，不应将其写入日志。正常粘贴不受影响。

`Super + Print Screen`，或 _Trigger > Capture > Color_，会把光标变成取色器。单击屏幕上的任意位置，颜色值就会进入剪贴板。再次按快捷键可退出而不取色。

## 分享前转码

4K 录屏或手机拍摄的原始 HEIC 文件通常太大，难以直接发送。`Super + Ctrl + .`，或 _Trigger > Transcode_，可以解决这个问题。它会在 `~/Pictures` 和 `~/Videos` 中打开模糊搜索式文件选择器，然后询问格式和尺寸。

图片可以转换为 jpg 或 png，并选择高、中、低质量，对应最大宽度 3160、2160 和 1080 像素。视频可以转换为 mp4 或动态 gif，并选择 4k、1080p 或 720p。转换后的文件会写到原文件旁边，文件名中包含分辨率，例如 `demo-1080p.mp4`；文件 URI 会复制到剪贴板，可以直接粘贴到支持文件拖放的应用中。

如果已经知道需要的格式，也可以在终端执行：`omarchy transcode ~/Videos/demo.mov mp4 1080p`。此外还有 `omarchy transcode ascii`，它可以把图片转换成 ASCII 艺术，主要用于[品牌设置](41-branding.md)。

## 发送到其他设备

获得文件后，使用 `Super + Ctrl + S` 打开共享菜单，通过 LocalSend 发送到局域网中的其他设备。详见[图形界面](22-guis.md)。
