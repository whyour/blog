---
title: mac terminal快捷键
date: 2018-04-02 14:45:40
tags: [mac, terminal]
---
ctrl + a/e 回到命令行的开头和结尾
ctrl + u/k 剪切光标前/后 所有单词
单词为单位移动：option + 方向键

<!-- more -->

ctrl + y 撤销上个操作
ctrl + w 删除光标前一个单词
ctrl + b/f 光标向前/后移动一个位置
ctrl + h 删除光标位置的前一个字符

history 显示使用过的命令

第一次按时，移动光标至行首；再次按时，回到原有位置	CTRL+X
删除光标前一个字符，即退格（Backspace）	CTRL+H
删除光标后一个字符，（相当于Delete）无任何字符时相当于exit	CTRL+D
删除光标前所有字符	CTRL+U
删除光标后所有字符；纵向制表符，在脚本中下移一行，用/x0b表示	CTRL+K
删除光标前一个单词（根据空格识别单词分隔）	CTRL+W
粘贴之前（CTRL+U/K/W）删除的内容	CTRL+Y
清屏，相当于指令“clear”	CTRL+L
查找并自动匹配之前使用过的指令	CTRL+R
回车，相当于Enter	CTRL+M
跳到新行，等同于回车	CTRL+O
新起一行，命令行下等同于回车	CTRL+J
横行制表符，在命令行中补齐指令，效果和Tab键相同	CTRL+I
补齐指令	TAB
上一条指令，等同于向上箭	CTRL+P
下一条指令，等同于向下箭	CTRL+N
使下一个特殊字符可以插入在当前位置,如CTRL-V 可以在当前位置插入一个字符,其ASCII是9, 否则一般情况下按结果是命令补齐	CTRL+V
中断操作	CTRL+C
冻结终端操作（暂停脚本）	CTRL+S
恢复冻结（继续执行脚本）	CTRL+Q
使下一个单词首字母大写, 同时光标前进一个单词,如光标停留在单词的某个字母上,如word中的o字母上, 则o字母变大写. 而不是w	ESC+C
使下一个单词所有字母变大写, 同时光标前进一个单词；如光标在o字母上, 则ord变大写, w不变.	ESC+U
使下一个单词所有字母变小写, 同时光标前进一个单词；如光标在o字母上, 则ord变小写, w不变.	ESC+I
将光标处的字符和光标前一个字符替换位置	CTRL+T
重复运行最近一条以“word”开头的指令，如!ls 或 !l	!word
调用上一条指令的最后一个参数作为当前指令对象,如，假设上一条指令为： ls abc.txt bbc.txt 那么， vi !$ 相当于： vi bbc.txt	!$
调用执行指定编号的历史记录指令,如!2, !11

![ico原来的样子](/postImg/terminal.png)