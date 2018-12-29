---
title: 在eggjs中使用sharp完成图片操作
date: 2018-12-23 16:01:57
tags: [eggjs, sharp]
---
> egg是阿里开发的一个基于koa，遵循「约定大于配置」的原则，支持多进程的一个服务端框架，有许多插件，目前官方是JavaScript写的，但是通过插件是可以支持typescript，目前我们公司就有内部项目是在使用。本文主要介绍在eggjs中对图片的处理。
> egg支持两种方式上传文件，stream和file，stream就是nodejs中的流式上传，而file模式是会把图片先保存在服务端，然后用路径取访问。具体内容见 [egg-multipart](https://eggjs.org/en/plugins/multipart.html)，本文主要使用[sharp](https://github.com/lovell/sharp)完成图片裁剪操作，当然sharp不止于裁剪。
### file 模式
file模式中上传一般不会有任何问题，file模式支持定时清理服务器上的缓存文件，通过访问`this.ctx.request.files`就可访问到所有上传的文件。然后通过sharp操作图片。
```typescript
const Controller = require('egg').Controller;
const fs = require('mz/fs');
const sharp = require('sharp');

module.exports = class extends Controller {
  async upload() {
    const { ctx } = this;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);
    for (const file of ctx.request.files) {
      console.log('field: ' + file.fieldname);
      console.log('filename: ' + file.filename);
      console.log('encoding: ' + file.encoding);
      console.log('mime: ' + file.mime);
      console.log('tmp filepath: ' + file.filepath);
      let result;
      try {
        // process file or upload to cloud storage
        const resizeImage = await sharp(file.filepath)
          .rotate()
          .resize(160, 160)
          .toBuffer();
        result = await ctx.oss.put('egg-multipart-test/' + file.filename, file.filepath);
      } finally {
        // need to remove the tmp files
        await ctx.cleanupRequestFiles();
      }
      console.log(result);
    }
  }
};
```
### stream模式
stream模式不需要缓存图片，但是关键是需要复制图片流，幸运的是sharp支持复制图片流，以输出不同规格的图片。
```typescript
const Controller = require('egg').Controller;
const sharp = require('sharp');

module.exports = class extends Controller {
  async upload() {
    const { ctx } = this;
    const parts = ctx.multipart();
    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        // arrays are busboy fields
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // user click `upload` before choose a file,
          // `part` will be file stream, but `part.filename` is empty
          // must handler this, such as log error.
          continue;
        }
        // otherwise, it's a stream
        console.log('field: ' + part.fieldname);
        console.log('filename: ' + part.filename);
        console.log('encoding: ' + part.encoding);
        console.log('mime: ' + part.mime);
        const stream = sharp();
        file.pipe(stream);
        const rotateImg = stream.clone().rotate();
        const resizeImg = stream.clone().resize(200, 200);
        // sharp返回的是sharp类型的`readable stream`，可以直接传到s3
        console.log(result);
      }
    }
    console.log('and we are done parsing the form!');
  }
};
```
