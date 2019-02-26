---
title: angular6中使用highCharts
date: 2018-05-06 22:17:25
tags: [angular6,ng6]
---
### 全局安装 angular/cli@next
  `npm i -g @angular/cli@next`
### 创建新项目
  `ng new ng6hc`
### 进入 ng6hc `cd ng6hc` 执行 `npm i`
```bash
cd ng6hc
npm i
```
### 安装 highcharts 依赖
  `npm install highcharts-angular`
Get package from NPM in your Angular app:

```cli
npm install highcharts-angular
```

在 app.module.ts 添加 HighchartsChartComponent:

```ts
...
import { HighchartsChartComponent } from 'highcharts-angular';

// 如过编译不通过，可以使用下面的方式引入，需要在app文件夹下创建 highcharts-chart.component.ts 文件
// import { HighchartsChartComponent } from './highcharts-chart.component';

@NgModule({
  declarations: [
    HighchartsChartComponent,
    ...
```

```cli
npm install highcharts --save
```

然后 app.component.ts, 引入 highcharts

```ts
import * as Highcharts from 'highcharts';
```

在 app.component.html 中使用组件 `highcharts-chart`:

```html
<highcharts-chart 
  [Highcharts]="Highcharts"

  [constructorType]="chartConstructor"
  [options]="chartOptions"
  [callbackFunction]="chartCallback"

  [(update)]="updateFlag"
  [oneToOne]="oneToOneFlag"

  style="width: 100%; height: 400px; display: block;"
></highcharts-chart>
```
### 运行 ng serve
效果如下图：
![ng6hc.png](https://i.loli.net/2019/02/26/5c74fc5dacba0.png)
[demo 地址](https://github.com/whyour/ng6hc.git)

### 注意事项

后期做了一个用 angular 写的 highcharts 组件，[ng-hcharts](https://github.com/whyour/ng-hcharts) 可以支持 angular2+项目中使用。另外为了自适应宽度，在调用组件的时候，设置 highcharts 配置遍历时需要放在 setTimeout 中。
