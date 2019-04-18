---
title: angular git commit message 规范
date: 2019-04-11 19:28:26
tags: [git]
---
### 目标

* 允许通过脚本生成 CHANGELOG.md
* 允许通过 git 二分查找(git bisect)忽略某些 commits, 比如格式化等一些不重要的 commits
* 当你浏览历史的时候能够提供更好的信息

#### 生成 CHANGELOG.md

我们在 change log 中使用这三部分: new features, bug fixes, breaking changes.当我们发版的时候，这个列表可以通过脚本创建，以及相关提交的链接。当然你正式发版之前也可以编辑这个 change log，但是它可以创建一个框架。

列出从上次发版到现在的所有 subjects(commit message 的第一行)

```bash 
git log <last tag> HEAD --pretty=format:%s
```

在这个 release 的 new feature

```bash
git log <last release> HEAD --grep feature
```

#### 查找不重要的 commits

在 commits 中肯定有一些格式更改，比如添加删除空格、空行，缺少分号和注释等。因此，当你查找 change log 时，你可以忽略这些没有逻辑变更的 commit。
当你查找的时候，你可以通过下面语句忽略

```bash
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

#### 浏览历史的时候提供更多信息

这回增加一些上下文的信息，比如：

* Fix small typo in docs widget (tutorial instructions)
* Fix test for scenario.Application - should remove old iframe
* docs - various doc fixes
* docs - stripping extra new lines
* Replaced double line break with single when text is fetched from Google
* Added support for properties in documentation

这些 messages 尝试说明提交更改的内容，但是它们没有遵循任何约定...
又比如：

* fix comment stripping
* fixing broken links
* Bit of refactoring
* Check whether links do exist and throw exception
* Fix sitemap include (to work on case sensitive linux)

从这些提交信息看，根本猜不出改了什么，虽然你可以通过查看被修改的文件来找到这些信息，但是这很慢。在查看git 历史的时候，我们看到素有人都尝试明确是什么地方发生修改，这是缺少一个约定。

### commit message 的格式化

```html
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

提交信息的任何一行都不能超过 100 字符，这样这些信息就可以在 github 和其他 git 工具上更容易阅读。
一个 commit message 包含一个 header，一个 body，一个 footer，通过空行分隔。

#### Revert

如果一个 commit revert 之前的一个 commit，它的 header 应该以 `revert:` 开始，后面跟着需要还原的提交的 header，在 body 中应该是 `this reverts commit <hash>`，`<hash>`就是要被撤回的 commit 的 SHA 的 hash.

#### Message header

message header 是单独一行，包含这次 change 的简要描述，其中包含一个 type，一个可选的 scope 和 一个 subject。

##### Allowed <type>

这描述了此提交提供的更改类型。

* feat (feature)
* fix (bug fix)
* docs (documentation)
* style (formatting, missing semi colons, ...)
* refactor
* test (when adding missing tests)
* chore (maintain)

##### Allowed <scope>

scope 可以是任何指定提交更改位置的内容，比如$location、$browser、$compile、$rootscope、nghref、ngclick 等。
如果没有合适的scope，你可以使用 *。

##### <subject> text

这是对这次更改的一个非常简短描述。

* 使用命令式语法，现在时态，“change” 不是 “changed” 也不是 “changes”
* 首字母不大写
* 结尾不加点

#### Message body

包含改变的原因，以及与以前的行为进行对比。

#### Message footer

##### Breaking changes

所有的 breaking changes 都应该在 breaking change 块中提到，而且都应以单词 `BREAKING CHANGE`开始，breaking changes 之间使用空格或者两个换行符，提交消息的其余部分是对更改、理由和迁移说明的描述。

```json
BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.
    
    To migrate the code follow the example below:
    
    Before:
    
    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }
    
    After:
    
    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }
    
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

##### Referencing issues

关闭 bugs 应该在 footer 中以关键词`Closes`开始在一行列出，比如：

```bash
Closes #234
Closes #234, #123, #567
```

### How to use

[Commitizen](https://github.com/commitizen/cz-cli)是一个可视化撰写 commit message 的工具。

[Validate-commit-msg](https://github.com/angular/angular/blob/master/tools/validate-commit-message/validate-commit-message.js) 用于检查 Node 项目的 Commit message 是否符合格式。

### Examples

* [angular validate-commit-message.js](https://github.com/angular/angular/blob/master/tools/validate-commit-message/validate-commit-message.js)
* [angular commit-message.json](https://github.com/angular/angular/blob/master/tools/validate-commit-message/commit-message.json)
* [angular-ui validate-commit-message.js](https://github.com/angular-ui/bootstrap/blob/master/misc/validate-commit-msg.js)

### Reference

* [Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)
* [git bisect](https://git-scm.com/docs/git-bisect)