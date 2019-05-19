---
title: angular 如何代理后端 API 调用
date: 2019-05-19 20:45:46
tags: [angular, angular cli]
---
在现在的 web 应用中，我们经常需要调用服务端 API，但是在请求 api 的时候，一般和前端不是同一端口，或者根本不是 localhost, 这时候我们就需要配置不同的变量，来发送不同的请求。在 angular 应用中，我们可以使用[httpInterceptor](https://ninesix.cc/post/httpInterceptor.html)来拦截前端发送的所有请求，来给所有请求加上服务端的请求地址，本文我们主要谈论 angular 支持的另外一种可配置的 proxy 方式。

<!-- more -->

### 什么是代理 proxy

通常，代理服务器或代理服务器充当您的应用程序和 Internet 之间的网关。 它是客户端和服务器之间的中间服务器，通过将客户端请求转发到资源。 在 Angular 中，我们经常在开发环境中使用此代理。

Angular 使用 webpack dev 服务器在开发模式下为应用程序提供服务。 比如我们在前端使用 4200 端口，而请求 api 的时候，也就是当我们请求地址以 /api 开头，我们就需要去请求服务端的端口。

### angular proxy.config.json 配置

* target：这是我们需要定义后端 URL 的地方。

* pathRewrite：我们需要使用此选项来编辑或重写路径

* changeOrigin：如果你的后端 API 没有在 localhost 上运行，我们需要将此标志设为 true。

* logLevel：如果要检查代理配置是否正常工作，则应该调试此标志。

* bypass：有时我们必须绕过代理，我们可以用这个定义一个函数。 但它应该在 proxy.config.js 而不是 proxy.config.json 中定义。
  
### 使用 angular cli 设置 Proxy

* 创建一个 proxy.config.json 文件。 我们在这里用/api 定义所有 URL 的 target。

```json
{
    "/api/*": {
    "target": "http://localhost:9000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

* 让 Angular 知道我们有这个 proxy.config.json。 我们可以通过在启动应用程序时添加 proxy-config 标志来实现，如下所示。 一旦启动，我们可以看到消息，指示以/api 开头的所有 URL 将重定向到在端口 9000 上运行的 nodejs 服务器。

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve --proxy-config proxy.conf.json",
  "build": "ng build",
}
```

![20190519212327.png](https://i.loli.net/2019/05/19/5ce158d0e4a8f98778.png)

### 不同的配置方式

在 Angular 项目中配置代理配置的另一种方法是在 angular.json 中定义。

![20190519212800.png](https://i.loli.net/2019/05/19/5ce159e23645a65804.png)

### Rewriting the URL path

每当 URL 发生变化时，我们经常会重写后端服务器端点的路径。 我们可以使用 pathRewrite 来做到这一点。

例如，我们的后端 URL /api/settings 更改为/api/app/settings，我们希望在开发之前进行开发测试。 我们可以使用如下的选项 pathRewrite 来实现这一点。

```json
{
    "/api/*": {
    "target": "http://localhost:9000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api/settings": "/api/app/settings"
    }
  }
}
```

![20190519213322.png](https://i.loli.net/2019/05/19/5ce15b23c9c3190387.png)

### 多个 app 对应一个服务端

有时我们的应用程序中有多个带有服务的模块。 我们可能会遇到多个服务将调用相同 API 端点的情况。

在这种情况下，我们需要定义 proxy.config.js 而不是 proxy.config.json。 同时也需要添加到 angular.json。

```js

const PROXY_CONFIG = [
    {
        context: [
            "/user-api",
            "/settings-api",
            "/product-api",
        ],
        target: "http://localhost:9000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

![20190519213815.png](https://i.loli.net/2019/05/19/5ce15c49016b691576.png)

### 多个 app 对应 多个服务端

例如，我们在端口 9001,9002 和 9003 上运行了三个 API，您的 APP 应该与这些 API 通信。

我们需要向 proxy.config.json 添加多个条目。 以下是该设置的配置，我们必须确保所有 API 都在这些端口上运行，以便成功进行通信。

```

{
  "/user/*": {
    "target": "http://localhost:9000",
    "secure": false,
    "logLevel": "debug"
  },
  "/product/*": {
    "target": "http://localhost:9001",
    "secure": false,
    "logLevel": "debug"
  },
  "/settings/*": {
    "target": "http://localhost:9002",
    "secure": false,
    "logLevel": "debug"
  }
}
```

### 总结

* 在 Angular 中，代理主要用于开发环境中，以促进服务器和 UI 之间的通信。
* 我们需要在不同的端口上运行后端服务器和 UI。
* Proxy.config.json 是保存有关后端 API URL 的所有信息的文件。
* 我们需要确保 Angular App 和服务端在不同的端口上运行以便成功通信。
* 有两种配置方法是添加 angular.json，另一种方法是在启动脚本中添加 proxy-config 标志。
* 我们可以使用选项 pathRewrite 重写路径。
* 我们可以使用 proxy.config.js 将多个条目代理到一个后端 API。
* 我们也可以将多个条目代理到多个后端。

### Reference

* [Angular — How To Proxy To Backend Server](https://medium.com/bhargav-bachina-angular-training/angular-how-to-proxy-to-backend-server-6fb37ef0d025)
* [Proxying to a backend server](https://angular.io/guide/build#proxying-to-a-backend-server)
* [angular proxy.md](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md)