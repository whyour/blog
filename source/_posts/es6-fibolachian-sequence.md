---
title: 用ES6实现斐波那契数列
date: 2019-01-17 23:26:00
tags: [ES6, Fibonacci]
---
某一天，旁边的同事问我，知道斐波什么数吗。我说，不知道。同事又说，这不是面试必问的吗。我尴尬又不失优雅的一笑🤓🤓🤓。

### 什么是斐波那契数列？

首先它是一个数列，在数学上是以递归的方法定义
- $F_{0}=0$
- $F_{1}=1$
- $F_{n}=F_{n-1}+F_{n-2}  (n≧2)$

简单来说，就是第一个和第二个数字是0和1，后面的数字都是前两个数字的和。

现在我们的问题是求第二十个斐波那契数或者求最接近某个数的斐波那契数。

### es5实现

其实只需要构造一个递归的函数即可

```js
// 第一种
function fibonacci(n) {
  if (n===0 || n===1) {
    return n;
  }
  return fibonacci(n-1) + fibonacci(n-2);
}
fibonacci(50);

// 第二种
function fibonacci(n) {
  var cache = [0, 1];
  return function _fibolachian(n) {
    return typeof cache[n] === 'number'
      ? cache[n]
      : cache[n] = _fibolachian(n - 1) + _fibolachian(n - 2);
  };
}
fibonacci(50);
```
第一种粗暴解决，但是速度令人堪忧。第二种利用缓存，极大优化处理时间。这种方法每次只能返回一个数据，都无法优雅地解决我们的问题。

### es6实现

```js
function* fib_generator() {
  let [current, next] = [0, 1];
  while(true) {
    yield current;
    [next, current] = [next+current, next];
  }
}

let fib = fib_generator();

// 获取前20个斐波那契数
for(let i = 0; i < 20; i++) {
  console.log(fib.next().value);
}
// 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181

// 获取斐波那契数小于10000的所有数
for (const n of fib_generator()) {
  if (n > 5000) {
    break;
  }
  console.log(n);
}

// 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181
```
es6实现中主要使用了`generator function`、`yield`、`数组结构`等特性。
> `generator function`是就是ES6中的生成器函数，写起来很简单，只要在`function`后面加上一个`*`号即可：

```js
function* foo1() { };
function *foo2() { };
function * foo3() { };
```
调用生成器函数会产生一个生成器（generator）。生成器拥有的最重要的方法是 next()，用来迭代：
```js
function* foo() { };
let bar = foo();
bar.next(); // Object {value: undefined, done: true}
```
next 方法返回一个拥有 value 和 done 两个字段的对象。

生成器函数通常和 yield 关键字同时使用。函数执行到每个 yield 时都会中断并返回 yield 的值（通过 next 方法返回对象中的 value 字段）。下次调用 next，函数会从 yield 的下一个语句继续执行。等到整个函数执行完，next 方法返回的 done 字段会变成 true。

所以通过`fib.next().value`就会循环得到前20个斐波那契数。

如果一直调用next()方法也太费劲了，这就要说明生成器函数也是可遍历的，它是一个可迭代对象，一个定义了迭代行为的对象，比如在 for...of 中循环了哪些值。一些内置类型，如 Array 或 Map 具有默认的迭代行为，而其他类型（如Object）没有。所以只要使用for循环就可以了，遍历得到的值就是`yield`返回的值，用生成器函数来产生斐波那契数列既高效又直观。

除此之外，生成器还有一个return方法：

```js
function* gen() { 
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.return('foo')); // { value: "foo", done: true }
console.log(g.next()); // { value: undefined, done: true }
```

可以得知return方法会返回指定的值并结束生成器。而当生成器函数已经结束的时候，再去调用return方法，则也会返回给定值，并且结束生成器。

```js
function* gen() {yield 1;}
var g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next()); // { value: undefined, done: true }
console.log(g.return(1)); // { value: 1, done: true }
```