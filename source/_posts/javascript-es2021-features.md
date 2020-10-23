---
title: JavaScript ES2020 已经到来
date: 2020-10-21 19:38:20
tags: [javascript, es2020]
---

在ES6(也被称为ECMAScript 2015)推出之前，JavaScript的开发速度一直比较慢。而如今的2020年，最新的JavaScript特性已经定稿并发布为ECMAScript 2020(或ES2020)。虽然ES2020不像ES6中引入的那么多特性，但它引入了许多有用的附加功能。在本文中，我将讨论我最喜欢的ES2020新特性。

<!-- more -->

### 可选链操作符

可选链操作符允许您访问深度嵌套的对象，而不必担心属性是否存在。当你使用对象时，你肯定很熟悉下面的错误:

```js
TypeError: Cannot read property <xyz> of undefined
```

上述错误意味着您试图访问一个未定义变量的属性。为了避免这样的错误，您的代码可能是这样的:

![20201023172059](https://image.whyour.cn/others/20201023172059.png)

可选链操作符可以轻松地处理这些情况，而不是检查每个节点。下面是同一个使用可选链操作符的例子:

![20201023172217](https://image.whyour.cn/others/20201023172217.png)

您还可以使用可选链操作符来检查数组和函数。下面给出一个例子:

![20201023172342](https://image.whyour.cn/others/20201023172342.png)

### globalThis

JavaScript可以用于各种环境，如web浏览器、Node.js、Web Workers等等。每个环境都有自己的对象模型和访问它的不同语法。ES2020给我们带来了globalThis属性，它总是引用全局对象，无论你在哪里执行你的代码。当您不确定代码运行在什么环境中时，这个属性将会真正发挥作用。

下面是Node.js在setTimeout函数中使用globalThis的例子:

![20201023173110](https://image.whyour.cn/others/20201023173110.png)

下面是同样的方法在web浏览器中的例子:

![20201023173156](https://image.whyour.cn/others/20201023173156.png)

### 动态引入

动态导入是我最喜欢的ES2020特性之一。顾名思义，您可以动态导入模块。使用动态导入，代码将根据需要通过较小的包交付(而不是像以前那样需要下载单个大的包)。

在使用动态导入时，可以将导入关键字作为函数调用，从而返回一个Promise。下面是一个例子，当用户点击一个按钮如何动态导入模块时:

![20201023175208](https://image.whyour.cn/others/20201023175208.png)

### 空值合并操作符

此操作符的语法为

```js
let student = {}
let name = student.name ?? 'John'
```

当左侧操作数未定义或为空时，此操作将返回右侧操作数。在上面的示例中，因为student.name未定义，操作符会将name的值设置为 'John'。

乍一看，这与逻辑或操作符(||)完全相同，但是，当逻辑或操作符的左侧操作数为false(未定义，null， ""， 0, false, NaN)时，逻辑或操作符的右侧操作数为false。下面是两种运算符的比较:

![20201023175816](https://image.whyour.cn/others/20201023175816.png)

### 空值合并操作符(??)与逻辑与(&&)逻辑或(||)操作符一起使用

不能直接使用空值合并操作符(??)与逻辑与(&&)逻辑或(||)操作符一起使用。如果你需要组合使用，则必须使用括号把&&或||操作符括起来

![20201023180457](https://image.whyour.cn/others/20201023180457.png)

### BigInt

BigInt是JavaScript中一个新的数字原语，它允许我们安全地存储和操作大整数，甚至超出了数字的安全整数限制。这为数学运算提供了无数新的机会。这些变量现在可以表示numbers²⁵³，而不仅仅最大是9007199254740992。

![20201023181347](https://image.whyour.cn/others/20201023181347.png)

要创建BigInt，给任何整数添加'n'后缀。例如，10变成10n。要将任意数字转换为BigInt，可以使用全局函数BigInt(number)。

![20201023181549](https://image.whyour.cn/others/20201023181549.png)

### Promise.allSettled()

此方法返回一个Promise，该Promise会在所有给定的Promise都返回的时候才会返回。它通常用于不依赖于其他任务的异步任务成功完成的情况，如下面的例子所示:

![20201023181842](https://image.whyour.cn/others/20201023181842.png)

[阅读更多关于JavaScript Promise方法的内容](https://medium.com/@taranpreet_94321/javascript-promise-comparison-c0bfedaf1f1)

### 总结

ES2020新特性的引入为不断发展的JavaScript增加了更多的灵活性和功能。这篇文章探讨了我最喜欢的一些特性，但我建议您研究其他一些特性，看看哪些最适合您。我希望这篇文章对您有用，并且希望您像我一样对使用这些特性感到兴奋!

### 在2021即将到来的功能 - ES12

[JavaScript ES2021 (ES12)令人兴奋的特性](https://medium.com/@taranpreet_94321/exciting-features-of-javascript-es2021-es12-1de8adf6550b)