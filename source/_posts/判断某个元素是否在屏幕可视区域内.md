---
photos:
  - /postImg/2.jpg
title: 判断某个元素是否在屏幕可视区域内
layout: post
tags: [JavaScript, jQuery]
comments: true
categories: [JavaScript, jQuery]
date: 2017-07-01 00:15:28
---

JQuery
```javascript
$(function(){
    var mainOffsetTop = $(".body .blog ul li").first().offset().top;
    var mainHeight = $(".body .blog ul li").first().height();
    var winHeight = $(window).height();
    $(window).scroll(function(){
        var winScrollTop = $(window).scrollTop();
        if(winScrollTop > mainOffsetTop + mainHeight || winScrollTop <　mainOffsetTop - winHeight){
            console.log("不在可视区域内");
        }else{
            console.log("在可视区域内");
        }
    })
});

```
<!-- more -->
> 屏幕的100%高

> document.getElementById("html").clientHeight;


```javascript
JavaScript

var yuansu = $(".body .blog ul li").first();
var mainOffsetTop = yuansu.offsetTop;
var mainHeight = yuansu.style.height;
var winHeight = window.clietHeight;
document.body.onscroll = function(){
    var winScrollTop = document.body.scrollTop;
    if(winScrollTop > mainOffsetTop + mainHeight || winScrollTop <　mainOffsetTop - winHeight){
        console.log("不在可视区域内");
    }else{
        console.log("在可视区域内");
    }
}
```