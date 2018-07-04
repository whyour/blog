title: debian9 中文显示乱码
date: 2018-05-20 23:13:27
tags: ['debian','linux']
---
### debian9修复文件中部分中文显示乱码

```
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
apt-get install locale
dpkg-reconfigure locales
```
> `dpkg-reconfigure locales`配置是只选中`en_US.UTF-8`，然后tab键确认。

`locale` 命令查看。