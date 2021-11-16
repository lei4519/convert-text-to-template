# ConvertTextToTemplat README

通过正则匹配文本，并转换为模板（支持自定义模板）。

## 默认的正则表达式

```js
/((?<num>\d+)[^\u4e00-\u9fa5]*?(?<val>[\u4e00-\u9fa5][^\d]*))/g
```

## 默认的模板

`record` 表示匹配到的文本数组，`var`、`value` 是正则捕获组的名称。

其余的参数是插件的配置项。

返回的是 [vscode snippet](https://code.visualstudio.com/api/language-extensions/snippet-guide)

```js
(record: MatchRecord[], isTS: boolean, isExport: boolean) => {
  if (record.length === 0) {
    return ''
  }

  const exportToken = isExport ? 'export ' : ''
  const constToken = isTS ? ' as const' : ''

  return `\n${exportToken}const \${1:VAR_NAME} = {
  ${record.map((r, i) => `\${${i + 2}:${r.var}}: ${r.value}`).join(',\n\t')}
}${constToken}
${exportToken}const $1_TEXT = {
  ${record
    .map((r, i) => `[$1.\${${i + 2}}]: ${JSON.stringify(r.label)}`)
    .join(',\n\t')}
}${constToken}\n$0`
}
```

## 模板配置

 配置项 `ConvertTextToTemplat.Template`

 配置对象的键值对，键格式为 `模板名称@正则表达式`，值为返回模板的函数体字符串（new Function）

```js
// 默认配置, 函数体字符串经过了压缩，实际就是上面的默认模板函数体
{
  "default@((?<value>\\d+)[^\\u4e00-\\u9fa5]*?(?<label>[\\u4e00-\\u9fa5][^\\d]*))": "(record,isTS,isExport)=>{if(record.length===0){return''}const exportToken=isExport?'export ':''const constToken=isTS?' as const':''return`\\n${exportToken}const\\${1:VAR_NAME}={${record.map((r,i)=>`\\${${i+2}:${r.var}}:${r.value}`).join(',\\n\\t')}}${constToken}${exportToken}const $1_TEXT={${record.map((r,i)=>`[$1.\\${${i+2}}]:${JSON.stringify(r.label)}`).join(',\\n\\t')}}${constToken}\\n$0`}"
}
```

## Features

![setup](setup.gif)

## Extension Settings

This extension contributes the following settings:

* `ConvertTextToTemplat.Template`:  自定义匹配文本的正则表达式：`groups.value` 表示数字部分，`groups.label` 表示汉字部分
* `ConvertTextToTemplat.Export`:  生成 `export`
* `ConvertTextToTemplat.TsAsConst`: TS 文件中生成 `as const`

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
