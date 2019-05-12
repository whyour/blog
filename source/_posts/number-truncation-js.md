---
title: javascript 中的取整操作
date: 2019-05-12 15:31:32
tags: [javascript, Math, Truncation]
---
在 JavaScript 中，我们常常会有对数字或者数字字符串的取整需求，要么向上取整`Math.ceil(number)`，要么向下取整` Math.floor(number)`，还有一种情况就是`parseInt`，`parseInt`是当数字大于 0 时，向下取整，小于 0 时，向上取整。但是在 es6 中我们有了新的方法`Math.trunc(number)`。

<!-- more -->

### es5 和 es6 取整操作

```js
const number = 80.6
// Old Way
number < 0 ? Math.ceil(number) : Math.floor(number);
// or
const es5 = Number.parseInt(number);
// 80
// ✅ES6 Way
const es6 = Math.trunc(number);
// 80
```

现在我们来看一些特殊值的结果。

* Math.trunc

```js
Math.trunc(80.1); // 80
Math.trunc(-80.1); // -80
Math.trunc('80.1'); // 80
Math.trunc('hello'); // NaN
Math.trunc(NaN); // NaN
Math.trunc(undefined); // NaN
Math.trunc(); // NaN
```

* parseInt

```js
parseInt(80.1); // 80
parseInt(-80.1); // -80
parseInt('80.1'); // 80
parseInt('hello'); // NaN
parseInt(NaN); // NaN
parseInt(undefined); // NaN
parseInt(); // NaN
```

### parseInt 和 Math.trunc 的区别

parseInt 常常被接收一个字符串的参数，而 Math.trunc 则可以接收一个数字参数，所以如果要对数字取整，还是建议使用 Math.trunc。

### parseInt 使用中的问题

当你使用 parseInt 的时候，如果你传入的不是字符串，比如传入一个数字，parseInt 会先调用数字的 toString() 方法，大多数情况下，parseInt 是没有问题的，但是下面的情况就会出现问题：

```js
const number = 11111111111111111111111111111;
const result = parseInt(number);
console.log(result); // 1 <-- 😱
```

这是什么原因呢，因为你传的参数不是 String，所以 parseInt 会先调用 toString() 方法。

```js
const number = 11111111111111111111111111111;
const result = number.toString();
console.log(result); // "1.1111111111111112e+28"
const last = parseInt(result); // 1 <-- 😱
```

所以当我们对 `1.1111111111111112e+28` 取整时，就只能取到 1，由于这种潜在的问题，你就需要使用 Math 的方法。

### 浏览器支持情况

大多数现代浏览器都是支持的，除了 ie。
![20190512162228.png](https://i.loli.net/2019/05/12/5cd7d7c86b77c.png)

### 其他取整方法

#### 位操作符 NOT

```js
console.log(~~80.6); // 80
```

#### 位操作符 OR

```js
console.log(80.6 | 0); // 80
```

### reference

* [MDN Web Docs: Math.trunc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
* [MDN Web Docs: parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
* [MDN Web Docs: Bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
* [JS Tip: Use parseInt for strings, NOT for numbers](https://gideonpyzer.dev/blog/2017/06/06/js-tip-use-parseint-for-strings-not-for-numbers/)
* [2ality: parseInt doesn’t always correctly convert to integer](http://2ality.com/2013/01/parseint.html)
* [Number Truncation in JavaScript](https://medium.com/dailyjs/number-truncation-in-javascript-196c067b0d55)