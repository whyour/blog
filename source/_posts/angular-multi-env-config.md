---
title: angular 如何添加多环境变量的配置文件
date: 2019-06-26 14:38:20
tags: [angular, environment]
---
在 angular 开发中，我们常常可能需要不同环境变量来添加不同的配置，但是在 angular 项目中，我们要想在 ng 命令中读取到环境变量，就需要在项目中的 environment 文件夹下添加不同环境变量的配置文件。

<!-- more -->

比如：

### environments

![20190626144925.png](https://i.loli.net/2019/06/26/5d1315767c3a241215.png)

### angular.json

但是问题是，当我们只是开发环境启动时，这个时候我们想要的是，我们传入的环境变量的配置文件应该 merge 默认的配置文件，但是，angular 目前不是 merge， 只有一种替换文件的方式。重点就在 `angular.json`这个文件中。

![20190626145415.png](https://i.loli.net/2019/06/26/5d1316995626378675.png)

在 projects 下的你都项目名称中的 architect 中的 build 和 serve，默认我们运行 ng serve 的时候，就会执行默认的 front-end:build, 如果是有环境变量的时候就是 front-end:build:prod, 然后会执行 serve 同级的 build 中的 builder，
然后我们可以给 configurations 中加入自己环境变量的配置，关键就是要加一个 fileReplacements，来替换我们的默认配置文件。

![20190626150003.png](https://i.loli.net/2019/06/26/5d1317f63881170844.png)

因为目前 angular 中的环境变量不能 merge，这时我们可以写一个 baseConfig，来提取共同的配置文件，然后在其他配置文件中引入 baseConfig。

![20190626150356.png](https://i.loli.net/2019/06/26/5d1318de14ba766719.png)

![20190626150314.png](https://i.loli.net/2019/06/26/5d1318b39964a78772.png)

最后我们在启动的时候要使用 `ng serve --configuration=${env}`, `${env}` 就是你的环境变零名称。这样你就可以完美完成多环境变量加载开发了。 