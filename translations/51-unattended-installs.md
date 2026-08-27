# 无人值守安装

Omarchy ISO 可以在键盘前无人操作的情况下自行安装。如果安装程序发现第二个标记为 `cidata` 且携带配置文件的驱动器，它会复制这些文件，完全跳过设置向导，并自行重启进入已完成的系统。无需特殊的 ISO 构建，也无需额外的启动菜单条目；未连接此类驱动器时，一切不变，你会看到正常的向导。

这使 Omarchy 非常适合作为一次性开发环境的基础镜像：在 Proxmox 或使用 Packer 创建 VM，启动后离开，再通过 SSH 登录。`cidata` 是 cloud-init 的 `NoCloud` 标签，因此常见的虚拟化工具都已经知道如何挂载这种驱动器。

## 配置文件

这些文件与安装程序自身的向导写入的文件完全相同，因此获取一组起始文件的最简单方式是先进行一次交互式安装（例如在 VM 中），然后将它写入 `/root` 的内容复制出来：

| File | Required | Purpose |
|------|----------|---------|
| `user_configuration.json` | Yes | 磁盘、主机名、时区、键盘 |
| `user_credentials.json` | Yes | 用户名和密码哈希 |
| `user_full_name.txt` | No | Git 全名 |
| `user_email_address.txt` | No | Git 邮箱 |
| `user_encrypt_installation.txt` | No | 当配置包含 `disk_encryption` block 时为 `true` |
| `authorized_keys` | No | SSH 公钥，每行一个 |
| `tailscale_authkey` | No | 用于在首次启动时加入 tailnet 的 Tailscale auth key |

使用 `openssl passwd -6 "yourpassword"` 为 `user_credentials.json` 生成密码哈希。

你也可以放入一个名为 `defer-provisioning` 的空文件，以替代 `user_credentials.json`。这会运行同一个[为其他所有者准备安装](02-getting-started.md)，你也可以交互式触发该安装：机器安装时不包含个人信息，首次启动它的人可以选择键盘并创建自己的用户。这种模式适用于制作镜像的设备，因为驱动器不应携带任何人的凭据。

## SSH 访问

存在 `authorized_keys` 时，安装程序会将这些密钥设置为用户的 `~/.ssh/authorized_keys`，启用 `sshd`，并为其开放防火墙。（标准 Omarchy 安装会附带 openssh，但服务处于禁用状态且端口关闭，否则无人值守的机器将无法访问。）安装程序只会添加你的密钥，不会放宽 SSH daemon 的任何其他身份验证设置。

存在 `tailscale_authkey` 时，机器会改为在首次启动时加入你的 tailnet：Tailscale 从 ISO 自带的软件包中安装，防火墙允许 tailnet 接口通过，并且后台任务会在机器实际接入网络后立即执行加入操作，直到成功为止。请使用可复用且已预授权的密钥，以便一个驱动器镜像服务多台机器。

## 构建 cidata 驱动器

任何带有正确标签的文件系统都可以使用。最简单的方式是创建一个很小的 ISO：

```bash
mkdir cidata
cp user_configuration.json user_credentials.json authorized_keys cidata/
genisoimage -output cidata.iso -volid cidata -joliet -rock cidata/
```

然后将它与 Omarchy ISO 一起挂载到 VM。下面是完整的 Proxmox 示例：

```bash
qm create 101 --name my-omarchy \
  --bios ovmf --machine q35 --cpu host --cores 4 --memory 8192 \
  --ostype l26 --scsihw virtio-scsi-single \
  --efidisk0 local-lvm:0,efitype=4m,pre-enrolled-keys=0 \
  --scsi0 local-lvm:40,discard=on,iothread=1 \
  --net0 virtio,bridge=vmbr0 --vga virtio --serial0 socket \
  --ide2 local:iso/omarchy.iso,media=cdrom \
  --ide3 local:iso/cidata.iso,media=cdrom \
  --boot order='scsi0;ide2'

qm start 101
```

启动顺序特意将磁盘列在第一位：空磁盘会在第一次启动时回退到 ISO，此后已安装的系统都会从磁盘启动。

## 两个注意事项

加密的无人值守安装并非完全无人值守：首次启动时仍有人需要输入 LUKS passphrase。而且 `user_configuration.json` 中的 `disk_encryption` block 会以明文携带该 passphrase，因此请将由加密安装构建的 cidata 驱动器视为机密信息。
