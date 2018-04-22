---
photos:
  - /postImg/1.jpg
title: 手机强制横屏
tags:
  - Javascript
  - Jquery
layout: post
comments: true
categories: [Javascript, Jquery]
date: 2017-04-27 19:51:14
---
页面打开，直接横屏显示。
<!-- more -->
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>手机强制横屏</title>
</head>
<body>
<div class="main">
	这是一个横屏测试
</div>
<script src="https://cdn.bootcss.com/jquery/3.0.0/jquery.min.js"></script>
<script>
  $(window).on('load resize',function(){
    var w = window.innerWidth, h = window.innerHeight;
    var $container = $('.main');
    if (w<h) {
        $container.css({
            'width': h,
            'height': w,
            'transform': 'rotate(90deg)',
            '-webkit-transform': 'rotate(90deg)',
            'transform-origin': w/h/2*100+'% 50%',
            '-webkit-transform-origin': w/h/2*100+'% 50%'
        });
    } else {
        $container.removeAttr('style');
    }
})
</script>
</body>

</html>
```
