---
title: angular-router
date: 2018-09-09 21:10:47
tags: [angular, router]
---
路由对大多数Angular应用来说是关键的用户体验因素，路由配置对页面加载性能，搜索引擎优化，安全性和用户体验有重大影响。

### 通过cli工具创建一个angular应用

```bash
ng new awesome-app --routing
```

### 创建路由和导航

路由将在`<router-outlet></router-outlet>`所在父组件中呈现组件，默认情况下是`app.component`。

```typescript
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent }
];
```

在HTML中设置指向此路径的链接

```html
<a routerLink="/home">Home Page!</a>
```

或者，可以使用导航实现

```typescript
import { Router } from '@angular/router';

@Component({})
export class HomeComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['home']);
  }
}
```

### 带参数的子路由

假设我们有一个动物列表，并希望在导航时呈现有关特定动物的一些细节`/animals/elephant`。但是我们的数据库有成千上万的动物，所以我们需要动态创建这个路由。添加`:`到路径上使其成为动态值。

```typescript
const routes: Routes = [
  {
    path: 'animals',
    component: ParentComponent,
    children: [
        { path: ':name', component: ChildComponent }
    ]
  }
];
```

这时候，我们可以`/animals/elephant`URL片段中得到动物的`name`或者`id`。
在父组件中，我们将从数据库循环我们的`animal`对象，并根据动物名称创建路由url。

```html
<li *ngFor="let animal of animals$ | async">

  <a [routerLink]="['/animals', animal.name]">{{ animal.name }}</a>

</li>

<router-outlet></router-outlet>
```

子组件将在父组件的`outlet`内渲染。

### 泛组件404页面

我们可以将`**`路径用于捕获路由，以便优雅地处理不存在的数据。但是要确保这是`routes`数组中的最后一个路由。

```typescript
const routes: Routes = [{ path: '**', component: ErrorComponent }];
```

### redirect路由

你可以redirect到一个已经存在的路由

```typescript
const routes: Routes = [
  { path: 'animales', redirectTo: 'animals', pathMatch: 'full' }
];
```

### 修改`active route`的css

Angular可以轻松地将修改`active route`CSS样式。路由有一个特殊的属性绑定`routerLinkActive`，它将应用右侧提供的指定CSS类。

```html
<a routerLinkActive="highlight">Some Link</a>
```

```css
.highlight {
  font-weight: bold;
  font-size: 1.5em;
  color: #23d160;
}
```

### 路由守卫

路由守卫是一中可注入的angular服务，angular提供5中路由

* canActivate - 根据条件阻止路由，通常是用户的身份验证状态。
* canDeactivate - 强制用户留在路线上，通常使用防止丢失表单上未保存的更改。
* resolve - 预加载可从路径访问的其他数据。
* canActivateChild - 处理导航到子路由的情况。
* canLoad - 处理异步导航到某特性模块的情况。

### CanActivate 示例

我们使用1s的计时器模拟异步调用，以验证用户是否为管理员。`canActivate`守卫会自动订阅并用收到的布尔值拒绝或者允许访问。

```typescript
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return timer(1000).pipe(
      map(v => false),
      tap(v => alert('Only ADMINS allowed here!'))
    );
  }
}
```

然后，应用守卫到路由上。

```typescript
const routes: Routes = [
  { path: 'secret', component: SecretComponent, canActivate: [AdminGuard] }
];
```

### 预加载数据的路由示例

保持代码`DRY(Don't Repeat Yourself)`最有效的机制之一就是使用`resolve`预加载数据，如果需要在多个路由上查询相同的数据，`resolver`就可以显著的简化代码，下面的代码先从`route`中提取数据，然后返回一个异步获取数据的`Observable`。

```typescript
@Injectable({
  providedIn: 'root'
})
export class Preloader implements Resolve<any> {
  constructor(private afs: AngularFirestore, private router: Router) {}

  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const name = next.paramMap.get('id');
    return http.get(id).pipe(
      tap(data => {
        if (!data) {
          alert('Data not found!');
          this.router.navigate(['home']);
        }
      })
    );
  }
}
```

初始化组件时，使用上面的`resolver`的路由都可以访问它的数据。

```typescript
const routes: Routes = [
  {
    path: 'settings/:id',
    component: SettingsComponent,
    resolve: [PreloadData]
  },
  {
    path: 'playground/:id',
    component: PlaygroundComponent,
    resolve: [PreloadData]
  }
];
```

然后，您可以从组件中以`Observable`的形式访问数据。比在多个组件中重复相同的数据获取代码要简洁得多。

```typescript
import { ActivatedRoute } from '@angular/router';
@Component(...)
export class SettingsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.data$ = this.route.data;
  }
}
```
