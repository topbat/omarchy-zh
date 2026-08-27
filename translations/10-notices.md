# 通知

通过通知快捷键，你可以快速查看日期和时间、电池状态以及当前天气。

### 日期与时间

`Super + Ctrl + Alt + T`

![notice-datetime](images/notice-datetime.webp)

### 天气

`Super + Ctrl + Alt + W`

![notice-weather](images/notice-weather.webp)

位置会根据你的 IP 地址自动检测，通常足够准确，但并不总是如此。可以用 `omarchy weather location --set Malibu` 指定位置，也可以通过坐标精确设置：`omarchy weather location --set Malibu 34.0259,-118.7798`。单独运行 `omarchy weather location` 可以查看系统认为你所在的位置；使用 `--clear` 可恢复自动检测。

### 电池

`Super + Ctrl + Alt + B`

![notice-battery](images/notice-battery.webp)
