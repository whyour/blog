---
title: typescript中type和interface的区别
date: 2018-11-25 22:40:03
tags: [typescript, interface, type]
---
在typescript中有两种类型生命方式，`interface`和`type`，本文将介绍将介绍`interface`和`type`在声明时的不同。
interface可以重复声明，typescript会将他们合并。

```typescript
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}
```
而type不可重复声明。
```typescript
type Box {
    height: number;
    width: number;
}

type Box {
    scale: number;
}

// [ts] Duplicate identifier 'Box'.
```
`interface`能用于extends或者`implements`，而`type`不可以。
An interface may only extend a class or another interface.
A class may only implement another class or interface.