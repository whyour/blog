---
title: nodejs 开发企业微信第三方应用入门教程
date: 2019-02-25 10:59:16
tags: [nodejs]
---

最近公司要开发企业微信端的 worktile，以前做的是企业微信内部应用，由于开发的是企业内部应用，所有只适用于私有部署客户，对于公有云客户就无法使用，所有就准备开发企业微信的第三方应用，本文主要介绍在调研阶段遇到的山珍海味。

开发之前你需要前注册为第三方服务商，然后用第三方服务商的账号创建应用，创建之后只需要管理员授权应用，第三方服务商即可为用户提供服务。

### 一、注册第三发服务商
登陆[服务商官网](https://open.work.weixin.qq.com/)，注册成为服务商，并登陆服务商管理后台。

### 二、配置开发信息

在创建应用之前，首先要配置好通用开发参数

![20190225115855.png](https://i.loli.net/2019/02/25/5c73680394fae.png)

在填写系统事件接收 url 时，要正确响应企业微信验证 url 的请求。这个可以参考企业微信后台，自建应用的接收消息的 api 设置。
在企业的管理端后台，进入需要设置接收消息的目标应用，点击“接收消息”的“设置API接收”按钮，进入配置页面。

![20190225120700.png](https://i.loli.net/2019/02/25/5c7369e58cffc.png)

要求填写应用的 URL、Token、EncodingAESKey 三个参数

* URL 是企业后台接收企业微信推送请求的访问协议和地址，支持 http 或 https 协议（为了提高安全性，建议使用 https）。
* Token 可由企业任意填写，用于生成签名。
* EncodingAESKey 用于消息体的加密，是 AES 密钥的 Base64 编码。

#### 2.1 验证 url 有效性

当点击保存的时候，企业微信会发生一条 get 请求到填写的 url

比如 url 设置的是`https://api.worktile.com`, 企业微信将发送如下验证请求：

请求地址：https://api.worktile.com/?msg_signature=ASDFQWEXZCVAQFASDFASDFSS×tamp=13500001234&nonce=123412323&echostr=ENCRYPT_STR

| 参数 | 说明 |
|---|---|
| msg_signature  | 企业微信加密签名，msg_signature 结合了企业填写的 token、请求中的 timestamp、nonce 参数、加密的消息体 |
| timestamp  | 时间戳 |
| nonce | 随机数 |
| echostr | 加密的字符串。需要解密得到消息内容明文，解密后有random、msg_len、msg、receiveid 四个字段，其中 msg 即为消息内容明文  |

##### 2.1.1 通过参数 msg_signature 对请求进行校验

首先要把刚才配置时随机生成的 token, timestamp, nonce, msg_encrypt 进行 sha1 加密，这里我们可以直接使用 npm 模块 [sha1](https://www.npmjs.com/package/sha1) 进行加密，然后判断得到的 str 是否和 msg_signature 相等。

```js
function sha1(str) {
  const md5sum = crypto.createHash('sha1');
  md5sum.update(str);
  const ciphertext = md5sum.digest('hex');
  return ciphertext;
}
```
```js
function checkSignature(req, res, encrypt) {
  const query = req.query;
  console.log('Request URL: ', req.url);
  const signature = query.msg_signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  let echostr;
  console.log('encrypt', encrypt);
  if (!encrypt) {
    echostr = query.echostr;
  } else {
    echostr = encrypt;
  }
  console.log('timestamp: ', timestamp);
  console.log('nonce: ', nonce);
  console.log('signature: ', signature);
  // 将 token/timestamp/nonce 三个参数进行字典序排序
  const tmpArr = [token, timestamp, nonce, echostr];
  const tmpStr = sha1(tmpArr.sort().join(''));
  console.log('Sha1 String: ', tmpStr);
  // 验证排序并加密后的字符串与 signature 是否相等
  if (tmpStr === signature) {
    // 原样返回echostr参数内容
    const result = _decode(echostr);
    console.log('last', result);
    console.log('Check Success');
    return result;
  } else {
    console.log('Check Failed');
    return 'failed';
  }
}
```

##### 2.1.2 解密 echostr 得到 msg 并返回

密文解密过程：

1. 对刚才生成的 AESKey 进行 base64 解码

```js
const EncodingAESKey = '21IpFqj8qolJbaqPqe1rVTAK5sgkaQ3GQmUKiUQLwRe';
let aesKey = Buffer.from(EncodingAESKey + '=', 'base64');
```

2. 对 AESKey 进行 aes-256-cbc 解密  

```js
function _decode(data) {
  let aesKey = Buffer.from('21IpFqj8qolJbaqPqe1rVTAK5sgkaQ3GQmUKiUQLwRe' + '=', 'base64');
  let aesCipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesKey.slice(0, 16));
  aesCipher.setAutoPadding(false);
  let decipheredBuff = Buffer.concat([aesCipher.update(data, 'base64'), aesCipher.final()]);
  decipheredBuff = PKCS7Decoder(decipheredBuff);
  let len_netOrder_corpid = decipheredBuff.slice(16);
  let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0);
  const result = len_netOrder_corpid.slice(4, msg_len + 4).toString();
  return result; // 返回一个解密后的明文
}
```
```js
function PKCS7Decoder (buff) {
  var pad = buff[buff.length - 1];
  if (pad < 1 || pad > 32) {
    pad = 0;
  }
  return buff.slice(0, buff.length - pad);
}
```

3. 然后返回 result 即可

```js
res.end(result);
```

#### 2.2 回调 url 验证失败问题

验证 URL 时，经常会碰到 URL 验证失败的问题，解决思路是借助微信企业号[接口调试工具](http://qydev.weixin.qq.com/debug)

### 三、创建应用

![20190228143529.png](https://i.loli.net/2019/02/28/5c778136ecb74.png)

### 四、测试应用

应用创建成功后，服务商可以授权 10 个测试企业

![20190225143525.png](https://i.loli.net/2019/02/25/5c738cb169625.png)

从企业微信应用市场发起授权时，企业微信给刚才应用设置的`指令回调 url` 发送一个 post 请求，比如：
`https://api.worktile.com/worktile?msg_signature=b99605616153ffbfbe6ebbb500bd211e67ed714d&timestamp=1551076894&nonce=1551709703`，直接返回成功即可。

各个事件的回调，服务商在收到推送后都必须直接返回字符串 “success”，若返回值不是 “success”，企业微信会把返回内容当作错误信息。

```js
app.post('/worktile', function (req, res) {
  console.log('req.body', req.body);
  res.send('success');
});
```

测试应用注意事项

1. 用于安装测试的企业微信帐号需服务商自行注册，每个应用支持同时添加 10 个测试企业微信账号
2. 安装测试的企业微信帐号使用的是当前的应用配置信息，后续的修改不会进行同步；如需更新应用信息请重新授权安装
3. 同一企业微信帐号，不支持同时安装测试应用和正式发布的应用

### 五、应用上线

已认证企业微信的服务商，可进入应用管理—点击提交上线—勾选应用—提交上线。

### 六、用户网页授权登录

#### 6.1 构造第三方应用网页授权链接

如果第三方应用需要在打开的网页里面携带用户的身份信息，第一步需要构造如下的链接来获取 code：

> https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect

|参数|必须|说明|
| ---- | ---- | ---- |
|appid|是|第三方应用 id（即 ww 或 wx 开头的 suite_id）。注意与企业的网页授权登录不同|
|redirect_uri|是|授权后重定向的回调链接地址，请使用 urlencode 对链接进行处理 ，注意域名需要设置为第三方应用的可信域名|
|response_type|是|返回类型，此时固定为：code|
|scope|是|应用授权作用域。snsapi_base：静默授权，可获取成员的基础信息（UserId与DeviceId）；snsapi_userinfo：静默授权，可获取成员的详细信息，但不包含手机、邮箱等敏感信息；snsapi_privateinfo：手动授权，可获取成员的详细信息，包含手机、邮箱等敏感信息。|
|state|否|重定向后会带上 state 参数，企业可以填写 a-zA-Z0-9 的参数值，长度不可超过 128 个字节|
|#wechat_redirect|是|终端使用此参数判断是否需要带上身份信息|

![auth.png](https://i.loli.net/2019/03/06/5c7f79296f7f4.png)


企业员工点击后，页面将跳转至 redirect_uri?code=CODE&state=STATE，第三方应用可根据 code 参数获得企业员工的 corpid 与 userid。code 长度最大为 512 字节。

#### 6.2 获取访问用户身份

请求方式：GET（HTTPS）
请求地址：https://qyapi.weixin.qq.com/cgi-bin/service/getuserinfo3rd?access_token=SUITE_ACCESS_TOKEN&code=CODE

|参数|必须|说明|
|--- |--- |--- |
|access_token|是|第三方应用的 suite_access_token，参见[“获取第三方应用凭证”](https://work.weixin.qq.com/api/doc#10975/%E8%8E%B7%E5%8F%96%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%94%E7%94%A8%E5%87%AD%E8%AF%81)|
|code|是|通过成员授权获取到的 code，最大为 512 字节。每次成员授权带上的 code 将不一样，code 只能使用一次，5 分钟未被使用自动过期。|

##### 6.2.1 获取第三方应用的 suite_access_token

请求方式：POST（HTTPS）
请求地址： https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token

|参数|是否必须|说明|
|--- |--- |--- |
|suite_id|是|以 ww 或 wx 开头应用 id（对应于旧的以 tj 开头的套件 id）|
|suite_secret|是|应用 secret|
|suite_ticket|是|企业微信后台推送的 ticket|

> 由于第三方服务商可能托管了大量的企业，其安全问题造成的影响会更加严重，故 API 中除了合法来源 IP 校验之外，还额外增加了 suite_ticket 作为安全凭证。  
> 获取 suite_access_token 时，需要 suite_ticket 参数。suite_ticket 由企业微信后台定时推送给“指令回调 URL”，每十分钟更新一次，见推送 [suite_ticket](https://work.weixin.qq.com/api/doc#10982/%E6%8E%A8%E9%80%81suite_ticket)。  
> suite_ticket 实际有效期为 30 分钟，可以容错连续两次获取 suite_ticket 失败的情况，但是请永远使用最新接收到的 suite_ticket。  
通过本接口获取的 suite_access_token 有效期为 2 小时，开发者需要进行缓存，不可频繁获取。

##### 6.2.2 获取推送 suite_ticket

企业微信服务器会定时（每十分钟）推送 ticket。ticket 会实时变更，并用于后续接口的调用。
请求方式：POST（HTTPS）
请求地址：https://api.ninesix.cc/worktile?msg_signature=87276aaf15a13e1eb2ebb6d93732ca668c3ddef8&timestamp=1551850300&nonce=1551051655

在发生授权、通讯录变更、ticket 变化等事件时，企业微信服务器会向应用的“指令回调 URL”推送相应的事件消息，nodejs 接收到的是 xml，解析后拿到 encrypt 字段，然后使用上面配置通用开发参数的 url 时用的解密方式，就可以得到 suite_ticket。

![20190306153526.png](https://i.loli.net/2019/03/06/5c7f783fe1a6a.png)


#### 6.3 获取用户敏感信息

请求方式：POST（HTTPS）
请求地址：https://qyapi.weixin.qq.com/cgi-bin/service/getuserdetail3rd?access_token=SUITE_ACCESS_TOKEN

返回结果：

```json
{
   "errcode": 0,
   "errmsg": "ok",
   "corpid": "wwxxxxxxyyyyy",
   "userid": "lisi",
   "name": "李四",
   "mobile": "15913215421",
   "gender": "1",
   "email": "xxx@xx.com",
   "avatar": "http://shp.qpic.cn/bizmp/xxxxxxxxxxx/0",
   "qr_code": "https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vcfc13b01dfs78e981c"
}
```

### 七、用户授权成功

首页

![home.png](https://i.loli.net/2019/03/06/5c7f79948f89c.png)

详情页

![task-detail.png](https://i.loli.net/2019/03/06/5c7f79d6ae842.png)

### 八、给用户发消息

我们可以给推送文本、图片、视频、文件、图文等类型。

请求方式：POST（HTTPS）
请求地址： https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN

推送的时候需要 access_token 和 应用的 agentId，第三方服务商，可通过接口 [获取企业授权信息](https://work.weixin.qq.com/api/doc#10975/%E8%8E%B7%E5%8F%96%E4%BC%81%E4%B8%9A%E6%8E%88%E6%9D%83%E4%BF%A1%E6%81%AF) 获取该参数值，其实可以直接通过 [获取企业永久授权码](https://work.weixin.qq.com/api/doc#10975/%E8%8E%B7%E5%8F%96%E4%BC%81%E4%B8%9A%E6%B0%B8%E4%B9%85%E6%8E%88%E6%9D%83%E7%A0%81)直接取到这两个值。

在我们测试安装应用成功之后，企业微信会 post 一条请求给指令回调 URL，通过上面的解密方式，可以解析到 xml 中的 auth_code

![20190306190621.png](https://i.loli.net/2019/03/06/5c7fa9b21a549.png)

然后通过`https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=SUITE_ACCESS_TOKEN`和 `auth_code` 可以获取到 access_token 和 agentId，返回的 agent 是一个数组，但仅旧的多应用套件授权时会返回多个agent，对新的单应用授权，永远只返回一个 agent。

再通过 access_token 和 agentId 就可以愉快的给用户发送消息了。

![WechatIMG5.jpg](https://i.loli.net/2019/03/06/5c7fb03f037c3.jpg)

当点击链接时，可以跳到指定任务或者日程等，只不过返回时还是在企业微信的消息模块，并不能自动打开第三方应用，客服回复不支持这么做。

### 九、注意事项

* 本文更新于 2019 年 3 月 6 日，api 可能有时效性，如有差异，以 [官方 api](https://work.weixin.qq.com/api/doc#90001/90142/90594) 为准。
* [完整 demo](https://raw.githubusercontent.com/whyour/yiyanApi/master/server.js)
