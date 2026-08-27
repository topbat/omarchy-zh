# 硬件认证

### 指纹认证

许多笔记本电脑都配备了用于身份验证的指纹传感器。你可以通过 Omarchy 菜单中的 _Setup > Security > Fingerprint_（`Super + Space`）在 Omarchy 中使用它。

该功能会安装指纹软件包、采集你的指纹并进行验证，完成后你就可以使用指纹在锁屏中解锁（可以通过 `Super + Ctrl + L` 触发锁屏）、进入 sudo 模式以及授权系统提示。

当笔记本电脑盖合上时，指纹提示会自动跳过，因此会直接显示密码提示，而不是让你等待一个无法触及的传感器。如果你需要使用没有传感器的外接键盘工作，只需按下 `CTRL + C`，跳过使用 `sudo` 时的指纹提示。

你可以在 Omarchy 菜单中的 _Remove > Security > Fingerprint_ 下移除指纹认证。

### Fido2 认证

如果你使用 Fido2 设备，可以通过将其设置为 `sudo` 认证方式，并使用 Omarchy 菜单中的 _Setup > Security > Fido2_（`Super + Space`）完成配置。不过，它适用于 `sudo` 和系统授权提示，不用于解锁计算机。

你可以在 Omarchy 菜单中的 _Remove > Security > Fido2_ 下移除 fido2 认证。
