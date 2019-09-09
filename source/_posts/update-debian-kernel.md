---
title: 更新 Debian 内核
date: 2019-09-09 22:32:17
tags: [debian, linux]
---

有时候服务器自带的内核版本比较低，这时候有些软件可能需要更高的内核，这就需要我们自己去填坑，如果你的服务器上的内容比较少，更新的时候还是比较轻松的，但是如果很多软件都比较老，就比较麻烦了，但是现在更新 linux 系统内核不会默认更新服务器上的软件，本篇就记录下更新系统的流程。

### 更新系统

```bash
apt update && apt full-upgrade -y
```

### 更新系统 apt 源

linux 的 apt 源地址在 `/etc/apt/sources.list` 文件内，一般像下图这样

```list
deb http://ftp.debian.org/debian buster main contrib non-free
deb http://ftp.debian.org/debian buster-updates main contrib non-free
deb http://security.debian.org buster/updates main contrib non-free
deb [arch=amd64] https://download.docker.com/linux/debian buster stable
deb http://deb.debian.org/debian buster-backports main
```

主要是 `deb http://deb.debian.org/debian buster-backports main` 这个源的地址要根据自己系统版本变化，比如 debian9 就是 `stretch-backports`，而 debian10 就是 `buster-backports`

修改 apt 之后，再次更新 `apt update`

### 安装新版内核

要安装新内核，今天说的是 apt 源官方支持的内核版本，没考虑编译安装最新版内核，所以我们可以先使用 `apt search` 查看目前 apt 支持的最新内核版本

```bash
apt search linux-image
```

然后执行

```bash
apt install -t buster-backports linux-image-amd64 linux-headers-amd64
```

-t 后面的 `buster-backports` 需要按照上面提到的，按照自己的版本来安装

最后就是安装新系统，然后重启

```bash
update-grub
reboot
```

### 检查新系统

系统重启之后可以使用 `uname -ra`查看系统内核版本

![20190910001840.png](https://i.loli.net/2019/09/10/JgQa1KjqXdZV6L8.png)

之后可以通过`apt purge` 删除不用的内核

```bash
apt purge linux-image-4.9.0-3-amd64
```