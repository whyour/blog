---
title: 使用Guard和Resolve进行验证和权限控制
date: 2018-07-29 23:23:35
tags: [angular, router, guard]
---
test
Angular2提供了2种组件，`Guard`和`Resolve`。`Guard`顾名思义就是用来保护一个路径。可以用来判断用户只有在满足一定的条件的情况下才能打开这个路径对应的页面。`Resolve`用来在进入某个路径之前先获取数据。

## Guard

`Guard`其实是一系列接口，只要你实现了它的方法，配置了这些`Guard`，Angular路由框架就会根据这个方法返回的`true`或`false`来判断是否激活这个路由。它包括几种类型：

* CanActivate  
    这种类型的`Guard`用来控制是否允许进入当前的路径。
* CanActivateChild  
    这种类型的`Guard`用来控制是否允许进入当前路径的所有子路径。
* CanDeactivate  
    用来控制是否能离开当前页面进入别的路径
* CanLoad  
    用于控制一个异步加载的子模块是否允许被加载。

以`CanActivate`为例，这个接口的定义如下：  

```typescript

export interface CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean;

}
```

这个接口定义了一个方法，当你实现这个接口，并把它配置到某一个路由上以后，当用户进入这个路由的路径之前，就会调用它里面的`canActivate()`方法，它第一个参数，就是将要激活的路由，第二个参数是路由器当前的状态。它返回一个布尔型的结果，或者是布尔型的`Promise`或`Observable`。

## Resolve

这跟Angular1中ui-router库的`resolve`类似，就是用来在打开一个页面之前先获取数据，而不是进入页面以后再加载。这个接口中的方法，可以返回任意的对象，也可以返回一个`Promise`，或者`Observable`

如果在一个路径上同时设置了`CanActivate`和`Resolve`，首先`CanActivate`接口的方法会被执行，当这个路由可以被激活时，`Resolve`接口的方法才会被执行。

## 实例

下面，我们来通过一个比较完整的实例，来看看，`CanActivate`，`CanActivateChild`，`CanDeactivate`和`Resolve`的用法。

### 场景

我们先来看一看要解决的一些问题：

1. 系统的默认页是home页面，这个页面不需要登录也可以打开。
2. 登陆以后，管理员和用户分别进入不同的页面。
3. 所有的todo模块的页面都需要用户角色，管理页面需要管理员角色
4. 在进入任务列表页面之前，需要获取任务列表数据，而不是进入页面以后再获取数据。
5. 当用户离开任务详情页时，提示是否确认要离开。

### 默认页面home

默认页面就是当用户直接打开你的网页域名，没有输入任何路径的情况下，默认打开的页面，在之前的教程已经讲过，这是在配置路由的时候，用`redirect`实现：  

```typescript

{

    path: '',

    redirectTo: '/home',

    pathMatch: 'full'

}
```

### AuthService

首先我们需要一个权限验证的服务`AuthService`，除了用来进行登陆操作，还用于验证是否登陆，是否具有拥有某种角色。具体代码如下：  

```typescript

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

@Injectable()

export class AuthService {

    account: Account;

    // simulation to login.

    login(role: string): Observable<Account> {

        let account = new Account();

        account.id = 11;

        account.name = 'super man';

        account.roles = [role];

        this.account = account;

        return Observable.of(account);

    }

    getAccount(): Account {

        return this.account;

    }

    isLogdedin(): boolean {

        return this.account && this.account.id != null;

    }

    hasRole(role: string): boolean {

        return this.account && this.account.roles.includes(role);

    }

}
```

在最上面我们注意到我们引入了`Observable`和它的一个方法`of`。这是由于我们的登陆操作一般都是去服务器端进行登陆验证，而使用`Http`服务从服务器端获取数据一般都是返回`Observable`，所以这里也使用`Observable`来返回登陆后的用户信息。我们引入`of`方法，是因为我们对`Observable`的操作都是需要什么操作符就引入什么，而不是直接引入所有的。  
最后的`hasRole(role)`方法的用途是，我们可以在页面上通过`ngIf="hasRole('CUSTOMER')"`的方式来控制是否显示某个页面元素。

### 路由定义

之前todo模块的路由是这样：  

```typescript

export const TodoRoutes: Route[] = [

    {

        path: 'todo',

        children: [

            {

                path: 'list',

                component: TodoListComponent

            },

            {

                path: 'detail/:id',

                component: TodoDetailComponent

            }

        ]

    }
];
```

在路径`todo`下面，有两个子路由，分别是列表和详情。  
然后再针对下面的需求，一个个来解决：

1. 所有的todo模块的页面都需要用户角色
2. 离开详情页需要确认
3. 进入列表页面之前需要先获取任务列表数据

### 控制所有todo模块的都需要用户角色

对于第一个，我们要保护所有的todo模块的页面，也就是’/todo’路径的所有子路径，所以，我们可以使用`CanActivateChild`。这样，在每进入一个todo的子路径的时候，都会先进行检查来判断能否进入。代码如下：  

```typescript

import { Injectable } from '@angular/core';

import { CanActivateChild, Router,

    ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { TodoDetailComponent } from './detail/detail.component';

@Injectable()

export class MyTodoGuard implements CanActivateChild {

    constructor(private authService: AuthService, private router: Router) {}

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.authService.isLogdedin()) {

            alert('You need to login!');

            this.router.navigate(['/home']);

            return false;

        }

        if (this.authService.hasRole('CUSTOMER')) {

            return true;

        }

        return false;

    }

}
```

这个`Guard`的实现很简单，就是用`authService`来判断是否登陆，以及是否具有’CUSTOMER’角色。  
注意这个`Guard`的实现也必须是`Injectable`的，因为我们需要Angular的依赖注入帮我们创建实例和自动注入。

### 离开详情页需要确认

接下来我们看怎么实现离开详情页时的确认，也很简单，就是使用`CanDeactivate`，并把它定义在详情页的路由定义上。  

```typescript

@Injectable()

export class CanLeaveTodoDetailGuard implements CanDeactivate<TodoDetailComponent\> {

    canDeactivate(component: TodoDetailComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return confirm('Confirm?');

    }

}
```

为了简单，上面的方法直接调用`confirm('confirm?')`并返回它的结果，它会返回一个布尔型的结果，表示用户是否确认。如果用户取消了，就不会离开详情页。

### 进入列表页面之前需要先获取数据

最后，再看看用`Resolve`来实现进入一个页面之前的数据初始化。  

```typescript

import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Todo } from './todo';

import { TodoService } from './todo.service';

@Injectable()

export class MyTodoResolver implements Resolve<Todo\> {

    constructor(private todoService: TodoService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log('Get my todo list.');

        return this.todoService.getAllTodos();

    }

}
```

在这个`resolve()`方法中，直接返回调用`todoService`的`getAllTodos()`方法的结果。对这个`getAllTodos()`方法我们做一些修改，让他返回一些测试数据：  

```typescript

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/delay';

// 神略中间的部分

  getAllTodos(): Observable<Todo[]> {

    let todo1 = new Todo();

    todo1.id = 1;

    todo1.title = 'test task 1';

    todo1.createdDate = new Date();

    todo1.complete = false;

    let todo2 = new Todo();

    todo2.id = 2;

    todo2.title = 'test task 2';

    todo2.createdDate = new Date();

    todo2.complete = false;

    this.todos = [todo1, todo2];

    return Observable.of(this.todos).delay(3000);

  }
```

在这个方法里我们创建了2个测试的任务，封装成`Observable`返回，并添加了一个3秒钟的延时，来模拟从服务器端获取数据的过程。  
通过`Resolve`方式获取的数据，会放在被激活的当前路由的`data`属性里面，我们可以在组件中来获得。所以，需要修改`TodoListComponent`，从路由的数据`data`中获取`todos`的值。然后就可以在页面中显示：  

```typescript

export class TodoListComponent {

    newTodo: Todo = new Todo();

    todos: Todo[];

    constructor(private todoService: TodoService, private route: ActivatedRoute) {

        this.todos = this.route.snapshot.data['todos'];

    }

    // 省略其他

}
```

### 最终的todo模块路由配置

最后我们再看看加上上面的`Guard`和`Resolve`的路由配置以后，todo模块的路由配置：  

```typescript

export const TodoRoutes: Route[] = [

    {

        path: 'todo',

        canActivateChild: [MyTodoGuard],

        children: [

            {

                path: 'list',

                component: TodoListComponent,

                resolve: { todos: MyTodoResolver }

            },

            {

                path: 'detail/:id',

                component: TodoDetailComponent,

                canDeactivate: [ CanLeaveTodoDetailGuard ]

            }

        ]

    }

];
```

我们在’todo’的路由上加了一个`canActivateChild`控制能否激活子路径, 在`list`的子路径上配置了一个`resolve`来获取数据，在`detail/:id`上配置了一个`canDeactivate`来控制能否离开。

最后，别忘了我们还需要在`todo`模块的定义`TodoModule`里面的`providers`里添加这些，这样依赖注入功能才能使用这些服务。  

```typescript

@NgModule({

  imports:      [CommonModule, FormsModule ],

  declarations: [TodoListComponent, TodoDetailComponent, TodoItemComponent],

  providers:    [TodoService, MyTodoResolver, MyTodoGuard, CanLeaveTodoDetailGuard]

})

export class TodoModule {}
```

### 通用的角色验证Guard
--------------------------------------------

在上面的`MyTodoGuard`里面，我们判断当前的用户是否具有`CUSTOMER`角色，如果我们能够把这个需要判断的`CUSTOMER`角色通过一种方式来传递到这个方法里面，然后通过传递不同的参数，就可以用这个方法来判断进入任意页面的用户是否具有某个角色。我们可以使用Angular2路由里面的`data`属性来实现。  
当我们定义一个路由时，可以通过`data`属性来给这个路由添加一些数据，如下：  

```typescript

export const TodoRoutes: Route[] = [

    {

        path: 'todo',

        data: {

            role: 'CUSTOMER'

        },

        canActivateChild: [MyTodoGuard],

        children: [

            {

                path: 'list',

                component: TodoListComponent,

                resolve: {

                    todos: MyTodoResolver

                },

                data: {

                    title: '列表'

                }

            },

            {

                path: 'detail/:id',

                component: TodoDetailComponent,

                canDeactivate: [ CanLeaveTodoDetailGuard ],

                data: {

                    title: '详情'

                }

            }

        ]

    }

];
```

我们给’todo’这个路由添加了1个变量，角色，我们可以在这个路由定义的组件以及它所有的子组件中的当前路由中得到这些数据。而且在子路由里，都添加了一个`title`的变量。然后在`TodoListComponent`里面就可以使用这个变量，比如在页面上显示。  

```typescript

export class TodoListComponent {

    newTodo: Todo = new Todo();

    todos: Todo[];

    title: string;

    constructor(private todoService: TodoService, private route: ActivatedRoute) {

        this.todos = this.route.snapshot.data['todos'];

        this.title = this.route.data['title'];

    }

    // 省略其他

}
```

我们可以通过这种方式，在每个路由上配置title属性，然后就可以用一种通用的方式来实现在页面上显示面包屑导航栏的功能。

但是，在这个实例中，我们要用`data`上添加的`role: 'CUSTOMER'`，用它来表示当前的这个路径，需要有`CUSTOMER`角色的用户才能访问。然后在`MyTodoGuard`里用它来判断：  

```typescript
@Injectable()

export class MyTodoGuard implements CanActivateChild {

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.authService.isLogdedin()) {

            alert('You need to login!');

            this.router.navigate(['/home']);

            return false;

        }

        let requiredRole = next.data['role'];

        if (requiredRole == null || this.authService.hasRole(requiredRole)) {

            return true;

        }

        return false;

    }

}
```

在这里，我们从将要激活的路由的数据里面得到`role`，然后判断当前用户是否具有这个角色。这样，我们的这个`MyTodoGuard`，可以把它定义在根路径上，就可以作为一个通用的用户权限验证的`Guard`来使用。只要路径上存在这个值，就说明需要权限。

参考资料

* [angular2-route-2-guard-resolve](http://codin.im/2016/11/12/angular2-route-2-guard-resolve/)