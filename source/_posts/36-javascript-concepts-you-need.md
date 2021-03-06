---
title: 要成为JavaScript专家，你需要掌握36个概念
date: 2020-07-22 22:24:40
tags: [javascript]
---
你会听到许多人抱怨JavaScript很奇怪，有时甚至毫无价值。人们这样抱怨是因为他们不了解事情的本质。虽然我同意JavaScript中有些场景的处理方式不同，但这并不会使它变得奇怪，而是以它自己的方式变得很漂亮。

要开始热爱一门编程语言，你应该从深入了解并逐个掌握它的概念开始。

为了成为一个全面的JavaScript专家，下面有36个你需要掌握的JavaScript概念。

虽然这是我最长的文章之一，但是我向你保证它是值得你去花时间看的。在此感谢Stephen和Leonardo提供的资源。

参考资料在Leonardo的一个[GitHub](https://github.com/leonardomso/33-js-concepts)仓储中，其中包含了下面解释的所有这些概念的学习材料。请花点时间理解下面提到的每一个概念。

## 1. 调用栈执行

每个人都听说过[Stack Overflow](https://stackoverflow.com/)这个网站。但是你知道实际的堆栈溢出吗?堆栈溢出是与调用堆栈的操作相关联的错误。

通过理解堆栈调用，你将了解像JavaScript这样的高级语言是如何执行的。

## 2. 原始数据类型

```js
const foo = "bar";
foo.length; // 3
foo === "bar"; // true
```

等等！

当你把字符串bar赋值给常量foo时，foo是基本字符串类型。这是每个人都可以接受的。但是为什么可以访问字符串类型的length属性呢？

是不是很奇怪。

这个特性称为自动装箱。在上面的示例中，JavaScript将常量包装到一个临时包装器对象中，然后访问该对象的length属性。一旦这一步完成，对象将被安全地丢弃。

通过深入了解基本数据类型，你将知道它们在二进制表示之前是如何在内存中存储的。你也会知道这些“奇怪”的情况是如何发生的，以及它们背后的逻辑原因。

## 3.值类型和引用类型

最近，我对“通过引用传递”的概念在JavaScript中的工作方式有些困惑。虽然我知道C和Java等语言中“按引用传递”和“按值传递”的概念，但我不确定它在JavaScript中是如何工作的。

你知道在JavaScript中，给一个变量赋一个非基本类型的值，实际上是赋了一个该值的引用吗?引用指向了存储值的内存位置。

```js
var arr1 = [1,2,3];
var arr2 = arr1;
arr2.push(10);
console.log(arr2);
//[1, 2, 3, 10]
console.log(arr1);
//[1, 2, 3, 10]
```

正如你从上面的示例中看到的，对arr2所做的任何修改也将反映在arr1上。这是因为它们只持有对值的引用，而不是实际值本身。

通过理解值类型和引用类型的概念，你将更好地理解变量是如何分配值和内存引用的。

## 4. 强制类型转换

这一概念主要解释了隐式和显式强制类型转换的区别。这是在用JavaScript时会出错的少数领域之一。对于隐式类型转换的概念尤其如此，因为对于不同的数据类型，它的行为方式不同。

这是JavaScript面试中最常被面到的内容之一。

```js
Number('789')   // 显式转换
+'789'          // 隐式转换
789 != '456'    // 隐式转换
9 > '5'         // 隐式转换
10/null          // 隐式转换
true | 0        // 隐式转换
```

通过清楚地理解类型转换，那你已经了解了JavaScript最棘手的概念之一。

## 5. 相等比较和' typeof '操作符

这个概念基本上解释了双等号和三等号的使用，以及在何时为什么使用它们。尽管在表面上看它们是相同的，并且在大多数时候会得出相同的结果，但是如果你在不知情的情况下使用它们，它们可能会给你带来意想不到的错误。

你还应该能够使用typeof操作符并知道输出的可能性。但是当有对象时，它会让人感到困惑。

```js
typeof 3 // "number"
typeof "abc" // "string"
typeof {} // "object"
typeof true // "boolean"
typeof undefined // "undefined"
typeof function(){} // "function"
typeof [] // "object"
typeof null // "object"
```

## 6. JavaScript作用域

作用域是一个概念，我相信，它在你JS旅程的开始阶段你就应该了解他。根据Wissam的说法，作用域的简单定义是，当编译器需要变量和函数时，它就是查找这个变量和函数的地方。

理解作用域将允许你更有效地使用JavaScript。你应该了解全局作用域、块和函数作用域，也称为词法作用域。JS作用域一开始可能会让人很困惑，但是一旦你理解了它是如何工作的，使用它会非常令人兴奋。

## 7. 语句和表达式

这是JavaScript中的两个主要语法类别。你应该知道这两者之间的区别以及语句是如何计算的。这将允许你全面了解代码是如何被构造成表达式和语句的。你会注意到，你的大部分代码都是表达式，而相对而言，你使用的语句数量较少。你还可以避免由于不正确使用这两种方法而导致的错误。

## 8. 立即调用函数表达式和模块

立即调用的函数表达式是定义后立即运行的函数。它们主要用于避免污染全局作用域。后来，ES6模块被引入，提供了一种避免全局作用域污染的标准方法，尽管有些人认为它不是IIFEs的直接替代品。

通过理解IIFEs和模块，你在开发应用程序中，可以遇到更少的由于全局作用域处理不当而导致的错误。然而，使用模块，你可以做很多事情。

## 9. 消息队列和事件循环

正如[MDN文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#:~:text=JavaScript%20has%20a%20concurrency%20model,languages%20like%20C%20and%20Java)所说，JavaScript有一个基于事件循环的并发模型，它负责执行代码、收集和处理事件以及执行排队的子任务。这个模型与其他语言(如C和Java)中的模型有很大的不同。

在上述并发模型中，消息队列用于处理从最老的消息开始的消息。只要事件发生，并且有一个事件监听器监听它，消息就会被添加到队列中。

通过理解这些概念，你可以更好地理解JS在底层是如何工作的，以及如何解释你的代码。

## 10. 时间间隔

要在JavaScript中调度一个调用或函数，可以使用两种方法。

* setTimeout允许我们在特定的时间间隔后运行函数一次。
* setInterval允许我们重复运行一个函数，在特定的时间间隔后开始运行，然后在该时间间隔内连续重复运行。

这些与前面的消息队列和事件处理程序的概念有些关联。因此，通过理解时间间隔方法，我们可以理解它们是如何工作的，并在我们的用例中有效地使用它们。

## 11. JavaScript引擎

我们现在正在深入研究JavaScript。JavaScript引擎是执行JavaScript代码的计算机程序或解释器。JavaScript引擎可以用多种语言编写。例如，驱动Chrome浏览器的V8引擎是用c++编写的，而驱动Firefox浏览器的SpiderMonkey引擎是用C和c++编写的。

对于你来说，了解你正在使用的是哪个JavaScript引擎来编写高效代码是非常重要的。使用webview的移动开发者应该特别注意这一点。

## 12. 位操作

这些操作将值视为位(0和1)，而不是小数、十六进制或八进制数。位操作符在这种二进制表示上执行操作，但是它们返回标准的JavaScript数值。

通常，你不会在代码中使用这些操作，但它们确实有一些用例。可以使用它们查找偶数和奇数值、颜色转换、颜色提取和配置标志。

通过彻底了解这些位操作，你可以很好地使用WebGL等技术，因为它包含许多像素操作。

## 13. DOM和布局树

大多数人都听说过文档对象模型(DOM)，但只有少数人深入了解它。你知道在浏览器中看到的不是DOM吗?而是渲染树，它实际上是DOM和CSSOM的组合。

通过理解DOM的工作原理、结构以及页面的呈现方式，我们就能够在JavaScript的帮助下动态地操作web页面。这对于确保我们的应用程序具有高标准的性能尤为必要。

## 14. 类和工厂

JavaScript不是面向对象的语言。但是，为了模拟OOP属性，使用了构造函数。根据Tania的说法，“JavaScript中的类实际上并不提供额外的功能，通常被描述为在原型和继承之上提供语法糖，因为它们提供了更干净、更优雅的语法。其他编程语言都使用类，所以JavaScript中的类语法使得开发人员在不同语言之间的转换更加简单。”

工厂函数是一个不是类或构造函数但是返回对象的函数。JS大师Eric Elliot说:“在JavaScript中，任何函数都可以返回一个新对象。当它不是构造函数或类时，就称为工厂函数。”

你应该对这两个概念有很好的理解，特别是当你开始开发规模较大的应用程序时。

## 15. "this"关键词和，'apply'、'call'和'bind'方法

我个人认为，对于一个JS开发人员来说，理解this关键词是至关重要的。如果你不能正确地理解它，稍后你的应用程序将会遇到各种问题。

如果你对`this`关键字有很好的理解，那么你可以关注`apply`、`call`和`bind`方法。这些方法是调用具有适当上下文的函数所必需的。在传递访问这个的回调时，你将特别需要`bind`方法。我是在帮助一个朋友调试他的代码时学到这一点的!

## 16. 构造函数和'instanceOf'操作符

构造函数就像常规函数一样。但是他们有很多不同之处。按照惯例，函数名以一个大写字母开头，并且只能用new操作符执行。具有OOP背景的程序员应该熟悉这个新关键字。

要正确识别对象的类型，我们使用instanceOf操作符。简单地说，它检查一个对象是否是另一个对象的实例。

这将帮助你理解对象如何相互继承。继承是通过原型实现的。

## 17. 原型

这是JavaScript中最令人困惑的概念之一，即使对于有十年经验的人来说也是如此。

JavaScript中的原型是在对象之间共享公共功能的机制。JavaScript中几乎所有的对象都是Object的实例。一个典型的对象继承了`Object.prototype`中的所有属性和方法。

简单地说，原型就是JavaScript对象从其继承方法和属性的对象。

通过更好地理解原型，你可以构建高效、快速的应用程序。

## 18. 用'new'、'Object.create'、'Object.assign'创建对象

用JavaScript创建对象有很多方法。但是有些人选择`Object.create`而不是使用`new`关键词是有原因的。当用`Object.create`创建时，你可以使用现有对象作为新创建对象的原型。这将允许重用现有对象的属性和函数，有点像OOP中的继承概念。

当你使用`Object.assign`方法，则可以将可枚举的自有属性从一个或多个源对象复制到目标对象。在这种情况下，目标对象的原型不包含源对
象的属性。这是这两种方法的主要区别。

通过理解这三种创建对象的方法，你可以根据用例在应用程序中适当地使用它们来创建内存效率高的程序。

## 19. 'map', 'filter', 和'reduce'方法

当涉及到数组操作时，这三种方法非常有用。它们可以在数组的原型中找到。

如果你有一个数组，你想对每个元素做点什么，那么你可以使用`map`方法。

如果你有一个数组，并且希望在每个元素上运行一个条件，并获取传递该条件的值，则可以使用`filter`方法。

`reduce`方法对数组的所有元素执行一个reducer函数，最后返回一个值。一个完美的例子是获取数组中所有元素的总和。

```js
let numbers = [1,2,3,4,5,6]
const reduced = numbers.reduce((accumulator, currentValue) => accumulator + currentValue)
console.log(reduced)
// 21
```

注意，以上三个方法不会改变原始数组的值。

## 20.纯函数、副作用和状态变化

这三个概念对于JavaScript开发人员非常重要。状态变化对于使用React的开发人员尤其重要。

纯函数总是返回与提供的输入一致的值，而不访问或者改变其作用域以外的任何变量。这种类型的函数更容易阅读、调试和测试。

副作用是一段代码，在不需要的情况下，一个变量被创建并在整个范围内可用。如果你的函数访问作用域之外的变量，那么就会有一个副作用。

状态变化是指改变变量的值。如果你改变一个变量，根据它改变之前的值，它可能会影响其他函数。在react环境中，建议你不要改变你的状态。这里有一个关于不变性很好的[文章](https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/)。

## 21. 闭包

闭包很难理解。但是一旦理解了，你就会开始看到JavaScript的美了。网上有丰富的资源。只要确保你花时间学习闭包。

闭包允许你在内部作用域中访问外部函数的作用域。每次创建函数时，都会创建JavaScript闭包。

了解应该使用闭包的原因，以便更深入地理解它们。

## 22. 高阶函数

高阶函数是以其他函数作为参数或返回函数的函数。高阶函数让合成释放出最大的能量。你可以创建只处理一个任务的较小函数，然后在这些较小函数的帮助下构造复杂函数。这也会增加代码的可重用性。

这也减少了错误，使我们的代码更容易阅读和理解。

## 23. 递归

递归是所有编程语言中的一个常见概念。简单地说，递归就是把大问题分解成小问题的概念。

实际上，这通常意味着编写一个调用自身的函数。尽管递归可能是一个让你头疼的令人困惑的概念，但是通过大量的练习，从一些小问题开始，你可以更好地理解它。

但是要注意，如果不小心使用递归，可能会遇到堆栈溢出错误。作为练习，对这个错误做一些研究。你需要修改关于第一个主题的知识，调用堆栈，以完全理解这个错误的上下文。

## 24. 集合和生成器函数

集合和生成器函数是ES6中新引入的。新引入的集合是`Map`、`Set`、`WeakSet`和`WeakMap`。这些集合为你提供了一些非常好的用例。你必须了解它们的用法，特别是使用现代JavaScript时。

另一方面，生成器函数有时理解起来有点棘手，特别是对于初学者来说。生成器允许你编写代码函数，使你能够暂停和重新启动函数，而不会阻塞其他代码的执行，这在JavaScript中是非常少见的。

## 25. Promises

杰奎琳这样解释`Promises`: “想象你是一个孩子。你妈妈答应你，她下星期会给你买一部新手机。”

你要到下周才能知道你是否能拿到那部手机。你的妈妈要么真的给你买了一部全新的手机，要么因为不开心而不买。

这就是一个`Promise`。`Promise`有三种状态。它们是:

1. Pending: 你不知道你是否会得到那个电话。
2. Fulfilled: 妈妈很高兴，她给你买了一个全新的手机。
3. Rejected: 妈妈不高兴，她不给你买手机。

到目前为止，这是我对`Promise`的最简单、最清楚的解释。老实说，我是在做演示项目时学到`Promise`的概念的。这让我很难理解发生了什么，因为我不知道`Promise`是什么。快进到现在。由于网络上丰富的资源，我对`Promise`有了更好的理解。结合我对项目的工作知识，我能够有一个清晰的理解。

## 26. 异步编程

要理解什么是异步编程，我们首先应该刷新同步编程的知识。同步编程是线程阻塞的，由于JavaScript是单线程的，所以代码将逐行执行。

但是使用异步代码，你可以在不阻塞主线程的情况下执行长时间的网络请求。当你必须执行多个需要很长时间才能完成的任务时，这一点特别有用。但是在某些情况下，你可能需要阻塞线程，即使是对于一个很长的任务。此时你将使用`async/await`的概念。

好好学习这些概念将允许你编写高效执行的程序，即使有很多运行的任务。

## 27. ES6箭头函数

箭头函数是ES6的一个附加功能，在语法上替代了常规函数。不同的是，箭头函数不绑定到`this`、`arguments`、`super`或`new.target`关键词。这使得箭头在某些情况下是一个很好的选择，但在另一些情况下则是一个很糟糕的选择。

因此，永远不要养成使用箭头函数的习惯。根据你的用例实现它们。

## 28. 数据结构

无论使用哪种编程语言，数据结构都是开发人员应该具备的基本知识之一。

> “糟糕的程序员担心代码。好的程序员担心数据结构和它们之间的关系。”
> linus Torvalds, Linux和Git的创建者

通过深入了解不同的数据结构，你可以构建在不同环境下运行良好的高效程序。你应该了解链表、队列、堆栈、树、图和哈希表。

## 29. 时间复杂度

时间复杂度分析也是计算机编程的另一个基本原理，与编程语言无关。要构建更好的应用程序，你应该编写更好的解决方案。为了做到这一点，你应该理解时间复杂度的概念。它有时被称为大O。

大O符号描述了算法所需的执行时间或使用的空间。大O符号专门描述了最坏的情况。

这将允许你选择并实现性能最好的算法，即使在最坏的情况下也是如此。

## 30.算法

这是你将在计算机科学课程中首先学到的东西之一。简而言之，算法就是一个逐步实现目标的过程。程序员应该能够从算法的角度来看待任何问题。他们应该能够逐步构建问题和解决方案。这个算法就是你以后要写的程序。

尽管有成千上万个用例的算法，其中两个用例是相当常见的:

* 搜索
* 排序

这两个用例对程序员来说是非常常见的，你至少应该全面了解可供他们使用的已知算法。没有固定的规则规定你应该使用这些算法之一，但是这些算法在性能方面是众所周知的，并且有很好的文档证明。

你甚至可以创建自己的算法，并将其介绍给世界。如果它比目前已知的算法更好，你可能会成为下一个编程明星!

## 31. 继承、多态和代码重用

JavaScript中的继承与原型一起工作。这是因为JavaScript是非面向对象的语言。然而，JavaScript通过提供原型继承来提供OOP的一些特性。

另一方面，多态是对象、变量或函数可以采用多种形式的概念。在JavaScript中，要看到多态性的效果有点困难，因为在静态类型的系统中，更典型的多态性类型更为明显。

以上两个概念都可以帮助我们在JavaScript中实现代码重用。对以上两个概念有扎实的理解，特别是对JavaScript的理解，将允许你编写高质量和实用的代码。

## 32. 设计模式

在软件工程中，设计模式是对常见问题的一个众所周知的、可重复的解决方案。有几种设计模式，每一种都有自己的用例。23 `Gang of Four`(GoF)模式通常被认为是所有其他模式的基础。要了解它们是相当困难的，但是你至少可以尝试理解它们的用例。

下面是[Felipe](Felipe)的一份很棒的[仓储](https://github.com/fbeline/Design-Patterns-JS)，它用JavaScript实现了23种GoF模式。请浏览本文末尾提到的参考资料，熟悉[Leonardo](Leonardo)的一些很棒的资源，他是本文的灵感来源。

## 33. 函数式编程

根据Wiki，“函数式编程是一种编程范式，一种构建计算机程序结构和元素的风格，它将计算视为数学函数的计算，并避免了状态的变化和数据的变化。”

有几个概念的函数编程，你将需要掌握:

* Pure functions
* Immutability
* Referential transparency
* Higher-order functions

理解函数式编程的这些概念肯定会让你占上风。

## 34. 干净代码的原则

这是每个开发人员都应该掌握的基本技能，无论使用哪种编程语言。每种编程语言都有一组单独的好实践。虽然这些“好的”实践是主观的，并且在不同的工作场所有所不同，但是有一些实践是公认的“好的”。

通过遵循这些代码原则，你可以确保你的代码对每个人都是可读的和可维护的。这将帮助你和你的团队在应用程序开发期间顺利地协同工作。

## 35. 解构

在ES6中引入了解构操作符。它有相当多的用例，你肯定应该熟悉。对于相同的用例，它们比以前的实现更简单、更有效。这也被称为扩展操作符。

你可以在我的[文章](https://medium.com/better-programming/5-uses-of-the-es6-spread-operator-ef90bdff4d56)中阅读更多关于解构的内容。

## 36. ES2020新特性

编程的美妙之处在于，如果不不断学习，就永远不可能成为编程语言的专家。编程语言会随着时间不断发展，因为每个主要版本都会引入更多的特性。

这意味着你对某个概念的专业知识在未来10年内将会过时或废弃，因为会有更好的替代方案伴随着版本更新发布。对于任何编程语言来说，这都是一个非常常见的场景。

ES2020发布了几个新特性，包括可选链接、nullish合并、动态导入等等。为了跟上快速变化的IT世界，你必须学习这些新概念。你可以在我的[博客](https://blog.bitsrc.io/es2020-has-been-finalized-here-is-what-im-excited-about-414959bc2f7f)中查看新发布的功能。


掌握一门语言需要多年的经验和时间，但是知道要掌握什么会让事情变得更容易。

请浏览下面提到的资源，找到上述36个概念的学习材料。这个[Github仓储](https://github.com/leonardomso/33-js-concepts)是一个很好的起点。

## 资源

[原文链接](https://medium.com/better-programming/36-javascript-concepts-you-need-to-master-to-become-an-expert-c6630ac41bf4)
[Stephen Curtis的文章](https://medium.com/@stephenthecurt/33-fundamentals-every-javascript-developer-should-know-13dd720a90d1)
[Leonardo Maldonado的github仓储](https://github.com/leonardomso/33-js-concepts)