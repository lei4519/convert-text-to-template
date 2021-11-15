interface MatchRecord {
  value: string
  label: string
  var: string
}

const match = (txt: string, reg: RegExp) =>
  [...txt.matchAll(reg)].reduce((res, { groups }) => {
    if (groups) {
      res.push({
        value: groups.value,
        label: groups.label.trim(),
        var: 'var' + groups.value,
      })
    }
    return res
  }, [] as MatchRecord[])

const gen = (record: MatchRecord[], isTS: boolean, isExport: boolean) => {
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

export const translate = (
  txt: string,
  reg: RegExp,
  isTS: boolean,
  isExport: boolean
) => gen(match(txt, reg), isTS, isExport)
