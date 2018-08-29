---
title: javascript中的es6与简写技巧
date: 2018-08-23 15:18:27
tags: [javascript, es6]
---

那些更简洁，更优雅的代码

### 三目运算符

下面是一个很好的例子，将一个完整的 if 语句，简写为一行代码。

```typescript
const a = 20;
let result;
if (a > 10) {
    result = 'greater than 10';
}
else {
    result = 'less than 10';
}
```

简写为：

> const result = a > 10 ? 'greater than 10' : 'less than 10';

### 循环语句

当使用纯 JavaScript（不依赖外部库，如 jQuery 或 lodash）时，下面的简写会非常有用。

> for (let i = 0; i < list.length; i++)

简写为：

> for (let index of list)

### 声明变量

在函数开始之前，对变量进行赋值是一种很好的习惯。在申明多个变量时：

`let x;let y;let z = 3;`

可以简写为：

> let x, y, z=3;

### if 语句

在使用 if 进行基本判断时，可以省略赋值运算符。

> `if (likeJavaScript === true)`

简写为：

> `if (likeJavaScript)`

### 十进制数

可以使用科学计数法来代替较大的数据，如可以将 10000000 简写为 1e7。

> `for (let i = 0; i < 10000; i++) { }`

简写为：

> `for (let i = 0; i < 1e7; i++) { }`

### 多行字符串

如果需要在代码中编写多行字符串，就像下面这样：

```javascript
let html = '<li class="comment-item" data-id="' + post.id + '" data-name="'+ post.name + '" id="comment-' + post.id + '">' +
            '<div class="comment-item-body">'+
            '<a class="comment-item-avatar" href="#comment-'+post.id+'"><img src="' + post.avatar + '"></a>'+
            '<div class="comment-item-main">'+
            '<div class="comment-item-header"><a class="comment-item-name" title="' + post.name + '" rel="nofollow" target="_blank" href="' + ( post.url ? post.url : 'javascript:;' ) + '">' + post.name + '</a>'+ (post.isMod ?'<span class="comment-item-badge">'+_.opts.badge+'</span>' :'')+parentPost.name+'<span class="comment-item-bullet"> • </span><time class="comment-item-time" datetime="' + post.createdAt + '"></time></div>'+
            '<div class="comment-item-content">' + post.message + mediaHTML + '</div>'+
            '<div class="comment-item-footer">' + (!!post.isPost ? '<span class="comment-item-manage"><a class="comment-item-edit" href="javascript:;">编辑</a><span class="comment-item-bullet"> • </span><a class="comment-item-delete" href="javascript:;">删除</a><span class="comment-item-bullet"> • </span></span>' : '') + '<a class="comment-item-reply" href="javascript:;">回复</a> </div>'+
            '</div></div>'+
            '<ul class="comment-item-children"></ul>'+
            '</li>';
```

但是还有一个更简单的方法，反引号：

```javascript
`
<li class="discovery-post">
    <a class="publisher-anchor-color" href="" target="" rel="">
        <header class="discovery-post-header">
            <h3 title="${item.title}">
                <span data-role="discovery-thread-title" class="title line-truncate" data-line-truncate="2">${item.title}</span>
            </h3>
            <ul class="meta">
                <li class="comments">${item.posts}条评论 </li>
                <li class="time">
                    <time class="comment-item-time" datetime="${item.createdAt}"></time>
                </li>
            </ul>
        </header>
        <a class="top-comment" data-role="discovery-top-comment" href="" target="" rel="">
            <img alt="头像" data-role="discovery-avatar" src="${item.author.avatar.cache}">
            <p>
                <span class="user" data-role="discovery-top-comment-author">${item.author.name}</span>
                —
                <span data-role="discovery-top-comment-snippet" class="line-truncate" data-line-truncate="3">
                    ${item.message}
                </span>
            </p>
        </a> 
    </a>
</li>
`
```

### 变量赋值

当将一个变量的值赋给另一个变量时，首先需要确保原值不是 null、未定义的或空值。

可以通过编写一个包含多个条件的判断语句来实现：

```javascript
if (v1 !== null || v1 !== undefined || v1 !== '') {
    let v2 = v1;
}
```

或者简写为以下的形式：

> `const v2 = v1 || 'other';`

### 默认值赋值

如果预期参数是 null 或未定义，则不需要写六行代码来分配默认值。我们可以只使用一个简短的逻辑运算符，只用一行代码就能完成相同的操作，同变量赋值。

简写为：
> `const dbHost = process.env.HOST || 'localhost';`

### 对象属性

ES6 提供了一个很简单的办法，来分配属性的对象。如果属性名与 key 名相同，则可以使用简写。

> `const obj = { x:x, y:y };`

简写为：

> `const obj = { x, y };`

### 箭头函数

经典函数很容易读写，但是如果把它们嵌套在其它函数中进行调用时，整个函数就会变得有些冗长和混乱。这时候可以使用箭头函数来简写：

```javascript
setTimeOut(function() {
    console.log('yes');
}, 0);
```

简写为：

```javascript
setTimeOut(() => console.log('yes'), 0);
```

### 隐式返回值

返回值是我们通常用来返回函数最终结果的关键字。只有一个语句的箭头函数，可以隐式返回结果（函数必须省略括号（{ }），以便省略返回关键字）。

要返回多行语句（例如对象文本），需要使用（）而不是{ }来包裹函数体。这样可以确保代码以单个语句的形式进行求值。

```javascript
function square(a){
    return a*a;
}
```

简写为：

```javascript
square = a => a*a;
```

### 默认参数值

可以使用 if 语句来定义函数参数的默认值。ES6 中规定了可以在函数声明中定义默认值。

```javascript
function volume(l, w ,h) {
    if (w === undefined) {
        w = 1;
    }
    if (h === undefined) {
        h = 2;
    }
    return l * w * h;
}
```

简写为：

```javascript
volume = (l, w = 1, h = 2) => l * w * h;
```

### 解构赋值

#### 交换变量的值

```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

#### 函数返回多个值

```javascript
// 返回一个数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

#### 函数参数的定义

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

#### 提取json数据

```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

#### 函数参数的默认值

```javascript
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

#### 遍历 Map 结构

```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```

#### 加载模块指定方法

```javascript
const { Store, Action } = require("ngx-tethys");
```

#### 展开运算符

展开运算符是在 ES6 中引入的，使用展开运算符能够让 JavaScript 代码更加有效和有趣。

使用展开运算符可以替换某些数组函数。

```javascript
const odd = [1, 3, 5];
const even = [2, 4, 6];
const arr = odd.concat(even);
```

简写为：

```javascript
const odd = [1, 3, 5];
const arr = [2, 4, 6, ...odd];
```

和 concat( ) 功能不同的是，用户可以使用扩展运算符在任何一个数组中插入另一个数组。

```javascript
const odd = [1, 3, 5 ];

const nums = [2, ...odd, 4 , 6];

也可以将展开运算符和 ES6 解构符号结合使用：

const { a, b, ...z } = { a: 1, b: 2, c: 3, d: 4 };

console.log(a) // 1

console.log(b) // 2

console.log(z) // { c: 3, d: 4 }
```

### Array.find

如果你曾经编写过普通 JavaScript 中的 find 函数，那么你可能使用了 for 循环。在 ES6 中，介绍了一种名为 find（）的新数组函数，可以实现 for 循环的简写。

```javascript
const pets = [
    {type: 'dog', name: 'killer'},
    {type: 'cat', name: 'hiller'},
    {type: 'pig', name: 'miller'}
]
function findDog(name) {
    for (let i in pets) {
        if (pets[i].type === 'dog' && pets[i].name === name) {
            return pets[i];
        }
    }
}
```

简写为：

```javascript
const pet = pets.find(pet => pet.type === 'dog' && pet.name === 'Tom');
```

### Object [key]

虽然将 foo.bar 写成 foo ['bar'] 是一种常见的做法，但是这种做法构成了编写可重用代码的基础。

> key可接受一个变量;

### 双位操作符

位操作符是 JavaScript 初级教程的基本知识点，但是我们却不常使用位操作符。因为在不处理二进制的情况下，没有人愿意使用 1 和 0。

但是双位操作符却有一个很实用的案例。你可以使用双位操作符来替代 Math.floor( )。双否定位操作符的优势在于它执行相同的操作运行速度更快。

> `Math.floor(4.9) === 4 //true`

简写为：

> `~~4.9 === 4 //true`

### **总结**

上述是一些常用的 JavaScript 简写技巧，如果有其它未提及的简写技巧，也欢迎大家补充。