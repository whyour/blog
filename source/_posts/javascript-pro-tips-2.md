---
title: javascript 中的 es6 技巧 2
date: 2019-02-18 11:30:45
tags: [js]
---

### 获取某年某月有多少天
此处借用 Date api 创建时间的时候超出的时间会自动顺延到下个月。比如`new Date(2019, 0, 32)`就会自动顺延到 2019 年 2 月 1 日，这样就可以直接用 32 减去 1 就可以得出 1 月份的天数，当然 32 只是一个最小数，你也可以用 33、34...
那如果说往大取可以，往小取是不是也可以，答案是肯定的。比如`new Date(2019, 0, 0)`就会取到 2018 年的 12 月 31 日，这样我们就可以直接取到上个月的总天数，要取指定月的天数，只需给指定月数 month + 1 即可。

```js
// 下面这两个函数是等效的

function getDateOfMonth(year, month) {
  const date = new Date(year, month, 32).getDate();
  return 32 - date;
}

function getDateOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// 求闰年的 2 月份天数
// 29
getDateOfMonth(2000, 1);

// 求非闰年的 2 月份天数
// 28
getDateOfMonth(2001, 1);

// 求大月的天数
// 31
getDateOfMonth(2001, 0);

// 求小月的天数
// 30
getDateOfMonth(2001, 3);
```

### 对一个数取幂

这时候我们可以使用 `Math.pow()`，但是我们更推荐使用取幂运算符 `**`

```js
// bad
const binary = Math.pow(2, 10);

// good
const binary = 2 ** 10;
```

### 对象结构用在数组上

#### 获取数组的长度

```js
const {0: a, 1: b, length: l} = ['a', 'b', 'c'];

a === 'a';
b === 'b';
l === 3;
```

#### 还可以获取数组最后一个元素

```js
const {length: l, [l-1]: last, ...rest} = [1, 2, 3];

l === 3;
last === 3;
rest // {0: 1, 1: 2}
```
不只是 length，数组的其他方法，比如 join、push 等方法也是可以解构

```js
let {map: m, push: p} = []
m === Array.prototype.map // true
m === [].__proto__.map // true
p === Array.prototype.push // true
p === [].__proto__.push // true
```

通过 Array 的原型链也可以解析 Object.prototype 上的属性

```js
Array.prototype.__proto__.hasOwnProperty === Object.prototype.hasOwnProperty // true
let {hasOwnProperty: hop} = []
hop === Object.prototype.hasOwnProperty // true
```

这样就可以看出，解构操作会沿着当前对象及其原型链一直向上找，直到 `Object.prototype.__proto__` 对象，如果被解构的对象及其原型链上不存在该属性，则返回 `undefined`。

#### 将数组转为对象

```js
const { ...obj } = [1, 2, 3];
obj // => {0: 1, 1: 2, 2: 3}
```