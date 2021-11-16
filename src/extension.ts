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
    'ConvertTextToTemplat.translate',
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

      const config = workspace.getConfiguration('ConvertTextToTemplat')

      const template: Record<string, string> = config.get('Template', {})

      const keys = Object.keys(template)

      if (keys.length === 0) {
        return errorTips('未配置模板')
      }

      let reg

      const map = keys.map((key, i) => {
        const splitIdx = key.indexOf('@')
        const r = {
          name: '',
          reg: null as RegExp | null,
          fn: (() => '') as Function
        }
        if (splitIdx === -1) {
          r.name = `untitle${i}`
          try {
            r.reg = new RegExp(key)
          } catch { }
        } else {
          r.name = key.substring(0, splitIdx)
          try {
            r.reg = new RegExp(key.substring(splitIdx + 1))
          } catch { }
        }
        try {
          r.fn = new Function(template[key])
        } catch {}
      })

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
