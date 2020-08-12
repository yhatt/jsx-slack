// An internal HTML tag and emoji shorthand should not escape
const preventEscapeRegex = /(<.*?>|:[-a-z0-9ÀÁÂÃÄÇÈÉÊËÍÎÏÑÓÔÕÖŒœÙÚÛÜŸßàáâãäçèéêëíîïñóôõöùúûüÿ_＿+＋'\u2e80-\u2fd5\u3005\u3041-\u3096\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcb\uff10-\uff19\uff41-\uff5a\uff61-\uff9f]+:)/

const escapedChar = (char: string) => `\u034f${char}`

export const escapeReplacers = {
  blockquote: (str: string) =>
    str.replace(
      /^((?:<.*?>)*)(&gt;|＞)/gm,
      (_, leading, char) => `${leading}${escapedChar(char)}`
    ),
  bold: (str: string) =>
    str.replace(/\*/g, escapedChar('*')).replace(/＊/g, '\u273b'),
  italic: (str: string) =>
    str.replace(/_/g, escapedChar('_')).replace(/＿/g, escapedChar('＿')),
  code: (str: string) =>
    str.replace(/`/g, escapedChar('`')).replace(/｀/g, escapedChar('｀')),
  strikethrough: (str: string) => str.replace(/~/g, escapedChar('~')),
} as const

const escapeCharsDefaultReplacer = (partial: string) =>
  Object.values(escapeReplacers).reduce((p, fn) => fn(p), partial)

export const escapeChars = (
  mrkdwn: string,
  replacer: (partial: string) => string = escapeCharsDefaultReplacer
) =>
  mrkdwn
    .split(preventEscapeRegex)
    .reduce(
      (acc, str, i) => [...acc, i % 2 ? str : replacer(str)],
      [] as string[]
    )
    .join('')

export const escapeEntity = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const replaceUnmatchedString = (
  str: string,
  capturedMatcher: RegExp,
  replacer: (fragment: string) => string | ConcatArray<string>
) =>
  str
    .split(capturedMatcher)
    .reduce((acc, s, i) => acc.concat(i % 2 ? s : replacer(s)), [] as string[])
    .join('')

export const escapeEverythingContents = (str: string) =>
  replaceUnmatchedString(str, /(<[\s\S]*?>)/, (s) =>
    replaceUnmatchedString(s, /(&\w+;)/, (ss) =>
      [...ss].map((x) => `&#${x.codePointAt(0)};`)
    )
  )

export const decodeEntity = (obj: any) => {
  if (typeof obj === 'string')
    return obj.replace(/&(amp|gt|lt|quot|#\d+);/g, (_, entity: string) => {
      if (entity.startsWith('#'))
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))

      return { amp: '&', gt: '>', lt: '<', quot: '"' }[entity]
    })

  return obj
}
