---
title: webhook-js
date: 2018-09-01 21:25:56
tags: [webhook, nodejs, javascript]
---
`Webhook`是一种通过自定义回调函数来增加或更改網頁表现的方法。这些回调可被可能与原始网站或应用相关的第三方用户及开发者保存、修改与管理。术语“网络钩子”由杰夫·林德塞（Jeff Lindsay）于2007年通过给计算机编程术语“钩子”（Hook）加上前缀得。
网络钩子是“用户定义的HTTP回调”。网络钩子通常被某些事件激活，比如将代码推送到源[3]或评论博客。.[4]当此事件发生时，原网站将向为网络钩子配置的URL发送HTTP请求。用户可配置它们引发网页上的事件以调用另一个网站的行为。此操作可为任何事件。
本片博客介绍一个简单的`github`中的`webhook`自动部署`hexo`博客。

### 服务器安装依赖git，hexo，node，npm

```bash
apt install git
apt install nodejs
apt install npm
npm i -g hexo
```

### 创建blog文件夹，clone仓库代码

```bash
mkdir blog
git clone git@github.com:whyour/blog.git
```

若没有使用公钥，可使用https地址克隆，或者创建秘钥

```bash
cd ~/.ssh && ssh-keygen
cat id_rsa.pub
```

复制公钥到github的sshkeys中，即可进行ssh克隆

### 创建一个webhook.js

```bash
vi webhook.js
```

```javascript
var http = require('http');
var exec = require('child_process').exec;

http.createServer(function (req, res) {
    if(req.url === '/webhooks/push/1') { //定义webhook地址
        exec('sh ./webhook.sh');
    }
    res.end();
}).listen(9999)
console.log('we are in 9999');
```

### 创建webhook.sh脚本，执行pull，编译等操作

```bash
vi webhook.sh

#!/bin/bash

echo 'begin' > ../1.txt
cd /usr/share/nginx/blog
git pull
npm run hook
cp -r /usr/share/nginx/blog/public/* /usr/share/nginx/ninesix.cc/
echo 'end' >> ../1.txt
```

### 使用pm2启动webhook服务

```bash
npm i -g pm2
pm2 start webhook.js
```

### 把webhook地址写到github的项目设置中

`http://ip:9999/webhooks/push/1`

github会测试发送，成功之后会显示绿色对勾

![webhook](/postImg/webhook.jpg)