---
title: 用angular/cli和typescript开发npm模块
date: 2018-06-01 10:49:19
tags: ['angular','angular/cli','typescript','npm']
---
### 1.使用angular/cli新建一个项目
```bash
ng new ng-hcharts
```
在这之前确认你以全局安装`angular/cli`
### 2.在`package.json`中的script加入
```json
"build": "rimraf ./built/* ./codegen/* && ngc -p tsconfig-dist.json",
"build:ngm": "ngm build -p src --clean"
```
这里面用到了两个其他模块[ngm-cli](https://github.com/valor-software/ngm-cli)和[rimraf](https://github.com/isaacs/rimraf)需要全局安装
```bash
npm i -g ngm-cli
npm i -g rimraf
```
### 3.在`src`目录中新建一个组件，你需要发布的组件
```bash 
ng g component ng-hcharts
```
### 4.在src目录下初始化一个package.json
```bash
npm init
```
```json
{
  "name": "ng-hcharts",
  "version": "1.0.6",
  "description": "Responsive highcharts for Angular2+ base on highcharts",
  "main": "index.js",
  "scripts": {},
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/whyour/ng-hcharts.git"
  },
  "keywords": [
    "highcharts",
    "angular2+"
  ],
  "author": "whyour",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/whyour/ng-hcharts/issues"
  },
  "homepage": "https://github.com/whyour/ng-hcharts#readme",
  "peerDependencies": {
    "@angular/common": "^6.0.3",
    "@angular/compiler": "^6.0.3",
    "@angular/core": "^6.0.3",
    "typescript": "~2.7.2",
    "highcharts": "^6.1.0",    
    "rxjs": "^6.2.0"
  }
}
```
选择或设置自己所需要的信息。然后初始化一个tsconfig.json
```bash
tsc --init
```
确认你全局安装了typescript
```json
{
  "compilerOptions": {
    "outDir": "../built",
    "rootDir": "./",
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "inlineSources": true,
    "noEmitHelpers": false,
    "noImplicitAny": true,
    "declaration": true,
    "skipLibCheck": false,
    "stripInternal": true,
    "strictNullChecks": false,
    "allowSyntheticDefaultImports": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "lib": [
      "dom",
      "es6"
    ],
    "types": [
      "jasmine"
    ]
  },
  "exclude": [
    "node_modules"
  ],
  "files": [
    "../scripts/typings.d.ts",
    "./index.ts"
  ],
  "angularCompilerOptions": {
    "genDir": "../temp/factories",
    "strictMetadataEmit": false,
    "skipTemplateCodegen": true,
    "fullTemplateTypeCheck": true
  }
}
```
### 5.打包组件
```bash
npm run build
npm run build:ngm
```
### 6.发布npm包
```bash
cd built
npm run patch
npm run publish
```
`npm run patch`会增加一个bug版本，假如当前版本是`1.0.0`
```bash
npm run patch /* 执行之后版本就是`1.0.1` */
/* 再执行 */
npm run patch /* 执行之后版本就是`1.0.2` */
```
详见[npm-version](https://docs.npmjs.com/cli/version)
完整模块[ng-hcharts](https://github.com/whyour/ng-hcharts)
[ng-hcharts-ele](https://github.com/whyour/ng-hcharts-ele)