import {
  window,
  ExtensionContext,
  commands,
  workspace,
  SnippetString,
} from "vscode"
import { Template, translate } from "./translate"

const errorTips = (txt: string) => {
  window.showErrorMessage(txt)
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(
    "ConvertTextToTemplate.translate",
    () => {
      const editor = window.activeTextEditor

      if (!editor) {
        return errorTips("未选中文本")
      }

      const document = editor.document
      const selection = editor.selection
      const word = document.getText(selection)

      if (!word.trim()) {
        return errorTips("未选中文本")
      }

      const config = workspace.getConfiguration("ConvertTextToTemplate")

      const template: Record<string, string> = config.get("Template", {})

      const keys = Object.keys(template)

      if (keys.length === 0) {
        return errorTips("未配置模板")
      }

      const templates: Template[] = keys.map((key, i) => {
        const splitIdx = key.indexOf("@")
        const r: Template = {
          name: "",
          reg: null as RegExp | null,
          template: template[key] || "",
        }

        if (splitIdx === -1) {
          r.name = `untitle${i}`
          try {
            r.reg = new RegExp(key, "gms")
          } catch {}
        } else {
          r.name = key.substring(0, splitIdx)
          try {
            r.reg = new RegExp(key.substring(splitIdx + 1), "gms")
          } catch {}
        }
        return r
      })

      const promise =
        templates.length === 1
          ? Promise.resolve(templates[0])
          : window
              .showQuickPick(
                templates.map(({ name }) => name),
                { placeHolder: " Place choose convert template" }
              )
              .then((name) => {
                return templates.find((t) => t.name === name)!
              })

      promise.then((template) => {
        if (!template.reg) {
          return errorTips("所选模板正则表达式配置错误")
        }
        if (!template.template) {
          return errorTips("所选模板，模板内容配置为空")
        }

        const snippet = translate(word, template)
        if (!snippet?.trim()) {
          return errorTips("未匹配成功")
        }

        editor.insertSnippet(
          new SnippetString(snippet),
          selection.end.with(selection.end.line + 1, 0)
        )
      })
    }
  )

  context.subscriptions.push(disposable)
}
