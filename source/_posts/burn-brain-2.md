---
photos:
  - /postImg/-2.png
title: 每周烧脑-2
tags: [Javascript]
layout: post
comments: true
categories: [Javascript]
date: 2017-04-15 19:47:50
---
如图所示，有一堵由高度相同但长度不同的砖块砌成的墙，墙的每一层的总长度相同。你需要从上到下画一条垂线，使得这条线切断的砖块最少（注意，不可以在最左或最右边画线），并返回被切断的砖的数量。

输入的数据是一个数组的数组，每一个子数组代表一层，元素是这一层从左到右每块砖的长度。
<!-- more -->
如上图的输入是：
[[1,2,2,1], [3,1,2], [1,3,2], [2,4], [3,1,2], [1,3,1,1]]
输出是2

```javascript
var splitWall = function(wall) {
	var sum = [],sameArr = [],count = 0,same = 0;     //sum由每个数组累加的和的值组成，sameArr由累加和相同的数组的个数组成，count为累加和，same为累加和相同的数组的个数;

	for(var i =0;i<wall.length;i++){
		for(var j=0;j<wall[i].length-1;j++){
			count = count+wall[i][j];			
			sum.push(count);
		}
		count = 0;	
	}
	for(var i=1;i<sum.length-1;i++){
		var sumNew = sum.sort();	
		if(sumNew[i] == sumNew[i+1] && sumNew[i] == sumNew[i-1]){
			same++;
		}else if(sumNew[i] != sumNew[i+1] && sumNew[i] != sumNew[i-1]){
			same = 0;
		}else{
			same = 2;	
		}
		sameArr.push(same);
	}
	same = Math.max.apply(null, sameArr);
	var diff = wall.length - same;
	return diff;
};

var arr = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1],[6],[6],[6],[6],[6],[3,3],[3,3],[6],[3,3]];  
alert(splitWall(arr));
```