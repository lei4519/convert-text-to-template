# TextToTemplate README

将枚举文本转换为 ts/js 的 const 枚举结构

默认的正则表达式：`/((?<num>\d+)[^\u4e00-\u9fa5]*?(?<val>[\u4e00-\u9fa5][^\d]*))/g`

## Features

![setup](setup.gif)

## Extension Settings

This extension contributes the following settings:

* `TextToTemplate.RegExp`:  自定义匹配文本的正则表达式：`groups.value` 表示数字部分，`groups.label` 表示汉字部分
* `TextToTemplate.Export`:  生成 `export`
* `TextToTemplate.TsAsConst`: TS 文件中生成 `as const`

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

<!-- ## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!** -->
