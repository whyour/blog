---
title: typescript常用内置类型
date: 2019-01-02 11:08:49
tags: [typescript]
---
本文介绍一些typescript中常用的内置类型，以及其可以衍生出的类型。

### Partial

Partial的作用是给某个类型中的属性加上?这个 modifier，也就是将必须的属性转为可选项。在本类型中首先要理解两个关键词：`in`、`keyof`。keyof可以取到一个对象接口的所有key值。
比如:
```typescript
interface Person {
  name: string;
  age: number;
}
type T = keyof Person; // "name" | "age"
```
而in可以遍历联合类型，比如
```typescript
type Keys = "name" | "age";
type Obj = {   // { name: any, age: any }
  [p in Keys]: any
}  
```
`keyof`产生联合类型，`in`遍历联合类型，来看下`Partial`源码
```typescript
// node_modules/typescript/lib/lib.es5.d.ts

type Partial<T> = {
    [P in keyof T]?: T[P];
};
```
意思就是拿到T所有的属性名，然后in遍历，赋值给P，最后用T[P]取得属性的值。比如使用上面的Person接口
```typescript
const hunter: Person = {
  name: "hunter"
}
// error property age is missing
```
使用Partial之后
```typescript
type PartialPerson = Partial<Person>;

const hunter: PartialPerson = {
  name: "hunter"
}
// correct

// PartialPerson 等同于

interface PartialPerson {
  name?: string;
  age?: number;
}
```
但是Partial有个局限性，只能处理第一层属性，比如
```typescript
interface Person {
  name: string;
  age: number;
  child: {
    name: string;
    age: number;
  }
}

type PartialPerson = Partial<Person>;

const hunter: PartialPerson = {
  name: "hunter";
  child: {
    name: "whyour"
  }
} // error property age in child is missing
```
如果要处理多层，就需要通过`[Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)`实现更强大的Partial

```typescript
export type PowerPartial<T> = {
  [U in keyof T]?: T[U] extends object
    ? PowerPartial<T[U]>
    : T[U]
}; // 如果属性值是一个继承于object，进行递归
```

### Conditional Types
`Conditional Types`是ts2.8引入的一个条件类型，比如
```typescript
type XOrY = T extends U ? X : Y;
```
意思就是如果T是U的子类型，就返回X，否则返回Y，甚至可以多个组合
```typescript
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"
```
### Required

```typescript
type Required<T> = {
  [P in Keyof T]-?: T[P];
}
```
这个类型刚好和Partial相反，Partial是将所有属性改为不必须，Required是将所有属性改为必须。
其中关键就是`-?`，它的作用就是移除`?`标识，还可以应用在readonly，比如
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}
```
Readonly是给属性添加`readonly`标识，如果改成`-readonly`就是移除属性的`readonly`标识。比如
```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

### Pick
```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
如果使用过`[lodash](https://lodash.com/docs/4.17.11)`，就知道这个类型是将子属性取出来，比如
```typescript
type NewPerson = Pick<Person, 'name'>; // { name: string; }
```
可以看到NewPerson中就只有name属性了。

### Record
将K中所有属性值转为T类型。
```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```
比如
```typescript
type T11 = Record<'a' | 'b' | 'c', Person>; // { a: Person; b: Person; c: Person; }
```

### Exclude
```typescript
type Exclude<T, U> = T extends U ? never : T;
```
顾名思义，就是把T中继承于U的类型移除，比如
```typescript
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
```
这个类型可以结合Pick来使用。当我们要继承某个接口，又需要修改某个属性的类型。比如
```typescript
interface Chicken {
  name: string;
  age: number;
  egg: number;
}
```
然后我们要继承上面的接口，但是我们的name不再是string而是number
```typescript
interface NewChicken extends Pick<Chicken, 'age' | 'egg'> {
  name: number;
}
```
优化一下，使用下Exclude
```typescript
interface NewChicken extends Pick<Chicken, Exclude<keyof Chicken, 'name'>> {
  name: number;
}
```
然后封装成一个单独的类型
```typescript
type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;
```
再次优化
```typescript
interface NewChicken extends Omit<Chicken, 'name'> {
  name: number;
}
```

### ReturnType

```typescript
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```
这个类型是获取方法的返回类型，在`Conditional Types`中，我们可以用`infer`声明一个类型变量并对它进行使用。这里就是声明一个变量来承载返回值类型。比如
```typescript
function TestFn() {
  return 123;
}

type T01 = ReturnType<typeof TestFn>; // number
```

### Extract
```typescript
type Extract<T, U> = T extends U ? T : never;
```
结合实例
```typescript
type T = Extract<1 | 2, 1 | 3> // -> 1
```
可以得知，extract的作用是从T中提取U。

### ThisType

```typescript
interface ThisType<T> { }
```
可以看到只声明了一个接口，其实这个类型的作用是指定上下文对象类型。
```typescript
interface Person {
  name: string;
  age: number;
}

const obj: ThisType<Person> = {
  dosth() {
    this.name // string
  }
}
```
这样obj中的所有方法的上下文对象都成了Person这个类型，和下面差不多
```typescript
const obj = {
  dosth(this: Person) {
    this.name // string
  }
}
```

### reference
[https://wanghx.cn/blog/github/issue13.html](https://wanghx.cn/blog/github/issue13.html)
[https://zhuanlan.zhihu.com/p/40311981](https://zhuanlan.zhihu.com/p/40311981)