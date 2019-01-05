---
title: angular6中使用highCharts
date: 2018-05-06 22:17:25
tags: [angular6,ng6]
---
###全局安装angular/cli@next
    `npm i -g @angular/cli@next`
###创建新项目
    `ng new ng6hc`
###进入ng6hc `cd ng6hc` 执行 `npm i`
###安装highcharts依赖
    `npm install highcharts-angular`
Get package from NPM in your Angular app:

```cli
npm install highcharts-angular
```

在 app.module.ts 添加 HighchartsChartComponent:

```ts
...
import { HighchartsChartComponent } from 'highcharts-angular';

//如过编译不通过，可以使用下面的方式引入，需要在app文件夹下创建highcharts-chart.component.ts 文件
//import { HighchartsChartComponent } from './highcharts-chart.component';


@NgModule({
  declarations: [
    HighchartsChartComponent,
    ...
```

```cli
npm install highcharts --save
```

然后 app.component.ts, 引入highcharts

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
###运行ng serve
效果如下图：
![IMAGE](/postImg/ng6hc.jpg)
[demo地址](https://github.com/whyour/ng6hc.git)