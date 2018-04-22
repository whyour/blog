---
photos:
  - /postImg/3.jpg
title: 每周烧脑-1
tags: [Javascript]
layout: post
comments: true
categories: [Javascript]
date: 2017-04-03 00:29:49
---
完美数
完美数定义如下：
1. 正整数
2. 是自己的因数（除自身以外）之和

如28是完美数，因为 1 + 2 + 4 + 7 + 14 = 28

给定一个数字，判断是否是完美数：
<!-- more -->
```javascript
  <script type="text/javascript">
	function IsPerfectNumber(number){
		var sum = 0;
		var num=Math.floor(Math.sqrt(number));
		for (var i = num; i > 1; i--) {
			if(number%i == 0){
				sum = sum + i +number/i; 
			}
		}
		if((sum+1) > 0){
			alert("此数为完美数！因子和为"+(sum+1));
		}else{
			alert("此数非完美数！");
		}
	}
</script>
```
此题在于减少运算量，先对其进行开方处理。
有更简便的，可回复贴码。