// An internal HTML tag and emoji shorthand should not escape
const preventEscapeRegex =
  /(<[^>]*>|:[-a-z0-9ÀÁÂÃÄÇÈÉÊËÍÎÏÑÓÔÕÖŒœÙÚÛÜŸßàáâãäçèéêëíîïñóôõöùúûüÿ_＿+＋'\u1100-\u11ff\u2e80-\u2fd5\u3005\u3041-\u3096\u30a0-\u30ff\u3130-\u318f\u3400-\u4db5\u4e00-\u9fcb\ua960-\ua97f\uac00-\ud7ff\uff10-\uff19\uff41-\uff5a\uff61-\uff9f]+:)/

const generateReplacerForEscape = (fallback: string) => (matched: string) =>
  `<span data-escape="${fallback.repeat(matched.length)}">${matched}</span>`

export const escapeReplacers = {
  blockquote: (partial: string) =>
    partial
      .replace(
        /^((?:<(?:[^>]|>(?=<))*>)?)(&gt;)/gm,
        (_, leadingTags, character) => `${leadingTags}\u00ad${character}`
      )
      .replace(
        /^((?:<(?:[^>]|>(?=<))*>)?)(＞)/gm,
        (_, leadingTags, character) =>
          `${leadingTags}${generateReplacerForEscape('\u00ad＞')(character)}`
      ),
  bold: (partial: string) =>
    partial
      .replace(/\*+/g, generateReplacerForEscape('\u2217'))
      .replace(/＊+/g, generateReplacerForEscape('\ufe61')),
  italic: (partial: string) =>
    partial
      .replace(/_+/g, generateReplacerForEscape('\u02cd'))
      .replace(/＿+/g, generateReplacerForEscape('\u2e0f')),
  code: (partial: string) =>
    partial
      .replace(/`+/g, generateReplacerForEscape('\u02cb'))
      .replace(/｀+/g, generateReplacerForEscape('\u02cb')),
  strikethrough: (partial: string) =>
    partial.replace(/~+/g, generateReplacerForEscape('\u223c')),
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
    return obj.replace(/&(amp|gt|lt|quot|#\d+);/g, (_, entity) => {
      if (entity.startsWith('#'))
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))

      return { amp: '&', gt: '>', lt: '<', quot: '"' }[entity]
    })

  return obj
}
