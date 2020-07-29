---
title: 你的第一个用github issue做的博客
tags: [Javascript, Vscode, Github]
date: 2020-07-28 20:00:19
---

每个做技术的都会有一个自己独立的空间，不管这块空间是在已经存在的像知乎、掘金、语雀，或者是其他各种笔记软件，还是部署在自己的服务器上。前段时间我看到很多博客都在`github`上用`issue`来写，但是每次都要写好`markdown`文章，然后拷贝到`github issue`里面。对于一个技术控来说，就会产生一个疑问：如何用一个东西来自动完成这一行为？

现在就用目前流行的[vscode](https://github.com/microsoft/vscode)生态的一个插件来完成。

### 主要需求

1. 能把本地`markdown`文档传到`github issue`中
2. 能更新本地`markdown`文档到`github`指定的`issue`中

### 实现

首先可以肯定是要请求`github`的[open api](https://developer.github.com/v3/)，然后找到集成`github api`的[@octokit/rest](https://github.com/octokit/rest.js/)

然后需求中需要存储对应的`issue id`，所以决定采用`yaml header`，然后找到`js`操作`yaml`的[js-yaml](https://github.com/nodeca/js-yaml)

`@octokit/rest`支持`oauth`认证方式，但是需要一个回调地址，此时发现[settings-sync](https://github.com/shanalikhan/code-settings-sync)内部有一个`express`服务。

### 使用

首先在需要安装插件`issue-blog`，可以直接在`vscode`插件列表中搜索，或者点击[链接](https://marketplace.visualstudio.com/items?itemName=whyour.issue-blog#review-details)安装

#### 认证

在第一次使用之前，需要先进行`oauth`认证，然后配置对应的仓储名称，在`vscode`中按`cmd/ctl + shift + p`执行以`Issue: `开头的任意命令

![1](https://image.whyour.cn/others/1.gif)

认证成功后浏览器会跳到如下页面

![test](https://image.whyour.cn/others/test.png)

#### 新建博客

在`vscode`中按`cmd/ctl + shift + p`执行`Issue: Create Issue`，在此之前需要确保自己在一个`markdown`文件

![5](https://image.whyour.cn/others/5.gif)

#### 更新博客

这是主要需求，在此之外，我还实现了

#### 获取博客列表

此功能是将仓储中的`open`状态的`issue`展示出来，目前实现了点击之后可以跳转到对应的`issue`

![20200729163036](https://image.whyour.cn/others/20200729163036.png)

#### 获取仓储pull request列表

此功能是为了使用pr提交代码的团队，方便拿到pr去review，目前实现了点击之后可以跳转到对应的`pr`

![20200729163047](https://image.whyour.cn/others/20200729163047.png)

### Reference

[仓储地址](https://github.com/whyour/issue-blog)
[插件地址](https://marketplace.visualstudio.com/items?itemName=whyour.issue-blog#review-details)