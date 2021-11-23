# ConvertTextToTemplate README

通过正则匹配文本，并转换为模板（支持自定义正则和模板）。

## Features

![setup](setup.gif)


## 默认的正则表达式

```js
// 匹配 [数字 非中文 中文] 格式
/((?<value>\d+)[^\u4e00-\u9fa5]*?(?<label>[\u4e00-\u9fa5][^\d]*))/g
```

## 默认的转换模板

```js
// 文字 1 状态

// 上面的文字会生成下面的代码

export const VAR = {
  var0: 1
}

export const VAR_TEXT = {
  [VAR.var0]: '状态'
}
```

## 自定义模板

这个插件只负责正则匹配和模板字符串的生成，所以你可以自定义配置任何类型、语言的模板。

注意 vscode 插件是 js 语言编写，所以正则和模板都是 js 语言的。

进入 vscode 配置项： `ConvertTextToTemplate.Template`，进行模板配置

此配置项是一个对象，对象的键中包含模板名称和正则表达式，对象值是模板字符串，下面一一细说

### 键

键由两部分组成：`模板名称@正则表达式`，由 `@` 符号进行分割。

### 正则的编写

打开 chrome 控制台，找到 console 面板，在里面尝试编写你的正则表达式

![](https://gitee.com/lei451927/picture/raw/master/images/20211120144840.png)

可能你没有 js 语言的基础，所以对于上面的代码简单说一下

- 第一行语句自然是创建一个正则表达式的实例，详见[Regular](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- 第二行语句稍微复杂一点
  - `'1 状态，2 状态，3 状态'.matchAll(r)` 会把字符串中的所有匹配项找出来，并返回一个 `Iterator`
  - `[...Iterator]` 会把 `Iterator` 变为数组
  - `.map(r => r.groups)` 将数组中每一项的 `groups` 提取出来，映射为另一数组
  - 最后就是返回值所显示的部分，所有的匹配项数组 `groups`，**而这也正是模板中用到的 `groups`**

一旦你编写测试好了正则表达式，就可以把对象的键构造出来了，比如模板名称叫 `default`，如下
```
{
  "default@((?<value>\\d+)[^\\u4e00-\\u9fa5]*?(?<label>[\\u4e00-\\u9fa5][^\\d]*))": ""
}
```

### 模板的编写

模板的解析使用了 [underscore.template](https://underscorejs.org/#template)，所以你可以在里面使用相应的模板语法

打开上面的网址，同样进入控制台，输入下面的代码，生成的字符串就是将会插入到编辑器中的字符。

```js
_.template(`export const \${1:VAR_NAME} = {
<% groups.forEach(({value}, i) => { %>
  \${<%= i + 2 %>:var<%= i %>}: <%= value %>,
<% }); %>
}

export const $1_TEXT = {
<% groups.forEach(({label}, i) => { %>
  [$1.$<%= i + 2 %>]: <%= label %>,
<% }); %>
}`)({groups: [{label: "状态", value: 1}] })
```

字符会以 [vscode snippet](https://code.visualstudio.com/api/language-extensions/snippet-guide) 的形式插入到编辑器中，所以你可以写合法的 snippet 片段。

一旦你写好了模板，就可以将其放入值的部分，以下就是默认模板的配置。

```js
{
  "default@((?<value>\\d+)[^\\u4e00-\\u9fa5]*?(?<label>[\\u4e00-\\u9fa5][^\\d]*))": "export const ${1:VAR_NAME} = {\n<% groups.forEach(({value}, i) => { %>\t${<%= i + 2 %>:var<%= i %>}: <%= value %>,\n<% }); %>}\n\nexport const $1_TEXT = {\n<% groups.forEach(({label}, i) => { %>\t[$1.$<%= i + 2 %>]: \"<%= label.trim() %>\",\n<% }); %>}"
}
```

## Extension Settings

This extension contributes the following settings:

* `ConvertTextToTemplate.Template`:  自定义匹配文本的转换方式