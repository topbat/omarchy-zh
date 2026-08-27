# 系统快照

每次 Omarchy 更新时，我们都会自动创建快照；如果你想自行创建快照，可以使用 `omarchy-snapshot create`。

要启动并恢复快照，请从 Limine boot loader 中选择它。（如果当前启动后直接进入 Omarchy 解密画面，则需要先通过 BIOS 选择 Limine 作为启动选项。）

在该画面中，根据日期和版本选择你想要启动的快照。创建快照时的 Omarchy 版本显示在左下角。

 ![snapshots-bootloader](images/snapshots-bootloader.webp)

进入系统后，会弹出通知，告知你当前处于可启动快照中；点击该通知即可开始恢复过程。也可以使用 `omarchy-snapshot restore`。

 ![snapshots-restore](images/snapshots-restore.webp)

这会恢复根文件系统，但不会恢复 `/home`。因此它适合回滚损坏的系统更新，但不适合找回丢失的个人文件。

这也意味着你的 `~/.config` 目录会保持原样。因此，如果你要回滚到某个库或应用的较早版本，而该版本保存配置文件的格式有所不同，就必须手动处理相关问题。

_注意：此功能仅适用于使用 Limine boot loader 的安装；自 Omarchy 2.0 起，Limine 一直是默认 boot loader。如果使用 GRUB 或 systemd-boot，则无法使用此功能。_

### 跳过启动菜单

如果你从不操作启动菜单，只希望机器直接进入解密画面，可以在 Omarchy 菜单中运行 _Setup > Direct Boot_。这会添加一个直接指向 Omarchy 的 EFI 条目，使固件无需停留在 Limine 就能启动它。

代价就是开头提到的情况：启用 direct boot 后，若要进入快照，必须先从 BIOS 启动菜单中选择 Limine。再次运行 _Setup > Direct Boot_ 可移除该条目，恢复通过 Limine 启动。某些固件对自定义 EFI 条目的兼容性不佳，因此在 American Megatrends 和 Apple 固件上，设置程序会拒绝运行。
