# 其他软件包

Arch 的官方仓库和 Arch User Repository（AUR）提供了数量惊人的软件包，几乎涵盖所有类型的软件。

使用起来也非常简单。要安装新的 Arch 软件包，只需进入 Omarchy 菜单（`Super + Space`）中的 _Install > Package_，然后输入所需的软件包。它会自动对所有软件包列表进行模糊筛选。（你也可以在终端中手动使用 `omarchy pkg add [package]`。）

AUR 也可以用同样的方式操作，只需选择 _Install > AUR_。但请记住，AUR 未经 Arch 团队审核，就像 RubyGems 或 npm 一样，任何人都可以上传内容。

如果想移除软件包，可以从 Omarchy 菜单选择 _Remove > Package_。它会移除软件包、配置文件和依赖项。（你也可以手动使用 `omarchy pkg drop [package]`。）
