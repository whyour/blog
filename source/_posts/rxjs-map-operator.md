---
title: rxjs 中的 switchMap
date: 2019-05-26 18:11:30
tags: [rxjs, operator]，
draft: true
---
在 angular app 中，当我们要写一个搜索相关的功能时，我们可能要考虑节流，另外一个我们需要考虑的就是，当我们结束输入的时候，由于一些原因，接口还未返回数据，这时候我们又输入了新的内容，然后又会发送一个请求，那这时候就会产生一个问题，如果后一个接口，先返回数据，就会造成我们搜索到的结果是错误的。这时候我们就需要用到 rxjs 中的 map 相关的操作符。

### switchMap

switchMap 的特点简单说就是，如果前一个请求订阅未返回数据，发起第二次请求的时候，就会取消掉前一个请求的订阅

![20190526184336.png](https://i.loli.net/2019/05/26/5cea6ddad118638156.png)

当我们输入 1234 并把网速调到 slow 3g 时，然后再输入 5，这时候前一次请求就会被 canceled 掉，这样我们就会节约 api 请求，也可以防止返回数据顺序不对，造成页面渲染的结果与预期不符。

只要我们可以把操作变成一个 Observable, 这样 api 请求就可以减少许多额外的。

### 完整 demo

[rxjs-map-demo](https://github.com/whyour/rxjs-map-demo)