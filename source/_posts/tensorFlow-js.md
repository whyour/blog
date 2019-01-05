---
title: TensorFlow.js快速入门教程
date: 2018-04-22 15:12:49
tags: [TensorFlow.js, TensorFlow]
---
Google 在TensorFlow Dev Summit 2018上推出了TensorFlow.js，为浏览器中的机器学习（ML）模型打开了大门。这意味着Web开发人员可以做些事情，例如...
1. 构建隐私友好的AI功能。数据永远不会离开客户端，因此您可以构建深度学习模型而无需查看实际数据。
1. 在您的应用中使用预先训练好的Python ML模型。有许多成功的基于Python的模型可以加载到浏览器中，并以最少的代码开始运行预测。
1. 在Firebase云端函数中培训ML模型（当NodeJS支持登陆图书馆时）。 、、、、、
1. 可能还有很多创意开发者会想到的其他东西。
在本例中，我们要做两件事情：（1）从头开始构建和训练一个简单的线性回归模型，（2）导入一个在Python中训练的数字识别器模型，以便从JavaScript应用程序中进行预测。

![](/postImg/tfjs-1.gif)
## 为什么我们应该关心TensorFlow？

TensorFlow是一款用于执行和分配数学运算的令人难以置信的工具，但是如果没有ML的背景和高质量数据的访问权限，它将对您完全无用。这不是魔术。一个成功的算法往往是许多小时的数据准备，探索性分析和实验的结果。

但是我有好消息......你可以使用高度流行的Keras Python库中的预训练模型来做出预测。所以你不需要成为具有博士学位的数据科学家来构建未来的ML驱动应用程序。
## 构建应用程序

首先，我们需要一个应用程序在网络上投放。当然，我将使用Angular CLI生成应用程序，但您可以在本课中使用任何JavaScript Web应用程序中的TensorFlow代码。

我故意忽略了视频中看到的图表和可绘制画布指令的代码，但您可以在源代码中找到它。
### 第1步 - 生成一个角度的应用程序

```bash
npm install -g @angular/cli 
ng tensorflowApp
```

### 第2步 - 安装Tensorflow.js

```bash
cd tensorflowApp 
npm install @tensorflow/tfjs --save
```

## 训练一个基本的TensorFlow.js线性模型

在下面的章节中，我将向您展示如何使用TensorFlow.js进行构建，训练和预测。我们的ML模型只是一个简单的线性回归，它将一维值作为输入，并尝试将一条直线拟合到数据集。
![](/postImg/linear-regression.png)
模型训练完成后，我们会向用户显示一个表单输入，当数值发生变化时会进行新的预测。
![](/postImg/angular-tensorflow-train.gif)

### 第3步 - 导入TensorFlow.js

我将写入所有的代码app.component.ts。注意train()组件初始化时我们如何调用该方法。
```ts
import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({...})
export class AppComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;

  ngOnInit() {
    this.train();
  }


  async train() {
    // todo
  }

  predict(val) {
    // todo
  }
}
```

### 第4步 - 建立机器学习模型
机器学习模型通过迭代多批样本并慢慢优化预测来训练。大多数神经网络使用梯度下降的一些变化作为优化器 - 我们使用随机梯度下降（SGD）来最小化均方误差（MSE）。这是一个非常复杂的领域，可以填满整本书。
```ts
async train(): Promise<any> {
  // Define a model for linear regression.
  this.linearModel = tf.sequential();
  this.linearModel.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  this.linearModel.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


  // Training data, completely random stuff
  const xs = tf.tensor1d([3.2, 4.4, 5.5]);
  const ys = tf.tensor1d([1.6, 2.7, 3.5]);


  // Train
  await this.linearModel.fit(xs, ys)

  console.log('model trained!')
}
```

### 第5步 - 使用模型进行预测
现在我们的模型已经过训练，我们可以给它提供值来进行预测。TensorFlow运行在会话的上下文中，因此我们需要调用dataSyncTensor值来将数据提取到JavaScript中可用的某些内容中。
```js
predict(val: number) {
  const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
  this.prediction = Array.from(output.dataSync())[0]
}
```

当HTML表单输入文件发生更改时，我们可以将此方法作为事件处理程序运行。
```html
TensorFlow says {{ prediction }}

<input type="number" (change)="predict($event.target.value)">
```

## 如何使用预训练的Python Keras模型
训练模式可以是非常CPU和内存密集型的-这就是为什么大部分车型都在训练的高性能图形处理器，可以有效地分发几十亿矩阵的乘法运算。

幸运的是，我们可以使用预先训练好的模型完全绕过这一步。这意味着我们可以直接跳到有趣的部分 - 做出预测。您可以在Kaggle内核上找到各种不同应用程序的模型。

在下面的步骤，我们会基于Keras，卷积神经网络转换成预测从著名的手写数字的值的模型MNIST数据集。 

### 第6步 - 将Keras模型转换为TensorFlow.js

TensorFlow.js有一个Python CLI工具，可将h5保存在Keras中的模型转换为可用于Web的设置文件。通过运行来安装它：   

```bash
pip install tensorflowjs
```

此时，您需要在本地系统上保存Keras模型。如果您为本课复制项目，则可以运行以下命令来生成模型。

```bash
tensorflowjs_converter --input_format keras \
                       keras/cnn.h5 \
                       src/assets
```

目前，我将输出保存在Angular应用程序的assets文件夹中，但TF也可以从URL中读取，因此您还可以将模型文件保存在云存储存储桶中。    

### 第7步 - 加载模型

现在我们加载一个简单的单行程模型。  

```js
async loadModel() {
  this.model = await tf.loadModel('/assets/model.json');
}
```

### 第8步 - 从图像数据进行预测

现在我们的模型已经加载完毕，它期待着四维图像数据的形状[any, 28, 28, 1]- 可以转换为批量，宽度像素，高度像素和颜色通道。一种更简单的方式来思考它只是一个具有单一颜色通道的图像阵列。

我们在tf.tidy中运行我们的预测来清理分配给张量的中间内存。基本上，我们只是想避免内存泄漏。

TensorFlow.js为我们提供了一个fromPixels帮助，可将ImageData HTML对象转换为张量。您还可以使用普通HTMLImageElement或甚至视频。在引擎盖下它将像素变成一个数字的3D矩阵。

```ts
async predict(imageData: ImageData) {

  await tf.tidy(() => {

    // Convert the canvas pixels to a Tensor of the matching shape
    let img = tf.fromPixels(imageData, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    // Make and format the predications
    const output = this.model.predict(img) as any;

    // Save predictions on the component
    this.predictions = Array.from(output.dataSync()); 
  });

}
```

该方法的结果是一个由10个数值组成的数组，总和为1，这是一个称为softmax的预测函数。我们可以使用概率最高的索引作为数字的预测。

根据下面的预测，模型将解释画布上绘制的图像的值为2，置信度为93％。
```js
[0.02, 0.003, 0.93, ...]
```
> 翻译自 [tensorflow-js-app](https://angularfirebase.com/lessons/tensorflow-js-quick-start/)  [source code1](https://github.com/AngularFirebase/97-tensorflowjs-quick-start)  [source code2](https://github.com/whyour/tensorflowApp)

### 相关资料
* [tfjs-converter](https://github.com/tensorflow/tfjs-converter)
* [keras](https://keras.io/)
* [tensorflow](https://www.tensorflow.org/)