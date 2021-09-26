---
title: typescript 实现 Promise A+ 规范
date: 2021-09-26 22:24:40
tags: [typescript, promise]
---

在实现 Promise 之前，我们先了解下 Promise A+ 规范。

Promise A+ 规范是实现者为实施者提供的开源的、可互操作的 JavaScript Promise 规范

promise 代表一个异步操作的最终结果。与 `promise` 的主要交互方式是通过 then 方法注册回调函数来接受 promise 的最终值或者 promise 未完成的原因。

该规范详细描述了 then 方法的行为，它提供了一个可互操作的基础，所有符合 Promise/A+ 规范的 promise 的实现都可以依赖这个基础。因此，这个规范被认为是非常稳定的。

历史上，Promise/A+ 澄清了早期 Promise/A proposal 的行为条款，并将其拓展到涵盖事实的行为，并且省略了未指定或者有问题的部分。

最后，Promise/A+ 规范的核心不是如何创建、完成或者拒绝 promise，而是选择专注于一个可互操作的 then 方法。伴随规范的未来工作可能会涉及这些主题。

### 术语

1. promise 是一个有 then 方法的对象或者函数，其行为符合规范
2. thenable 是定义在 then 方法上的对象或者函数
3. value 是任何合法的 JavaScript 值（包括 undefined、thenable 或者 promise）
4. exception 是通过 throw 语句抛出的值
5. reason 是一个表名 promise 为什么失败的值

### 需求

#### Promise 状态

1. 当 promise 状态为 pending 时，可以变成完成状态或者失败状态
2. 当 promise 状态为 fulfilled 时，不能变更为任何一种状态。必须有一个 value 值，且不可更改
3. 当 promise 状态为 rejected 时，不能变更为任何一种状态，必须有一个 reason 值，且不可更改

#### then 方法

promise 必须提供一个 then 方法，来访问它当前或者最终的 value 或者 reason

一个 promise 的 then 方法接受两个参数

```js
promise.then(onFulfilled, onRejected)
```

1. onFulfilled 和 onRejected 参数都是可选的
2. 如果 onFulfilled 参数不是一个函数，必须被忽略
3. 如果 onRejected 参数不是一个函数，必须被忽略
4. 如果 onFulfilled 参数是一个函数，必须在 promise 完成后被调用仅且一次，然后把 promise 的 value 作为第一个参数
5. 如果 onRejected 参数是一个函数，必须在 promise 失败后被调用仅且一次，然后把 promise 的 reason 作为第一个参数
6. then 方法可以在同一个 promise 中被调用多次，当 promise 完成时，所有响应的 onFulfilled 回调必须按照 then 注册的顺序来执行。当 promise 失败时，所有响应的 onRejected 回调必须按照 then 注册的顺序来执行。
7. then 方法必须返回一个新的 promise

```js
promise2 = promise1.then(onFulfilled, onRejected)
```
1. 如果 onFulfilled 或者 onRejected 返回一个值 x，运行 Promise Resolution Procedure
2. 如果 onFulfilled 或者 onRejected 抛出一个异常 e，promise2 必须 reject 并将 e 作为 reason
3. 如何 onFulfilled 不是一个函数，且 promise1 为 fulfilled 状态，promise2 必须使用和 promise1 相同的 value 完成
4. 如何 onRejected 不是一个函数，且 promise1 为 rejected 状态，promise2 必须使用和 promise1 相同的 reason 完成

<!-- 也就是说 then 方法返回的 promise 只有当 onFulfilled 或者 onRejected 抛出异常时，promise2 -->

### The Promise Resolution Procedure

promise 解析过程是一个以输入 promise 和 value 的抽象操作，我们记作 [[Resolve]](promise, x)

1. 如果 promise 和 x 引用同一个对象，则用 TypeError 作为 reason 拒绝 promise
2. 如何 x 是一个 promise
   1. 如果 x 为 pending 状态，promise 必须保持 pending 状态直到 x 成功或者失败
   2. 如果 x 为 fulfilled 状态，用相同的 value 完成 promise
   3. 如果 x 为 rejected 状态，用相同的 reason 拒绝 promise
3. 如果 x 是一个对象或者函数
   1. 把 x.then 赋值给 then
   2. 使用 try catch 捕获错误，如果赋值过程出现错误，用 catch 到的 e 作为 reason 拒绝 promise
   3. 如果 then 是一个函数，把 this 指向 x，调用 then 方法 `then.call(x, resolvePromiseFn, rejectPromise)`
      1. 如果 resolvePromise 被 y 值调用，运行 [[Resolve]](promise, y)
      2. 如果 rejectPromise 被为 r 的 reason 调用，用 r 来拒绝 promise
      3. 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
      4. 如果调用 then 抛出异常 e， 此时如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略，否则，使用异常 e 作为 reason 拒绝 promise
   4. 如果 then 不是一个函数，使用 x 完成 promise
4. 如果 x 不是对象或者函数，用 x 完成 promise

### 实现 promise

```typescript
enum PromiseStates {
  'pending' = 'pending'
  'fulfilled' = 'fulfilled'
  'rejected' = 'rejected'
}

type FunType = () => any;
type BasicType = 'string' | 'number' | 'object' | 'undefined'

class MPromise {
  private _status = PromiseStates.pending;
  private value: BasicType;
  private reason: Error;
  private fulfilledCallbackList: FunType[] = []
  private rejectedCallbackList: FunType[] = []

  get status() {
    return this._status
  }

  set status(newStatus: PromiseStates) {
    this._status = newStatus
    switch (newStatus) {
      case PromiseStates.fulfilled:
        this.fulfilledCallbackList.forEach(cb => {
          cb(this.value);
        })
        break;
      case PromiseStates.rejected:
        this.rejectedCallbackList.forEach(cb => {
          cb(this.reason);
        })
        break;
    }
  }

  constructor(fn: (resolve, reject) => void) {
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(value): void {
    if (this.status === PromiseStates.pending) {
      this.value = value;
      this.status = PromiseStates.fulfilled;
    }
  }

  reject(reason): void {
    if (this.status === PromiseStates.pending) {
      this.reason = reason;
      this.status = PromiseStates.rejected;
    }
  }

  then(onFulfilled: FunType, onRejected: FunType): MPromise {
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value: BasicType) => value;
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason: Error) => (throw reason);

    const promise2 = new MPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicroTask(() => {
          try {
            const x = realOnFulfilled(this.value);
          } catch (error) {
            reject(error);
          }
        })
      }

      const rejectedMicrotask = () => {
        queueMicroTask(() => {
          try {
            const x = realOnRejected(this.reason);
          } catch (error) {
            reject(error);
          }
        })
      }


      switch (this.status) {
        case PromiseStates.fulfilled:
          fulfilledMicrotask();
          break;
        case PromiseStates.rejected:
          rejectedMicrotask();
          break;
        case PromiseStates.pending:
          this.fulfilledCallbackList.push(onFulfilled);
          this.rejectedCallbackList.push(onRejected);
          break;
      }

    })

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('the promise and the return value are the same'))
    }

    if (x instanceof MPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject)
        }, reject)
      })
    } else if (typeof x === 'object' || typeof x === 'function') {
      if (x === null) {
        return resolve(x);
      }

      let then = null;

      try {
        then = x.then;
      } catch (error) {
        return reject(error);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(x, (y) => {
            if (called) return;
            called = true;
            this.resolvePromise(promise2, y, resolve, reject);
          }, (r) => {
            if (called) return;
            called = true;
            reject(r);
          })
        } catch (error) {
          if (called) return;
          reject(error);
        }

      } else {
        resolve(x);
      }


    } else {
      resolve(x);
    }

  }

  private isFunction(fn: FunType) {
    return typeof fn === 'function';
  }

  static resolve(value) {
    if (value instanceof MPromise) {
      return value;
    }

    return new MPromise(resolve => {
      resolve(value);
    })
  }

  static reject(reason) {
    return new MPromise((resolve, reject) => {
      reject(reason);
    })
  }

  static race(promiseList) {
    return new MPromise((resolve, reject) => {
      const length = promiseList.length;
      if (length === 0) {
        return resolve();
      }

      for (let i = 0; i < length; i++) {
        MPromise.resolve(promiseList[i]).then((value) => {
          return resolve(value);
        }, (reason) => {
          return reject(value);
        })
        
      }
    })
  }

  // Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
  static all(promiseList) {
    return new MPromise((resolve, reject) => {
      const length = promiseList.length;
      let results = [];
      let promiseCount = 0;

      if (length === 0) {
        return resolve();
      }

      for (let i = 0; i < length; i++) {
        MPromise.resolve(promiseList[i]).then((value) => {
          promiseCount++;
          results[i] = value;

          // 当所有Promise都正确执行了，resolve输出所有返回结果。
          if (promiseCount === length) {
            return resolve(results);
          }
        }, (reason) => {
          return reject(reason);
        })
        
      }
    })
  }

}
```