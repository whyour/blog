---
title: 如何让 git clone 速度有质的提升
date: 2019-02-28 17:20:22
tags: [git, socks5, ssh]
---

今天要克隆一个代码库，而且很多`commit`，大概会有 200~300 兆，

![20190228173939.png](https://i.loli.net/2019/02/28/5c77ac5de1797.png)

当看到 80Kib/s 的时候，我的内心是崩溃的，
于是，在 vps 上试了一下

![20190228174109.png](https://i.loli.net/2019/02/28/5c77acb6c86fe.png)

看来是国内网络的问题。search 发现，git 是支持设置代理的。so

### 前提

在设置 git clone 代理之前，首先你电脑上必须有 ss 或者其他相关代理软件，在软件高级设置中，有 socket5 代理端口。

### https 方式 clone 代码

```bash
git config --global http.proxy 'socks5h://127.0.0.1:1080'
git config --global https.proxy 'socks5h://127.0.0.1:1080'
```

或者

```bash
git config --global http.proxy 'socks5h://127.0.0.1:1086'
git config --global https.proxy 'socks5h://127.0.0.1:1086'
```

根据你本地软件不同，socks5 的端口不同，但大多是 `1080` 或者 `1086`。

### ssh 方式 clone 代码

修改本机的 `~/.ssh/config`，给里面添加一条记录。

```bash
vi ~/.ssh/config
```
```bash
Host github.com
  ProxyCommand nc -v -x 127.0.0.1:1086 %h %p
```

然后`:wq`保存退出，现在可以看结果了。

1. ssh 方式

![20190228175207.png](https://i.loli.net/2019/02/28/5c77af4939120.png)

1. https 方式

![20190228175357.png](https://i.loli.net/2019/02/28/5c77afb6c697c.png)
