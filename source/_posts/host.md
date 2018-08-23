---
photos:
  - /postImg/2.jpg
title: 你所不知道的Host
layout: post
tags: [黑科技]
comments: true
categories: [Technology, Github]
date: 2017-03-11 21:37:38
---
# Hosts是什么？

------
其作用就是将一些常用的网址域名与其对应的IP地址建立一个关联“数据库”，当用户在浏览器中输入一个需要登录的网址时，系统会首先自动从Hosts文件中寻找对应的IP地址，一旦找到，系统会立即打开对应网页，如果没有找到，则系统会再将网址提交DNS域名解析服务器进行IP地址的解析。
<!-- more -->
------

### 1. 修改hosts的作用是什么？

- 可以加快域名解析
- 可以进行谷歌、脸书、推特等国外网站的浏览
- 屏蔽广告、网站等等

### 2. hosts的位置

> ***windows*** xp/2003/vista/2008/7/8/10用户HOSTS文件是在"**c:\windows\system32\drivers\etc\hosts**"
> ***Mac***与***Android***、***iOS***用户HOSTS文件是在"**\etc\hosts**"

### 3. 如何修改
 - 直接编辑本机Hosts文件
 - 牛人写好的直接替换
[github][1]
[百度云][2]

> 提取密码：host

    注：这些网站都需要https的协议打开，国内某些软件会强制http，卸载即可。


  [1]: https://github.com/racaljk/hosts
  [2]: https://pan.baidu.com/s/1dF67DRz