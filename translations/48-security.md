# 安全

Omarchy 极其重视安全。这是一个让你能够在真实世界中进行真实工作的操作系统，笔记本电脑丢失不应导致安全紧急事件。因此，我们采取了以下措施：

1. *强制全盘加密*：这是保护数据物理安全最重要的一步。如果电脑丢失或被盗，数据会使用标准 LUKS (Linux Unified Key Setup) 完全加密。
2. *默认启用防火墙*：默认阻止所有传入流量，但 [LocalSend](https://localsend.org/) 使用的端口 53317 除外。即使 ssh 也会保持关闭，直到你通过 _Setup > Security > SSHD_ 将其启用；作为设置的一部分，该操作会开放端口 22（并限制暴力破解速率）。我们还通过 [ufw-docker](https://github.com/chaifeng/ufw-docker) 设置限制 Docker 访问，防止容器意外暴露给整个网络。
3. *Arch 始终提供最新更新*：Omarchy 构建于其上的底层发行版 Arch 是滚动发行版。这意味着任何软件包中发现并修复的安全漏洞，都能很快通过 `omarchy-update` 安装。这样你始终运行的都是所有软件的最新且最安全版本。
4. *Omarchy 维护自己的软件包和镜像*：默认情况下，Omarchy 只依赖 Arch 自有的 core/extra/multilib 软件仓库以及 Omarchy 自己的 Omarchy Package Repository。你可以直接从 AUR 安装软件，但基础安装不会这样做，只有少数可选安装（例如第三方浏览器）会从 AUR 获取软件。
5. *Cloudflare 为我们提供 DDoS 防护*：Omarchy 的全部发行基础设施，包括 ISO、Omarchy 软件包和 Arch 镜像，都由 Cloudflare 强大的 DDoS 防护盾保护，并托管在其 CDN 上，从而提供出色的可用性。

## 更改密码

在加密安装中，你有两个密码：一个用于在启动时解锁驱动器，另一个用于登录和执行 `sudo`。两者都可以在 Omarchy 菜单中的 _Update > Password_ 下更改，前者选择 _Drive Encryption_，后者选择 _User_。更改驱动器密码时会先要求输入当前密码，因此请准备好当前密码。

## 转交已使用过的机器

如果你要把机器交给其他人，无需重新安装。运行 Omarchy 菜单中的 _Setup > Reset Computer_，输入 `reset` 确认，然后重启。这会清除所有用户账户和 `/home` 中的所有内容，丢弃你在安装后进行的所有软件包和系统更改，并清除机器身份信息，包括网络连接、主机密钥等。重新启动后会出现首次启动时的设置向导，新的所有者可以输入自己的姓名、密码和加密密码。

它通过恢复安装程序创建的基线快照来实现，因此仅适用于从 Omarchy ISO 安装的机器。在未加密的驱动器上，重置只是删除而非安全擦除；如果数据敏感，请改为全新安装。

## 无密码 sudo

有时你希望 `sudo` 不再询问密码，最常见的情况是 AI agent 正在替你进行长时间的系统工作。_Setup > Security > Passwordless Sudo_ 会关闭密码询问 15 分钟，之后自动恢复。计时器结束前再次运行它可以提前结束；如果 15 分钟不够，也可以使用 `omarchy-sudo-passwordless 30` 传入自定义分钟数。

必须清楚这一点：启用期间，以你的用户身份运行的任何程序都可以无需询问而执行任意 root 操作。这正是它的目的，也是它带来的全部风险。

## 签名密钥

所有 ISO 签名和 Omarchy repo package 使用的公钥是 `40DFB630FF42BCFFB047046CF0134EE680CAC571`（可在 [openpgp.org](https://keys.openpgp.org/search?q=pkgs%40omarchy.org) 验证）。`omarchy/omarchy-keyring` 软件包也包含此密钥，并会用于无缝推出任何潜在更新。

在任意 ISO 发行版 URL 后添加 .sig，即可找到其签名。例如 https://iso.omarchy.org/omarchy-x.x.x.iso.sig。
