---
title: angular6中使用httpInterceptor处理前端请求
date: 2018-06-15 19:36:34
tags: ['angular', 'angular6', 'httpInterceptor']
---
在前端项目中，往往在请求服务端的 api 的时候，我们需要做一些跨域、统一前缀、添加 cookie 等 header 信息的处理，这时候，在  angular 中，就用到了 `httpInterceptor`，下面介绍如何在 angular 中使用 httpInterceptor。
### 在`angular`项目根目录下创建`service`
```bash
ng g service httpInterceptor
```

httpInterceptorService 其实就是一个实现了 angular 中 HttpInterceptor 接口的 service，然后实现接口中的 intercept 方法。

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor() { }
}
```
### 引入@angular/common/http 模块
```typescript
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpResponse
} from '@angular/common/http';
```
### 引入 rxjs 操作符
```typescript
import { Observable } from 'rxjs';
import { finalize, tap, catchError, map } from 'rxjs/operators';
```
### finally code
```typescript
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let secureReq: HttpRequest<any> = req;
    const url = `${config.apiUrl}/api/`;   //添加api统一前缀
    const params = req.params.append('t', new Date().getTime().toString());  //请求中添加时间戳
    secureReq = req.clone({
        url: url + req.url,
        params: params
    });
    const started = Date.now();
    let ok: string;
    return next.handle(secureReq).pipe(
        tap(
            // Succeeds when there is a response; ignore other events
            event => {
                const response = event as HttpResponse<any>;
                ok = event instanceof HttpResponse ? 'succeeded' : '';
                if (response.body) {    //请求的body直接拿到返回的数据，这时可判断错误码等信息。
                    (event as any).body = response.body.data;
                }
            },
            error => {
                error.method = req.method;
                ok = 'failed';
            }
        ),
        finalize(() => {
            const elapsed = Date.now() - started;  //可计算出请求所消耗时间
            const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
            console.log(msg);
        }));
  }
}
```