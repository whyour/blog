---
title: 如何使用nodejs暴力抓取拉钩公司信息
date: 2018-07-04 16:07:33
tags: [nodejs,puppeteer,lagou]
---
### 首先整理思路
> 拉勾公司主页地址 `https://www.lagou.com/gongsi/id.html`, 所以我们主要要得到公司id，然后用id请求主页，抓取主页中我们需要的信息。
> 进入公司页面，测试中发现，每个城市代码是0-359中的一个，所以构造一个0-359的数组，`a = [...Array(360).keys()]`
> 融资阶段是 `b = [...Array(8).keys()]`,0-8的数组
> 行业领域是 `c = [24, 25, 33, 27, 29, 45, 31, 28, 47, 34, 35, 43, 32, 41, 26, 48, 38, 49, 15793, 15794, 10594]`
> 然后用这三个数组排列组合，然后去访问`https://www.lagou.com/gongsi/a[i]-b[j]-c[k]`
> 从搜索到的列表中找到公司id所在位置 `ids = Array.from($('#company_list .item_con_list').children())
    .map(item => $(item).find('a').data('lg-tj-cid'))`
> 储存ids
### 代码实现
详见[github](https://github.com/whyour/lagou-company-spider)
有问题可以评论或者提issue
### 参考资料
[p-queue](https://github.com/sindresorhus/p-queue)
[p-retry](https://github.com/sindresorhus/p-retry)
[puppeteer](https://github.com/GoogleChrome/puppeteer)
[lagou-spider](https://github.com/yesvods/lagou-spider)