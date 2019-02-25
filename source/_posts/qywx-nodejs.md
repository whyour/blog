---
title: nodejs 开发企业微信第三方应用简明教程
date: 2019-02-25 10:59:16
tags: [nodejs]
---

最近公司要开发企业微信端的 worktile，以前做的是企业微信内部应用，由于开发的是企业内部应用，所有只适用于私有部署客户，对于公有云客户就无法使用，所有就准备开发企业微信的第三方应用，本文主要介绍在调研阶段遇到的山珍海味。

开发之前你需要前注册为第三方服务商，然后用第三方服务商的账号创建应用，创建之后只需要管理员授权应用，第三方服务商即可为用户提供服务。这里我们主要研究第三方服务商注册应用。

### 配置开发信息

在创建应用之前，首先要配置好通用开发参数

![20190225115855.png](https://i.loli.net/2019/02/25/5c73680394fae.png)

在填写系统事件接收 url 时，要正确响应企业微信验证 url 的请求。这个可以参考企业微信后台，自建应用的接收消息的 api 设置。

![20190225120700.png](https://i.loli.net/2019/02/25/5c7369e58cffc.png)

要求填写应用的 URL、Token、EncodingAESKey 三个参数

* URL 是企业后台接收企业微信推送请求的访问协议和地址，支持 http 或 https 协议（为了提高安全性，建议使用 https）。
* Token 可由企业任意填写，用于生成签名。
* EncodingAESKey 用于消息体的加密，是 AES 密钥的 Base64 编码。

#### 验证 url 有效性

当点击保存的时候，企业微信会发生一条 get 请求到填写的 url

比如 url 设置的是`https://api.worktile.com`, 企业微信将发送如下验证请求：

请求地址：https://api.worktile.com/?msg_signature=ASDFQWEXZCVAQFASDFASDFSS×tamp=13500001234&nonce=123412323&echostr=ENCRYPT_STR

| 参数 | 说明 |
|---|---|
| msg_signature  | 企业微信加密签名，msg_signature 结合了企业填写的 token、请求中的 timestamp、nonce 参数、加密的消息体 |
| timestamp  | 时间戳 |
| nonce | 随机数 |
| echostr | 加密的字符串。需要解密得到消息内容明文，解密后有random、msg_len、msg、receiveid 四个字段，其中 msg 即为消息内容明文  |

##### 通过参数 msg_signature 对请求进行校验

首先要把刚才配置时随机生成的 token, timestamp, nonce, msg_encrypt 进行 sha1 加密，这里我们可以直接使用 npm 模块 [sha1](https://www.npmjs.com/package/sha1) 进行加密，然后判断得到的 str 是否和 msg_signature 相等。

```bash
npm i sha1 --save
```
```js
  const sha1 = require('sha1');
  const query = req.query;
  const signature = query.msg_signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  const echostr = query.echostr;
  const tmpArr = [token, timestamp, nonce, echostr];
  const tmpStr = sha1(tmpArr.sort().join(''));
  if (tmpStr === signature) {
    console.log('Check Success');
  } else {
    console.log('Check Failed');
  }
```

##### 解密 echostr 得到 msg 并返回

密文解密过程：

1. 对刚才生成的 AESKey 进行 base64 解码

```js
  const EncodingAESKey = '21IpFqj8qolJbaqPqe1rVTAK5sgkaQ3GQmUKiUQLwRe';
  let aesKey = Buffer.from(EncodingAESKey + '=', 'base64');
```

1. 对 AESKey 进行 aes-256-cbc 解密  

```js
  // 去掉 decipheredBuff 头部的16个随机字节和4个字节的 msg_len，截取 msg_len 长度的部分即为msg，剩下的为尾部的 receiveid
  const crypto = require('crypto');
  let aesCipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesKey.slice(0, 16));
  aesCipher.setAutoPadding(false);
  let decipheredBuff = Buffer.concat([aesCipher.update(data, 'base64'), aesCipher.final()]);
  decipheredBuff = PKCS7Decoder(decipheredBuff);
  const len_netOrder_corpid = decipheredBuff.slice(16);
  const msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
  const result = len_netOrder_corpid.slice(4, msg_len + 4).toString();
```

1. 然后返回 result 即可

```js
  res.end(result);
```

### 测试应用

应用创建成功后，服务商可以授权 10 个测试企业

![20190225143525.png](https://i.loli.net/2019/02/25/5c738cb169625.png)

从企业微信应用市场发起授权时，企业微信给刚才应用设置的`指令回调 url` 发送一个 post 请求，比如：
`https://api.worktile.com/worktile?msg_signature=b99605616153ffbfbe6ebbb500bd211e67ed714d&timestamp=1551076894&nonce=1551709703`，直接返回成功即可。
```js
app.post('/worktile', function (req, res) {
  console.log('req.body', req.body);
  res.send('success');
});
```

### 应用上线

已认证企业微信的服务商，可进入应用管理—点击提交上线—勾选应用—提交上线。

### 注意事项

* 本文更新于 2019 年 2 月 25 日，api 可能有时效性，如有差异，以 [官方 api](https://work.weixin.qq.com/api/doc#90001/90142/90594) 为准。
* worktile 正在开发测试 企业微信、钉钉、h5 端，上线之后欢迎使用。
* [完整 demo](https://raw.githubusercontent.com/whyour/yiyanApi/master/server.js)