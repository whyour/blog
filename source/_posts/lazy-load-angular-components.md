---
title: angular6懒加载组件
date: 2018-09-15 20:11:03
tags: [angular, route, components, lazy-load]
---
延迟加载是Angular中的一种技术，它允许您在激活特定路由时异步加载JavaScript组件。这可以在初始加载期间添加一些初始性能，特别是如果您有许多具有复杂路由的组件。

### 创建并初始化路由文件的app

我们的app将默认加载`AppComponent`，然后当用户导航到时`lazy/load-me`，将以异步方式加载lazy模块。

```bash
ng new lazyDemo --routing
```

在app组件中添加链接到lazy模块的链接。

```html
<button routerLink="/lazy/load-me"></button>
<router-outlet></router-outlet>
```

### 初始化lazy模块

创建一个延迟加载的模块，以及几个组件。`--flat`参数阻止创建目录，然后我们可以通过Angular CLI将组件添加到模块。

```bash
ng g module lazy --flat
ng g component lazy-parent --module lazy
ng g component lazy-child --module lazy
```

在`lazy module`中需要引入`RouterModule`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyParentComponent } from './lazy-parent/lazy-parent.component';
import { LazyChildComponent } from './lazy-child/lazy-child.component';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'load-me', component: LazyParentComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LazyParentComponent,
    LazyChildComponent
  ]
})
export class LazyModule { }
```

`LazyParentComponent`组件的`lazy-parent.component.html`

```html
<div *ngFor="let name of ['Foo', 'Bar', 'Baz']">
  <p>Hi, my name is {{name}}. I'm a lazy child component.</p>

  <app-lazy-child></app-lazy-child>

</div>
```

### 将`App Router`指向`Lazy Module`

最后是将懒惰路由指向应用路由器的延迟模块。我们可以使用loadChildren带有模块文件路径的属性来执行此操作，然后使用＃引用模块本身。这告诉angular只有在`lazy url`激活时时加载`LazyModule`。

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'lazy', loadChildren: './lazy.module#LazyModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 验证延迟加载是否正常工作

在chrome中，打开开发人员工具，然后单击网络选项卡。当您导航到惰性URL时，可以看到`lazy-module.js`。加载需要`2ms`。

![lazy-load](https://github.com/whyour/graph-bed/raw/master/image.png)

[github源码](https://github.com/whyour/lazy-angular-components)