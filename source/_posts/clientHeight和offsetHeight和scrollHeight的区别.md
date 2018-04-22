---
title: clientHeight和offsetHeight和scrollHeight的区别
tags: [Javascript]
layout: post
comments: true
categories: [Javascript]
date: 2017-05-22 20:39:19
---

#### clientHeight
大部分浏览器对 clientHeight 都没有什么异议，认为是元素可视区域的高度，也就是说元素或窗口中可以看到内容的这个区域的高度，即然是指可看到内容的区域，滚动条不算在内。但要注意padding是算在内。其计算方式为
```javascript
clientHeight = topPadding + bottomPadding+ height - 水平滚动条高度
```

##### offsetHeight
在IE6，IE7，IE8， IE9以及最新的的FF, Chrome中，对于一般元素，都是

```javascript
offsetHeight = padding + height + border = clientHeight + 滚动条 + 边框
```
 

##### scrollHeight
scrollHeight的争议比较大，有些浏览器认为scrollHeight可以小于clientHeight，有些认为scrollHeight至少应该等于clientHeight。但有一点是一样的，就是

```javascript
scrollHeight >= topPadding + bottomPadding + 内容margin box的高度
```


在浏览器中的区别在于：

==IE6、IE7 认为scrollHeight 是内容高度，可以小于clientHeight==。

==FF 认为scrollHeight 是内容高度，不过最小值是clientHeight。==

注： 以上都是对于一般元素而言的，body和documentElement的clientHeight, offsetHeight和scrollHeight在各个浏览器中的计算方式又不同。

==在所有的浏览器中，如果你想获取**视窗可见部分**的高度，应该使用**documentElement.clientHeight**，因为**body.clientHeight**是由它的**内容**决定的。==

### **==FF30==**
注意：Firefox30中，水平滚动条的宽度是17个像素。

> body
```javascript
offsetHeight = body.padding + body.border + body.height(CSS设置或内容撑的);

clientHeight = body.padding + body.height(CSS设置或内容撑的);

scrollHeight >= clientHeight;
```
> documentElement
```javascript
offsetHeight = body.offsetHeight + body.margin;

clientHeight = window窗口可见高度;

scrollHeight >= clientHeight
```
因此，只是获取窗口可见高度，在FF中得用documentElement.clientHeight，获取整个页面的高度，则应该用documentElement.scrollHeight。

> 元素

```javascript
offsetHeight = padding +border + height；

clientHeight = padding +height -水平滚动条的高度。

scrollHeight >=clientHeight
```

==总结：从body, documentElement,元素的结果分析，FireFox认为scrollHeight的最小高度是clientHeight。==

==offsetLeft = 元素border左上角到window视窗原点的距离 或 到offsetParent的border box顶部的距离。==

### **==Chrome 39==**
注意：Chrome39中，水平滚动条的宽度是17个像素。

> body
```javascript
offsetHeight = body.padding+ body.border + body.height（CSS设置或内容撑大）；

clientHeight= body.pdding + body.height（CSS设置或内容撑大）；

scrollHeight >= offsetHeight; 并且scrollHeight >= window窗口可见高度；
```

> 如果body没有内容(空的)：
```javascript
body.offsetHeight == documentElement.offsetHeight;

body.clientHeight ==documentElement.clientHeight;

body.scrollHeight ==documentElement.scrollHeight;
```

#### 而且以上属性的值都是浏览器的视窗高度。

> documentElement
```javascript
offsetHeight = scrollHeight = body.offsetHeight+ body.margin;

clientHeight = window视窗可见高度;
```



==如果body内容过短，则documentElement的offsetHeight和scrollHeight将比clientHeight小。==

==因此，只是获取页面窗口可视部分高度，在Chrome中用documentElement.clientHeight；获取整个页面内容最大高度（如果比窗口小，取窗口的高度），则应该用body.scrollHeight；获取页面内容的实际高度，应该使用body.offsetHeight()。==========

> 元素
```javascript
offsetHeight = padding + border + height；

clientHeight = padding + height -水平滚动条的高度；

scrollHeight >= clientHeight；

offsetLeft = 元素border左上角到画布原点的距离 或 到offsetParent的border box顶部的距离。
```
### **==IE9==**  
==注意：IE9中，滚动条的宽度是17个像素。==

> body
```javascript
offsetHeight = body.padding +body.border + body.height(CSS设置或内容撑大);

clientHeight =  body.padding + body.height(CSS设置或内容撑大);

scrollHeight >= clientHeight;
```
> documentElement
```javascript
offsetHeight = clientHeight + 水平滚动条的高度;

clientHeight = window窗口可见高度

scrollHeight >= clientHeight并且scrollHeight >= body.offsetHeight
```
==因此，只是获取window窗口可见高度，在IE9中得用documentElement.clientHeight，获取整个页面内容的高度，则应该用documentElement.scrollHeight。==

> 元素
```javascript
offsetHeight = padding +border + height。

clientHeight = padding +height - 滚动条的宽度。

scrollHeight >=clientHeight;
```
==总结：从body, documentElement,元素的结果分析，IE9认为scrollHeight的最小高度是clientHeight。==

==从结果分析，IE9认为scrollHeight的最小高度是clientHeight。==




### ==**IE8**==

==注意：IE8中，滚动条的宽度是17个像素。==

> body
```javascript
offsetHeight = body.padding +body.border + body.height(CSS设置或内容撑大);

clientHeight =  body.padding + body.height(CSS设置或内容撑大);

scrollHeight >= clientHeight;
```
> documentElement
```javascript
offsetHeight = clientHeight + 水平滚动条的高度 + body.border

clientHeight = window窗口可见高度

scrollHeight >= clientHeight并且scrollHeight >= body.offsetHeight
```
==因此，只是获取窗口可见高度，在IE8中得用documentElement.clientHeight，获取整个页面内容高度，则应该用documentElement.scrollHeight。==

> 元素上
```javascript
offsetHeight = padding +border + height。

clientHeight = padding +height – 水平滚动条高度。

scrollHeight >=clientHeight
```
==从结果分析，IE8认为scrollHeight的最小高度是clientHeight。==

==offsetLeft = 元素border左上角到画布原点的距离 或 到offsetParent的border box顶部的距离。==

### **==IE7==**
==注意：IE7中，滚动条的宽度是17个像素。==

> body
```javascript
offsetHeight = body.padding + body.border+ body.height(CSS设置或内容撑大)；

clientHeight = body.height +body.padding – 水平滚动条高度；

scrollHeight =  内容margin box的高度；
```
> documentElement
```javascript
offsetHeight = clientHeight =window视窗可见高度;

scrollHeight = body.offsetHeight+ body.margin;
```
==因此，只是获取窗口可见部分高度，在IE7中得用documentElement.clientHeight，获取整个页面内容的大小，则用documentElement.scrollHeight。==

> 元素
```javascript
offsetHeight = padding +border + height。

clientHeight = padding +height - scrollbar.width。

scrollHeight = padding + 内容margin box的高度
```
==从结果分析，IE7认为scrollHeight 可以小于clientHeight。==

==offsetLeft = 元素border box左上角到父容器（不是offsetParent）的border box左上角的距离。==

### **==IE6==**
> body
```javascript
offsetHeight = body.padding +内容margin box的高度。

clientHeight = scrollHeight
```
> documentElement
```javascript
offsetHeight=画布高度，但offsetHeight>= clientHeight

clientHeight = window窗口可见高度。

scrollHeight = 内容的高度
```
==因此，只是获取页面窗口的大小，在IE6中得用documentElement.clientHeight，获取整个页面内容的大小，则应该用documentElement.offsetHeight。==

> 元素
```javascript
offsetHeight = padding +border + height。

clientHeight = padding +height - scrollbar.width。

scrollHeight = padding + 内容margin box的高度
```
==从结果分析，IE6认为scrollHeight 可以小于clientHeight。==

==offsetLeft = 元素border box左上角到父容器（不是offsetParent）的border box左上角的距离。==


## 结论
-  ==IE6、IE7认为scrollHeight可以小于clientHeight==
-  ==IE8、IE9和Firefox认为scrollHeight>=clientHeight==
-  ==取窗口可见部分高度，统一用documentElement.clientHeight即可==
-  ==取页面内容的高度（如果内容高度比窗口高度小，取窗口高度)，则用documentElement.scrollHeight，只有Chrome需要使用body.scrollHeight==




同理clientWidth、offsetWidth和scrollWidth的解释与上面相同，只是把高度换成宽度即可。