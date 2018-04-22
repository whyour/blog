---
photos:
  - /postImg/2.jpg
title: 微信端h5视频
layout: post
tags: [黑科技]
comments: true
categories: [video, weixin]
date: 2017-02-11 21:37:38
---

## 微信端视频设置

```javascript
<video class="video-source"
     width="100%"
　　　height="240px" 
     controls  /*这个属性规定浏览器为该视频提供播放控件*/  
     style="object-fit:fill"  /*避免视频上下出现黑边*/
     webkit-playsinline="true"  /*这个属性是ios 10中设置可以让视频在页面内播放*/  
     x-webkit-airplay="true"  /*这个属性还不知道作用*/ 
     playsinline="true"  /*IOS微信浏览器支持小窗内播放*/ 
     x5-video-player-type="h5" /*启用H5播放器,是wechat安卓版特性*/
     x5-video-orientation="portraint" /*播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏*/
     x5-video-player-fullscreen="true" /*全屏设置，设置为 true 是防止横屏*/
     preload="auto" /*这个属性规定页面加载完成后载入视频*/ 
</video>
```

<!-- more -->

> 安卓微信端视频问题
1.  X5内核 自带播放器，默认点击全屏播放
2.  退出全屏之后，仍有一个浮层悬浮在视频div上