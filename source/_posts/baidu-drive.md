---
photos: ["/postImg/4.jpg"]
title: 百度网盘自定义提取码
date: 2017-03-15 23:25:00
tags: [黑科技]
layout: post
comments: true
categories: [Technology, Github]
---
请按照以下步骤进行操作：

在浏览器中打开百度云盘，选中需要分享的文件，然后点击分享按钮；
点击分享按钮后会弹出一个模态框，先不管它，按 F12 打开开发者工具，切换至控制台（Console），将以下代码复制粘贴到控制台，然后回车；
```javascript
  javascript: require(["function-widget-1:share/util/service/createLinkShare.js"])
   .prototype.makePrivatePassword = function() {
    return prompt("自定义百度网盘提取码", "host")
  }
```
<!-- more -->
然后点击创建私密链接，会弹出输入框，这时输入你想自定义的密码即可！
在此黑科技使用过程中需要注意以下事项：

请按照教程一步一步的进行，否则可能会出现错误或失败！
自定义的密码字符和必须为4（一个字母或数字的字符数是1，一个汉字的字符数是3，因此如果密码中有一个汉字则只能加一个字母或数字），如：1232、S猴等。
 

附GIF图片一张，动画演示让你更加明了：
![tiquma](/uploads/baiduyun.gif)
本文转自老d博客。