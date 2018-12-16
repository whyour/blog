---
title: css文本背景动画
date: 2018-12-16 20:21:36
tags: [css, animation]
---
本文介绍css中的文本背景动画。
<!-- more -->
### 创建html

```html
// index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="style.css">
  <title>text background animation</title>
</head>
<body>
  <div class="container">
    <h1 class="animated">hello world</h1>
  </div>
</body>
</html>
```

### css文件

```css
body {
  font-family: Arial, Helvetica, sans-serif;
  background: #000;
  color: #fff;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  background: url('https://user-images.githubusercontent.com/22700758/50053518-4f026500-0171-11e9-859f-7cb5217ac40f.png') no-repeat center center/cover;
  height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.animated {
  font-family: 'Charm', cursive;
  margin: 0;
  padding: 0;
  font-size: 6rem;
  background: url('https://user-images.githubusercontent.com/22700758/50053499-3c882b80-0171-11e9-830a-48d727bc0805.png') no-repeat;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: moveBg 90s linear infinite;
  -webkit-animation: moveBg 90s linear infinite;
}

@keyframes moveBg {
  0% {
    background-position: 0% 30%;
  }

  100% {
    background-position: 100% 50%;
  }
}
```