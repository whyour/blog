---
title: TLS 1.3 is coming
date: 2018-05-24 14:04:14
tags: ['TLS','TLS1.3']
---
### 什么是TLS 1.3 ？
> `TLS 1.3`就是`TLS`的升级版本，TLS是一种为了互联网通信安全保障的一种安全协议，称为`传输层安全性协议`(Transport Layer Security)。

截至2018年3月21日，TLS 1.3是一个已经成为建议标准（Proposed Standard）[10]的互联网草案[11]。它基于更早的TLS 1.2规范，与TLS 1.2的主要区别包括：
* 将密钥协商和认证算法从密码包中分离出来。
* 移除脆弱和较少使用的命名椭圆曲线支持
* 移除MD5和SHA-224密码散列函数的支持
* 请求数字签名，即便使用之前的配置
* 集成HKDF和半短暂DH提议
* 替换使用PSK和票据的恢复
* 支持1-RTT握手并初步支持0-RTT
* 通过在(EC)DH密钥协议期间使用临时密钥来保证完善的前向安全性。
* 放弃许多不安全或过时特性的支持，包括数据压缩、重新协商、非AEAD密码本、静态RSA和静态DH密钥交换、自定义DHE分组、点格式协商、更改密码本规范的协议、UNIX时间的Hello消息，以及长度字段AD输入到AEAD密码本
* 禁止用于向后兼容性的SSL和RC4协商
* 集成会话散列的使用
* 弃用记录层版本号和冻结数以改进向后兼容性
* 将一些安全相关的算法细节从附录移动到标准，并将ClientKeyShare降级到附录
* 添加带有Poly1305消息验证码的ChaCha20流加密
* 添加Ed25519和Ed448数字签名算法
* 添加x25519和x448密钥交换协议

> 因为本博使用的是nginx，所以要先把openssl升级到1.1.1，目前的版本是1.1.0，所以只要编译安装openssl就可以，不需要编译nginx，目前chrome支持的是draft23，发文时间截止适用openssl1.1.1 pre2，进入服务器任意目录，执行如下命令
```bash
curl https://www.openssl.org/source/old/1.1.1/openssl-1.1.1-pre2.tar.gz
tar -zxf openssl-1.1.1-pre2.tar.gz
cd  openssl-1.1.1-pre2
./config  --prefix=/usr/local --openssldir=/usr/local/ssl
make
make install
```
如果/usr/local下没有ssl文件夹，要自己新建一个ssl文件夹`mkdir ssl`

查看openssl版本

```bash
openssl version -a
```

`debian`或者`Ubuntu`下安装`nginx`最新`stable`版，要先把`nginx`的包地址

```bash
deb http://nginx.org/packages/debian/ stretch nginx
deb-src http://nginx.org/packages/debian/ stretch nginx
```
加入服务器`source.list`,我的是`debian`在`/etc/apt/source.list`，然后执行

```bash
apt update
apt install nginx
```
然后查看nginx版本`nginx -V`，结果如下图：
![nginx-version.jpg](https://i.loli.net/2019/01/05/5c30cee3b9ad9.jpg)
最后修改nginx配置文件，在443端口server中添加如下内容：

> ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+ECDSA+AES128:EECDH+aRSA+AES128:RSA+AES128:
>             EECDH+ECDSA+AES256:EECDH+aRSA+AES256:RSA+AES256:
>             EECDH+ECDSA+3DES:EECDH+aRSA+3DES:RSA+3DES:!MD5;
> ssl_protocols TLSv1.2 TLSv1.3;

另外，chrome要进入`chrome://flags`，搜索tls，选择 enabled(draft23)

开启前截图
![tls1-2.jpg](https://s2.ax1x.com/2019/01/06/FHC540.jpg)
开启后截图
![tls1-3.jpg](https://s2.ax1x.com/2019/01/06/FHCoCV.jpg)

### 参考资料
* [传输层安全性协议](https://zh.wikipedia.org/wiki/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E6%80%A7%E5%8D%94%E5%AE%9A)
* [低版本openssl开启tls1.3](https://imququ.com/post/enable-tls-1-3.html)