---
title: 使用typescript和html开发vue
date: 2018-12-02 23:49:37
tags: [typescript, vue, html]
---

本篇将介绍如何用typescript和html开发vue，因为博主在主要开发angular，对于js文件和模板写在一起感觉很臃肿，而且方法都需要逗号分隔，变量声明也不友好。
所有翻山越岭，发现vue官方已经开发了对typescript的支持[vue-class-component](https://github.com/vuejs/vue-class-component)
还有对`@Prop`、`@Emit`、`@Inject`、`@Model`、`@Watch`等支持的[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)，
但是`@Component`不支持`templateUrl`，所以用到了[vue-template-loader](https://github.com/ktsn/vue-template-loader)。

### 安装依赖

```bash
npm i --save vue vue-class-component vue-property-decorator
npm i --save-dev css-loader ts-loader typescript vue-loader vue-template-compiler                 vue-template-loader webpack webpack-cli
```

### 创建tsconfig.json

```json
// tsconfig.json

{
  "compilerOptions": {
      "outDir": "./built/",
      "sourceMap": true,
      "strict": true,
      "noImplicitReturns": true,
      "module": "es2015",
      "moduleResolution": "node",
      "target": "es5",
      "experimentalDecorators": true,
      "allowSyntheticDefaultImports": true
  },
  "include": [
      "./src/**/*"
  ]
}
```

### 常见webpack配置文件

```javascript
// webpack.conf.js

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.html$/,
        loader: 'vue-template-loader',
        exclude: /index.html/,
        options: {
          transformToRequire: {
            img: 'src'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  mode: 'development',
  devtool: '#source-map',
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

### 添加声明文件

由于vue没有默认export Vue，所以需要在项目下自己声明，避免ts编译出错。

```typescript
// index.d.ts

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module '*.html' {
  import Vue, { ComponentOptions } from 'vue';

  interface WithRender {
    <V extends Vue>(options: ComponentOptions<V>): ComponentOptions<V>
    <V extends typeof Vue>(component: V): V
  }

  const withRender: WithRender;
  export default withRender;
}
```

> [完整demo](https://github.com/whyour/vue-typescript-demo)