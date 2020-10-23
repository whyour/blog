---
title: TypeScript 4.0终于发布了我一直期待的内容
date: 2020-08-12 20:08:20
tags: [typescript]
---

8月6日，微软发布了[TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0-rc)的rc版。此版本带来了[元组元素类型标记](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0-rc/#labeled-tuple-elements)，这就是我在本文标题中所提到的期待的内容。

<!-- more -->

![1](https://image.whyour.cn/others/1.png)

### 带有未知参数的泛型接口

这里有一个人为设计的例子`IQuery`。它是用来描述查询函数的参数类型。这个函数总是返回一个promise并使用一个[泛型](https://www.typescriptlang.org/docs/handbook/generics.html)来描述promise返回的内容(`TReturn`)。该接口也足够灵活，可以不接受参数，也可以接受未知数量的参数。

```ts
interface IQuery<TReturn, UParams extends any[] = []> {
  (...args: UParams): Promise<TReturn>
}
```

#### 示例函数：findSongAlbum()

利用这个接口，我们将编写一个函数，该函数通过标题和艺术家查找歌曲专辑。该函数返回一个`promise`，该`promise`返回一个类型为`Album`的对象。

```ts
type Album = {
  title: string
}
```

不使用`typescript`时，我们的函数应该看起来像下面的样子：

```js
const findSongAlbum = (title, artist) => {
  // data fetching code...
  
  const albumName = '1989';
  return Promise.resolve({
     title: albumName
  });
}
```

使用`typescript`时，我们利用`IQuery`接口，你可以传入`Album`类型作为第一个泛型参数，以确保`promise`返回的值的类型总是与`Album`类型匹配。

```ts
const findSongAlbum: IQuery<Album> = (title, artist) => {
  // data fetching code...
  
  const albumName = '1989';
  return Promise.resolve({
     title: albumName 
  });
}
```

#### TypeScript 4.0之前

你还需要定义参数及其类型。在本例中，`title`和`artist`都是字符串。你定义了一个新类型`Params`，并将其作为`IQuery`的第二种类型参数。

在这个例子中，在`TypeScript 4.0`之前，`Params`将被定义为一个类型列表。列表中的每一项定义了参数列表中相同顺序的参数类型。这种类型被称为[元组](https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple)类型。

```ts
type Params: [string, string]

const findSongAlbum: IQuery<Album, Params> = (title, artist) => {
  // data fetching code...
  
  const albumName = '1989';
  return Promise.resolve({
     title: albumName
  });
}
```

你可以在上面的`Params`类型中看到，第一项类型是`string`，使得第一个参数`title`的类型是`string`。第二个也是`string`，使得第二个参数`artist`的类型也是`string`。这将为参数列表提供适当的类型安全性。

![2](https://image.whyour.cn/others/2.gif)

不幸的是，在使用函数时，以这种方式使用元组类型并不能提供有用的类型安全标签。相反，它只是将参数列出为`args_0: string, args_1: string`。除了知道第一个参数是`string`之外，“arg_0”并没有告诉我第一个参数应该是我正在搜索的歌曲的“标题”。

#### TypeScript 4.0之后

在`TypeScript 4.0rc`版中，发布了**元组元素标签**，我们可以使用这些元素在参数列表中获得有用的标签。

现在，`Params`类型中的每一个条目都有一个标签，它会在你使用`findSongAlbum`函数的任何时候在你的IDE中很好的提示你。

```ts
type Params: [title: string, artist: string]

const findSongAlbum: IQuery<Album, Params> = (title, artist) => {
  // data fetching code...
  
  const albumName = '1989';
  return Promise.resolve({
     title: albumName
  });
}
```

![3](https://image.whyour.cn/others/3.gif)

现在，我们在编辑器的智能感知中得到的是`title: string`，而不是`arg_0: string`，它告诉我们需要传入的具体的是哪个字符串类型的字段。

感谢你的阅读❤