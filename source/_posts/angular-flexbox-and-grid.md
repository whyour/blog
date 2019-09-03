---
title: angular-flexbox-and-grid
date: 2019-09-03 22:24:40
tags: [angular, flex, grid]
---

CSS Flexbox 和 CSS Grid 是非常强大的布局功能。除了 IE 11 之外，所有现代浏览器都支持这些。与样式的属性（例如 color 和 border）不同，这些是用于构建布局结构的属性。换句话说，它不用于美化 HTML 元素的表面，而是用于与 HTML 元素的层次结构协作创建应用程序 UI 的基础。

在 Angular 中，将组件视图划分为模板 HTML 和样式表 CSS。由于使用 Flexbox 或 Grid 的布局与 HTML 的结构密切相关，因此将布局设置写入外部 CSS 文件并不方便。因此，在模板 HTML 中定义 Flexbox 和 grid 是一个聪明的选择。

这是否意味着我们应该使用内联样式属性？答案是否定的！

本文介绍如何使用 Angular Flex-Layout 模块在 Angular 模板中构建 Flexbox 布局。

### Angular Flex-Layout

[Angular Flex-Layout](https://www.npmjs.com/package/@angular/flex-layout)是 angular 官方的一个 npm 包。

Angular Flex Layout 使用 Flexbox CSS + mediaQuery 提供复杂的布局 API。 该模块使用自定义布局 API，mediaQuery observables 和 injected DOM flexbox-2016 CSS stylings 为 Angular 开发人员提供了组件布局功能。

Angular Flex-Layout 提供了一些导出了一些 directive 的 NgModule。您可以使用 Flexbox 或 CSS Grid 创建声明性布局结构。

### Installation


使用 Angular CLI 创建项目后，使用 npm/yarn 安装依赖包。Flex-Layout 依赖于 angular DevKit（CDK），因此如果尚未安装，则需要额外安装。

```bash
yarn add @angular/flex-layout @angular/cdk
// or
npm i @angular/flex-layout @angular/cdk
```

然后添加 FlexLayoutModule 到 AppModule。

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { CardComponent } from './card.component';
@NgModule({
  imports: [BrowserModule, FlexLayoutModule],
  declarations: [AppComponent, CardComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

下面我们来实现一个 flex 布局的一个 card 组件

![20190903224450.png](https://i.loli.net/2019/09/03/OdAFsRCnol3D7TN.png)

```ts
@Component({
  selector: 'app-card',
  template: `<div>Card: {{name}}</div>`,
  styles: [
    `:host {
      display: block;
      padding: 32px;
      border: 1px solid black;
      border-radius: 8px;
    }`
  ]
})
export class CardComponent {}
```

### Making a Flexbox layout

下面我们就通过一些例子了解 Angular Flex-Layout 的 api

#### Example 1. Column-based card list

![20190903224404.png](https://i.loli.net/2019/09/03/ilkH5J6t873ecKg.png)

```html
<style>
  .cardList {
    display: flex;
    flex-direction: column;
  }
  /* Row Gap */
  .cardList > *:not(:last-child) {
    margin-bottom: 32px;
  }
</style>
<div class="cardList">
   <app-card></app-card>
   <app-card></app-card>
   <app-card></app-card>
</div>
```

Flexbox 容器添加 display: flex，flex 方向由 flex-direction 属性定义。要定义每行之间的间隙，需要使用:not(:last-child)选择器，因为 CSS 的 Flexbox 不支持间隙大小设置。

使用 Angular Flex-Layout, 相同的布局我们可以使用下面的模板实现

```html
<div fxLayout="column" fxLayoutGap="32px">
  <app-card></app-card>
  <app-card></app-card>
  <app-card></app-card>
</div>
```

在上面的示例中，2 个指令用于创建 Flexbox 容器。

* fxLayout="column" - 对应 display: flex 和 flex-direction。创建一个新的 Flexbox 容器并设置其方向
* fxLayoutGap="32px" - 对应 margin-bottom: 32px 为除了最后一个子元素以外的每个子元素配置每个项目之间的间隙大小

#### Example 2. Row-based card list

另一个例子是具有 3 列的基于行的 card 列表。

![20190903225244.png](https://i.loli.net/2019/09/03/fqxYsenAOtFk2iE.png)

要使用 css 去实现这个效果，模板应该是这样的

```html
<style>
  .cardList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  /* 列间距 */
  .cardList>* {
    box-sizing: border-box;
  }

  .cardList>*:not(:last-child) {
    margin-right: 32px;
  }

  /* Item 大小 */
  .cardListItem {
    flex: 0 1 calc(33.3% - 32px);
  }
</style>
<div class="cardList">
  <ng-container *ngFor="let _ of [1,2,3,4,5,6]">
    <app-card class="cardListItem"></app-card>
  </ng-container>
</div>
```

用 Angular Flex-Layout 重写

```html
<div fxLayout="row wrap" fxLayoutGap="32px" fxLayoutAlign="flex-start">
  <ng-container *ngFor="let _ of [1,2,3,4,5,6]">
    <app-card fxFlex="0 1 calc(33.3% - 32px)"></app-card>
  </ng-container>
</div>
```

由于我们列之间有 32px 的间距，所以要用 flex 属性设置每列宽度，以便于每行可以显示 3 个 card
* fxLayoutAlign="flex-start" - 对应 justify-content: flex-start。配置 Flexbox 容器的对齐方式
* fxFlex="1 0 auto" - 对应 flex: 1 0 auto。配置其 CSS flex 属性

### Responsive APIs

![20190903230010.png](https://i.loli.net/2019/09/03/YDHqR97NrtniTLy.png)

要实现响应式，必须使用 CSS 媒体查询，以确定哪个大小是小的或中等的。普通实现如下所示

```html
<style>
  .cardList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  /* Column Gap */
  .cardList>* {
    box-sizing: border-box;
  }

  .cardList>*:not(:last-child) {
    margin-right: 32px;
  }

  /* Item sizing */
  .cardListItem {
    flex: 0 1 calc(33.3% - 32px);
  }

  /* medium size viewport */
  @media screen and (max-width: 959px) {

    /* Column Gap */
    .cardList>*:not(:last-child) {
      margin-right: 32px;
    }

    /* Item sizing */
    .cardListItem {
      flex: 0 1 calc(50% - 32px);
    }
  }

  /* small size viewport */
  @media screen and (max-width: 599px) {
    .cardList {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .cardList>*:not(:last-child) {
      margin-right: unset;
      margin-bottom: 32px;
    }
  }
</style>
```

Angular Flex-Layout 指令可以使用断点别名作为语法; `<directive>.<breakpoint alias>`。例如，`fxLayout.lt-sm="column"`仅在视口小于 small 时才应用。

下面是重写后的代码

```html
<div fxLayout="row wrap" fxLayout.lt-sm="column" fxLayoutGap="32px" fxLayoutAlign="flex-start">
  <ng-container *ngFor="let _ of [1,2,3,4,5,6]">
    <app-card fxFlex="0 1 calc(33.3% - 32px)" fxFlex.lt-md="0 1 calc(50% - 32px)" fxFlex.lt-sm="100%"></app-card>
  </ng-container>
</div>
```

每个子元素都有新的 fxFlex.lt-md 和 fxFlex.lt-sm 指令来配置每个视口大小的卡片大小。因此，当中小尺寸时，该组件显示 2 列，而当小尺寸时，该组件显示单列。不仅是这些，而且所有 flexbox 指令都支持相同的响应式 API。

### Grid APIs

![20190903230714.png](https://i.loli.net/2019/09/03/BibY49sHVvpWO1D.png)

示例实现如下。Grid 容器有 4 个区域; 标题，侧面，内容和页脚。每个区域都使用[style.grid-area]样式绑定进行定义。

```html
<style>
  .cardInner {
    display: grid;
    grid-template-areas: "header header""side content""footer footer";
    grid-template-rows: auto auto auto;
    grid-row-gap: 16px;
    grid-column-gap: 16px;
  }
</style>
<div class="cardInner">
  <div [style.grid-area]="'header'">
    Header
  </div>
  <div [style.grid-area]="'side'">
    Side
  </div>
  <div [style.grid-area]="'content'">
    Content
  </div>
  <div [style.grid-area]="'footer'">
    Footer
  </div>
</div>
```

要使用 Grid 指令，不需要任何其他设置。安装后 FlexLayoutModule，所有 API 都可用。重写代码如下

```html
<div gdAreas="header header | side content | footer footer" gdGap="16px" gdRows="auto auto auto">
  <div gdArea="header">
    Header
  </div>
  <div gdArea="side">
    Side
  </div>
  <div gdArea="content">
    Content
  </div>
  <div gdArea="footer">
    Footer
  </div>
</div>
```

gdAreas 和 gdRows 指令对应于 grid-template-areas 和 grid-template-rowsCSS 属性。间隙大小使用相同的 gdGap 指令设置。每个区域都用 gdArea 指令定义。

值得注意的是，Grid 指令还支持响应式增强以及 Flexbox！例如，以下模板仅在窄视口中将卡片布局更改为垂直列布局，变成只有两行！

![20190903231136.png](https://i.loli.net/2019/09/03/ljTiLZDI4otegEA.png)

```html
<div gdAreas="header header | side content | footer footer" gdGap="16px" gdRows="auto auto auto"
  gdAreas.lt-md="header | side | content | footer" gdRows.lt-md="auto auto auto auto">
  <div gdArea="header">
    Header
  </div>
  <div gdArea="side">
    Side
  </div>
  <div gdArea="content">
    Content
  </div>
  <div gdArea="footer">
    Footer
  </div>
</div>
```

### reference

* Can I Use: [Flexbox](https://caniuse.com/#feat=flexbox)/[Grid](https://caniuse.com/#feat=css-grid)
* [Github repo](https://github.com/angular/flex-layout)
* [Angular Flex-Layout](https://blog.angularindepth.com/angular-flex-layout-flexbox-and-grid-layout-for-angular-component-6e7c24457b63)
