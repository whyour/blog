---
layout: post
title: exchange server
date: 2018-02-26 13:48:52
tags:
---
##exchange2016 server CU版本 
下载地址：https://technet.microsoft.com/en-us/library/hh135098%28v=exchg.160%29.aspx

1. 首先，ExchangeServer2016安装需要域环境，且需要预先安装UCMA4.0运行库，这一点没问题，自己设置一下就可以了，否则规则检查那一块过不去。

2. 第一个坑：直接在WindowsServer2016上安装ExchangeServer2016的原版是不行的。必须使用ExchangeServer2016 CU3以上的版本，CU3就是累积更新3。本人选的直接装CU5。如果使用原版，会卡在规则检查阶段，要求系统安装桌面体验，但WindowsServer2016带GUI安装后的添加服务器功能里是没有桌面体验的，这样就死胡同了。所以必须使用CU3以上的版本。

3. ExchangeServer2016 CU3本身其实是个完整的版本，类似于“ExchangeServer2016 with CU3”。象本人这样的新手一开始看到名字以为只是个更新包，其实直接下载安装就行了。

##exchange 和 AD

https://technet.microsoft.com/zh-cn/library/aa998561(v=exchg.160).aspx