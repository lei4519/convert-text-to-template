import { template as _t } from "underscore"
import { window } from "vscode"

type Groups = Record<string, string>[]

export interface Template {
  name: string
  reg: RegExp | null
  template: string
}

const match = (txt: string, reg: RegExp) =>
  [...txt.matchAll(reg)].reduce((res, { groups }) => {
    if (groups) {
      res.push(groups)
    }
    return res
  }, [] as Groups)

const gen = (groups: Groups, { template }: Template) => {
  if (groups.length === 0) {
    return ""
  }
  try {
    return _t(template)({ groups })
  } catch (e: any) {
    window.showErrorMessage(`ConvertTextToTemplate Error: ${e.message || e}`)
  }
}

export const translate = (txt: string, template: Template) => {
  const groups = match(txt, template.reg!)
  return gen(groups, template)
}
