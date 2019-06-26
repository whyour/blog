---
title: angular 如何添加多环境变量的配置文件
date: 2019-06-26 14:38:20
tags: [angular, environment]
---
在 angular 开发中，我们常常可能需要不同环境变量来添加不同的配置，但是在 angular 项目中，我们要想在 ng 命令中读取到环境变量，就需要在项目中的 environment 文件夹下添加不同环境变量的配置文件。

<!-- more -->

比如：

### environments

![20190626144925.png](https://i.loli.net/2019/06/26/5d1315767c3a241215.png)

### angular.json

但是问题是，当我们只是开发环境启动时，这个时候我们想要的是，我们传入的环境变量的配置文件应该 merge 默认的配置文件，但是，angular 目前不支持merge， 只有一种替换文件的方式。重点就在 `angular.json`这个文件中。

```json
"projects": {
  "front-end": {
    "root": "",
    "projectType": "application",
    "schematics": {
      "@schematics/angular:component": {
        "styleext": "scss"
      }
    },
    "architect": {
      "build": {
        "builder": "@angular-devkitbuild-angular:browser",
        "options": {
          "outputPath": "dist/front-end",
          "index": "src/index.html",
          "main": "src/main.ts",
          "polyfills": "src/polyfills.ts",
          "tsConfig": "src/tsconfig.app.json",
          "assets": [
            "src/favicon.ico",
            "src/assets"
          ],
          "styles": [
             "src/styles.scss"
          ],
          "scripts": []
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "src": "src/environments/environment.ts",
                "replaceWith": "src/environmentsenvironment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            "sourceMap": false,
            "extractCss": true,
            "namedChunks": false,
            "aot": true,
            "extractLicenses": true,
            "vendorChunk": false,
            "buildOptimizer": true
          },
          "prod": {
            "fileReplacements": [
              {
                "src": "src/environments/environment.ts",
                "replaceWith": "src/environmentsenvironment.prod.ts"
              }
            ]
          }
        }
      },
      "serve": {
        "builder": "@angular-devkitbuild-angular:dev-server",
        "options": {
          "browserTarget": "front-end:build"
        },
        "configurations": {
          "production": {
            "browserTarget": "front-end:build:production"
          },
          "prod": {
            "browserTarget": "front-end:build:prod"
          }
        }
      },
    }
  }
}
```

在 projects 下的你都项目名称中的 architect 中的 build 和 serve，默认我们运行 ng serve 的时候，就会执行默认的 front-end:build, 如果是有环境变量的时候就是 front-end:build:prod, 然后会执行 serve 同级的 build 中的 builder，
然后我们可以给 configurations 中加入自己环境变量的配置，关键就是要加一个 fileReplacements，来替换我们的默认配置文件。

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "src": "src/environments/environment.ts",
        "replaceWith": "src/environmenvironment.prod.ts"
      }
    ],
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false,
    "extractCss": true,
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true
  },
  "prod": {
    "fileReplacements": [
      {
        "src": "src/environments/environment.ts",
        "replaceWith": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

因为目前 angular 中的环境变量不能 merge，这时我们可以写一个 baseConfig，来提取共同的配置文件，然后在其他配置文件中引入 baseConfig。

### baseConfig

```ts
export const baseConfig = {
  platform: 'hulk',
  a: 'b'
};
```

### localConfig

```ts
import { baseConfig } from './environment.base';

export const config = {
  ...baseConfig,
  env: 'local',
};
export const environment = {
  production: false
};
```

### prodConfig

```ts
import { baseConfig } from './environment.base';

export const config = {
  ...baseConfig,
  env: 'prod',
};
export const environment = {
  production: true
};
```

这里要注意的就是 angular 启动文件中，会验证环境变量，所以配置文件中必须有 `environment`。
最后我们在启动的时候要使用 `ng serve --configuration=${env}`, `${env}` 就是你的环境变零名称。这样你就可以完美完成多环境变量加载开发了。 