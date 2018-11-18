---
title: 博文摘要生成方案
date: 2018-11-18 21:21:55
tags: [hexo]
---

### npm模块（按长度截取）

npm模块基本都是按照字数截取，你可以设置要固定长度的文章设为摘要，但是对于代码片段来说很不方便。
[hexo-auto-excerpt](https://www.npmjs.com/package/hexo-auto-excerpt)
[hexo-excerpt](https://www.npmjs.com/package/hexo-excerpt)

```bash
npm install --save hexo-auto-excerpt
```

博客根目录安装，然后在主题配置文件中配置`excerpt_length`即可。

### 自定义按行数截取

第二种我们可以按照文章的行数截取，这就要求你在前面几行写出文章的概要。具体实现需要更改下`ejs`模板，本主题需要修改`layout/_partial/article.ejs`，在`div.article-entry`中添加如下代码:

```html

<% if (index){ %>
    <% if (post.excerpt) { %>
        <%- post.excerpt %>
    <% } else if (theme.auto_excerpt.enable) { %>
        <% var br_position = 0 %>
        <% for (var br_count = 0; br_count < theme.auto_excerpt.lines; br_count++) { %>
            <% br_position = post.content.indexOf('\n',br_position + 1) %>
            <% if(br_position < 0) { break } %>
        <% } %>
        <% if(br_position > 0) { %>
            <% show_all_content = false %>
            <p><%- post.content.substring(0, br_position + 1) %><p>
        <% } %>
    <% } %>
    <% } else { %>
    <%- partial('toc', { post: post}) %>
    <%- post.content %>
<% } %>

```

主题中的配置文件增加如下行：

```

auto_excerpt:
    enable: true
    lines: 3

```

这样每篇博文的前三行就会被截取为博文的摘要。

### 使用hexo read more标识

在博文中你想要截取的地方添加`<!-- more -->`即可。这样在本标识之前的就为博文摘要。