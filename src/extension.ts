import {
  window,
  ExtensionContext,
  commands,
  workspace,
  SnippetString,
} from 'vscode'
import { translate } from './translate'

const errorTips = (txt: string) => {
  window.showErrorMessage(txt)
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(
    'TextToTemplate.translate',
    () => {
      const editor = window.activeTextEditor

      if (!editor) {
        return errorTips('未选中文本')
      }

      const document = editor.document
      const selection = editor.selection
      const word = document.getText(selection)

      if (!word.trim()) {
        return errorTips('未选中文本')
      }

      const config = workspace.getConfiguration('TextToTemplate')

      let reg

      try {
        reg = new RegExp(config.get('RegExp', ''), 'g')
      } catch (error) {
        return errorTips('正则表达式配置错误')
      }

      const asConst = config.get('TsAsConst', true)

      const snippet = translate(
        word,
        reg,
        asConst && document.languageId.includes('typescript'),
        config.get<boolean>('Export', true)
      )

      if (!snippet.trim()) {
        return errorTips('未匹配成功')
      }

      editor.insertSnippet(
        new SnippetString(snippet),
        selection.end.with(selection.end.line + 1, 0)
      )
    }
  )

  context.subscriptions.push(disposable)
}
