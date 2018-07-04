---
title: 如何用nodejs和mongodb写一个的api
date: 2018-06-30 16:39:26
tags: ['nodejs','mongodb','restful']
---
### 先给vps上装上`nodejs`和`mongodb`
```bash
apt install nodejs
apt install mongodb
```
### 写一个用express框架的，node server，用koa也一样
#### 创建一个mongoose scheme,相当于存入数据库的数据结构模型
```typescript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('yiYan', new Schema({
    content: String,
    from: String,
    type: String,
    creator: String,
    yid: String,
    created_at: {type: Number, default: (Date.now()/1000).toPrecision(10)}
}));
```
#### 创建一个node server
```nodejs
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var config = require('./config'); //读取配置文件config.js信息
var Yiyan = require('./app/models/yiyan'); //获取 yiyan model 信息
var port = process.env.PORT || 8080; // 设置启动端口
// 设置response头信息
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://ninesix.cc');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API 路由 -------------------
app.get('/yiyan', function (req, res) {

    Yiyan.aggregate([{ $sample: { size: 1 } }], function (err, data) {
        if (err) throw err;
        res.send({ code: 200, data: data[0] });
    });

});

app.get('/yi', function (req, res) {

    var user = new Yiyan({
        content: "这是一个测试内容",
        from: "hunter",
        type: "e",
        creator: "hunter",
        yid: "12345"
    });

    user.save(function (err, data) {
        res.send(data);
    });

});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
```
#### 设置mongodb服务器配置
```typescript
module.exports = {
    'database': 'mongodb://用户名:密码@服务器IP:27017/collection名'
};
```
### 启动服务
```bash
node server.js
```
> 完整源码 [node api](https://github.com/whyour/yiyanApi.git)
> 我的api [yiyan](https://api.ninesix.cc/yiyan)