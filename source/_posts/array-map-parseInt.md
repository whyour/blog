---
title: 为什么 ['1', '7', '11'].map(parseInt) returns [1, NaN, 3] in Javascript
date: 2019-07-17 15:18:51
tags: [parseInt, map, javascript]
---
当你在控制台敲入 `['1', '7', '11'].map(parseInt)` ，得到的答案肯定令你惊囍。首先数组的 map 方法是可以接收某些方法名的，来简单的调用这个方法处理数组中的数据，前面的代码就相当于`['1', '7', '11'].map(x => parseInt(x))`，那我们为什么会得到这样的答案呢，下面我们就分析下

### 基数(Radix)/进制

当我们从 0 到 9 计数时，每个数字（0-9）都有不同的符号。 但是，一旦到 10，我们需要两个不同的符号来表示数字。这是因为我们的小数计数系统的基数为 10。

基数是最小的数字，只能由多个符号表示。 不同的计数系统具有不同的基数，因此，相同的数字可以指计数系统中的不同数字。

| 十进制/DECIMAL | 二进制/BINARY | 十六进制/HEXADECIMAL |
|----------------|---------------|----------------------|
| RADIX=10       | RADIX=2       | RADIX=16             |
| 0              | 0             | 0                    |
| 1              | 1             | 1                    |
| 2              | 10            | 2                    |
| 3              | 11            | 3                    |
| 4              | 100           | 4                    |
| 5              | 101           | 5                    |
| 6              | 110           | 6                    |
| 7              | 111           | 7                    |
| 8              | 1000          | 8                    |
| 9              | 1001          | 9                    |
| 10             | 1010          | A                    |
| 11             | 1011          | B                    |
| 12             | 1100          | C                    |
| 13             | 1101          | D                    |
| 14             | 1110          | E                    |
| 15             | 1111          | F                    |
| 16             | 10000         | 10                   |
| 17             | 10001         | 11                   |

例如，查看上表，我们看到相同的数字 11 可以表示不同计数系统中的不同数字。 如果是二进制，则表示数字十进制 3，如果是 16 进制，则表示十进制数字 17。您可能已经注意到，在我们的示例中，当输入为 11 时，parseInt 返回 3，这对应于上表中的二进制列。

### 函数参数

Javascript 中的函数可以使用任意数量的参数调用，即使它们不等于声明的函数参数的数量。 缺少的参数被视为未定义，并且忽略额外的参数（但存储在类似数组的参数对象中）。

```js
function foo(x, y) {
    console.log(x);
    console.log(y);
}
foo(1, 2);      // logs 1, 2
foo(1);         // logs 1, undefined
foo(1, 2, 3);   // logs 1, 2
```

### map()

Map 是 Array 原型中的一个方法，它返回一个新的数组，其结果是将原始数组的每个元素传递给一个函数。 例如，以下代码将数组中的每个元素乘以 3：

```js
function multiplyBy3(x) {
    return x * 3;
}
const result = [1, 2, 3, 4, 5].map(multiplyBy3);
console.log(result);   // logs [3, 6, 9, 12, 15];
```

现在，假设我们使用 map 方法（不写返回语句的情况下）记录每个元素。 我应该能够将 console.log 作为参数传递给 map()

```js
[1, 2, 3, 4, 5].map(console.log);
```

![20190717164700.png](https://i.loli.net/2019/07/17/5d2ee08720a4536558.png)

奇怪的事情发生了，每次 console.log 都返回了整个数组

```js
[1, 2, 3, 4, 5].map(console.log);
// The above is equivalent to
[1, 2, 3, 4, 5].map(
    (val, index, array) => console.log(val, index, array)
);
// and not equivalent to
[1, 2, 3, 4, 5].map(val => console.log(val));
```

当函数传递给 map() 时，对于每次遍历，将三个参数传递给函数：当前值，当前索引和完整数组。 这就是每次遍历得到三个条目的原因。

### Solve Problem

ParseInt 有两个参数：string 和 radix，而 radix 如果不传或者是 false 的话，默认会被设为 10

```js
parseInt('11');                => 11
parseInt('11', 2);             => 3
parseInt('11', 16);            => 17
parseInt('11', undefined);     => 11 (radix is falsy)
parseInt('11', 0);             => 11 (radix is falsy)
```

现在我们会一步步运行上面例子的运行过程

```js
['1', '7', '11'].map(parseInt);       => [1, NaN, 3]

// 第一次循环: val = '1', index = 0, array = ['1', '7', '11']

parseInt('1', 0, ['1', '7', '11']);   => 1
```

因为 0 是 false，所以 radix 会被设为 10，parseInt 只接受两个参数，所以第三个参数是被忽略的，字符串 1 的十进制数字就是 1

```js
// 第二次循环: val = '7', index = 1, array = ['1', '7', '11']

parseInt('7', 1, ['1', '7', '11']);   => NaN
```
在进制为 1 的系统中，7 是不存在的，所以 parseInt 就返回 NaN

```js
// 第三次循环: val = '11', index = 2, array = ['1', '7', '11']

parseInt('11', 2, ['1', '7', '11']);   => 3
```
在二进制中，11 就是 3，所以 parseInt 就返回 3

![20190717170359.png](https://i.loli.net/2019/07/17/5d2ee4b40a29036593.png)

### 总结

`['1', '7', '11'].map(parseInt)`没有按预期的执行时因为 map 在每次循环的时候传了三个参数给 parseInt，而第二个参数被 parseInt 用在的 radix 的参数上，所有每个字符串都被解析成了不同进制的值，那如何符合我们的预期呢

```js
['1', '7', '11'].map(numStr => parseInt(numStr));
```

![20190717170816.png](https://i.loli.net/2019/07/17/5d2ee5845434e89065.png)

### reference

[parseint-mystery](https://medium.com/dailyjs/parseint-mystery-7c4368ef7b21)