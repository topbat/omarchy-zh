# Shell 插件

Omarchy 桌面作为一个名为 `omarchy-shell` 的长期运行 Quickshell 进程运行，屏幕上几乎所有你看到的内容都是其中的插件。顶栏是一个插件，从顶栏下拉的面板也是插件，全屏覆盖层（如表情符号选择器和剪贴板管理器）、Omarchy 菜单本身、锁屏、polkit 对话框，以及监视电池和在夜间调暖屏幕的无界面服务也都是插件。

这并不只是实现细节。这意味着你可以关闭桌面中的某些部分、替换它们，或者编写自己的部分，而无需修改 Omarchy 的任何源代码。

第一方插件随 Omarchy 一起提供，位于 `$OMARCHY_PATH/shell/plugins/`。你自行添加的内容（自己的实验，或在 GitHub 上找到的插件）位于 `~/.config/omarchy/plugins/`。启动时会以相同方式发现这两类插件；唯一的区别是它们在磁盘上的位置不同。

## 查看已有插件

```
omarchy plugin list
```

该命令会打印每个已发现插件的 id、是否启用、属于第一方还是第三方、类型以及显示名称。如果要将输出提供给其他程序，可以添加 `--json`。

插件 id 使用命名空间。内置插件都以 `omarchy.` 开头，例如 `omarchy.clock`、`omarchy.network`、`omarchy.notifications`；该命名空间已被保留，因此第三方插件不能占用它。

## 启用和禁用插件

```
omarchy plugin enable omarchy.tailscale
omarchy plugin disable omarchy.weather
```

也可以使用菜单：_Setup > Plugins_ 提供 Enable、Disable、Add、Clone 和 Remove，每个操作都有一个选择器，只显示适用于该操作的插件。

启用状态存储在 `~/.config/omarchy/shell.json` 中，两类插件的规则略有不同。当第三方插件的 id 出现在该文件的任意位置时，它就会被启用：可以是顶栏布局条目、`plugins[]` 中的条目，或 `bar.id`。而不是顶栏小组件的第一方插件规则相反：它们默认启用，只有列入 `disabledPlugins[]` 时才会关闭。

完整的顶栏插件没有关闭状态。系统始终只有一个顶栏，因此启用另一个顶栏插件即可替换它。顶栏小组件的位置安排见[顶栏](05-the-top-bar.md)。

## 从 git 添加插件

第三方插件就是一个根目录中包含 `manifest.json` 的 git 仓库。

```
omarchy plugin add https://github.com/acme/omarchy-weather.git --enable
```

在执行任何操作前，它会明确告诉你插件会以任意、无沙箱限制的代码运行在长期运行的 shell 进程中，显示 URL 并要求你确认。请认真对待这一点。插件不是配置文件，而是会在整个会话期间运行的代码，可以访问你的用户账户能够访问的一切内容。只添加你愿意运行的仓库，并在启用前阅读其内容。

然后它会将仓库克隆到暂存目录，验证清单文件，若另一个插件已经声明了该 id 则拒绝安装，最后将其移动到 `~/.config/omarchy/plugins/<id>/`。如果不带 `--enable`，它会询问你是否现在启用，你可以回答否，先去阅读代码。它绝不会运行插件中的任何内容，不会执行安装钩子，也不会请求 sudo；它只会克隆文件、检查清单文件，并通过 IPC 切换一个开关。

更新操作是对同一个 checkout 执行 fast-forward pull：

```
omarchy plugin update acme.weather
omarchy plugin update
```

不指定 id 时，它会更新所有由 git 管理的插件。它会在应用前显示差异；如果存在无法 fast-forward 的本地更改，则拒绝更新；如果新修订版本未通过验证，则回滚。

```
omarchy plugin remove acme.weather
```

移除操作会先禁用插件，然后：如果它是 git checkout（仓库仍在上游），就删除它；如果它是符号链接，就解除链接。对于没有 git 仓库的手工创建插件文件夹，会将其移动到插件目录中带时间戳的备份位置，而不是直接删除。

## 克隆内置插件并修改

这是我最喜欢的部分。如果想改变内置小组件的行为，不要编辑 `$OMARCHY_PATH` 下的文件；它们属于软件包，下一次更新会覆盖这些文件。请改为克隆它：

```
omarchy plugin clone omarchy.clock
```

它会将整个插件复制到 `~/.config/omarchy/plugins/dhh.clock`（使用你的用户名，而不是我的），将其重命名为“My Clock”，启用它，并让 shell 从内置插件切换到你的副本，同时保留现有顶栏小组件的位置和设置。添加 `--edit` 会立即在 `$EDITOR` 中打开新目录，这正是菜单中的 _Setup > Plugins > Clone Plugin_ 为你执行的操作。

用户名前缀确保克隆插件的 id 属于你，因此分享它时不会与其他人的插件冲突。对原始内置 id 的调用会被路由到你的克隆，因此无需更新任何引用 `omarchy.clock` 的内容。如果修改弄乱了，执行 `omarchy plugin remove dhh.clock` 即可恢复内置插件。

保存 `~/.config/omarchy/plugins/` 下任意位置的文件都会自动重新加载插件代码，因此你可以保持编辑器打开并观察修改生效。

## 编写自己的插件

插件是一个包含 `manifest.json` 和一些 QML 的目录。清单文件声明 `schemaVersion: 1`、一个 `id`、`name`、`version`、一个或多个 `kinds`，以及一个 `entryPoints` 对象，该对象为每种类型指向相应的 QML 文件：

| 类型 | 含义 |
|------|------------|
| `bar-widget` | 活动顶栏可以放入某个区域的组件 |
| `panel` | 持久显示或召唤出的浮动窗口 |
| `overlay` | 全屏覆盖层 |
| `menu` | 召唤出的菜单界面 |
| `service` | 没有用户界面的无界面单例 |
| `bar` | 替换内置顶栏的完整顶栏 |

一个插件可以同时声明多种类型，媒体插件就是同时属于 `service` 和 `bar-widget`。顶栏小组件还会获得一个额外的 `barWidget` 块，其中包含显示名称、类别、可选的 `defaultSection`，以及 `allowMultiple`，用于说明顶栏上是否适合放置多个该小组件。大多数小组件将其设为 `false`；间隔器和指示器将其设为 `true`。

发布前，请先检查它：

```
omarchy plugin validate ./my-plugin
```

该命令会执行 shell 在加载时执行的相同检查：架构版本、必需字段、未被保留的 id、作为安全相对路径且确实存在的入口点、你声明的每种类型都对应一个入口点，以及文件夹内任何位置都不存在符号链接。

完整信息请查阅源代码中的文档：Omarchy 仓库中的 `shell/README.md` 介绍清单文件架构、shell 的 IPC 契约以及 `shell.json` 的确切结构，`shell/plugins/README.md` 列出了每个第一方插件及其 id、类型和入口点。

## 与世界分享你的插件

完成满意的插件后，将其放入公开的 git 仓库。这就是完整的分发机制：任何人都可以针对你的 URL 运行 `omarchy plugin add`，并在几秒钟内运行它。

为了帮助大家找到它，请将其列在 [omarchyplugins.com](https://omarchyplugins.com) 上。这是 Omarchy shell 插件的社区目录，当你想知道别人是否已经构建了你正准备编写的小组件时，这里是首先应该查看的地方。开始前先浏览一下！
