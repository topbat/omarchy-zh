# 双系统安装

你可以将 Omarchy 安装到单个分区，与 Windows 或其他安装共存。

这种安装方式默认仍会对该分区使用 LUKS 加密，因此实际效果与全盘加密没有区别，只需要磁盘上有可用空间。

## 在 Windows 上腾出空间

要与 Windows 并行安装，请在开始菜单中输入 `disk management`，然后选择 **Create and format hard disk partitions**。

 ![dual-boot-1](images/dual-boot-1.webp)

找到适当的分区，右键点击并选择 **Shrink Volume**。

![dual-boot-2](images/dual-boot-2.webp)

输入你希望缩小的容量。请注意，这将是未来 Omarchy 安装的大小，其中包括启动分区（boot partition）。

 ![dual-boot-3](images/dual-boot-3.webp)

完成后，你应该会看到类似下图的内容；在本例中，50GB 的部分就是我们将安装 Omarchy 的位置。

 ![dual-boot-4](images/dual-boot-4.webp)

## 安装 Omarchy

Omarchy 的安装过程基本与正常安装相同。选择磁盘后，你会看到 **Free space install** 选项。选择该选项，以避免擦除整个磁盘。

 ![dual-boot-5](images/dual-boot-5.webp)

确认一切看起来正常，然后像平常一样等待安装完成。在这里你也可以选择不加密安装（不推荐），就像全盘安装时一样。
 ![dual-boot-6](images/dual-boot-6.webp)

## 将其他安装添加到 bootloader

完成 Omarchy 安装后，你会注意到 Limine bootloader 现在成为默认 bootloader。这样，你还可以将 Windows 等其他安装的选项添加到 Limine 中。

要执行此操作，请运行 `limine-scan` 并按照提示将所需项目添加到 limine 配置中。之后启动时，你会看到 Omarchy 的正常选项，以及 Windows Boot Manager 或其他选项。

## Bitlocker

需要特别注意的是，这种安装方式与 Bitlocker 不兼容，因为 Bitlocker 会加密整个驱动器，而不仅仅是分区。如果遇到提示 Bitlocker 已启用的错误，请启动到 Windows，进入 **Settings -> Privacy & Security -> Device encryption**，然后关闭 Bitlocker。驱动器解密可能需要一些时间。

 ![dual-boot-7](images/dual-boot-7.webp)
