/** @jsx JSXSlack.h */
import { JSXSlack } from './jsx'
import { Html } from './utils'

// An internal HTML tag and emoji shorthand should not escape
const preventEscapeRegex = /(<.*?>|:[-a-z0-9ÀÁÂÃÄÇÈÉÊËÍÎÏÑÓÔÕÖŒœÙÚÛÜŸßàáâãäçèéêëíîïñóôõöùúûüÿ_＿+＋'\u2e80-\u2fd5\u3005\u3041-\u3096\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcb\uff10-\uff19\uff41-\uff5a\uff61-\uff9f]+:)/

const generateReplacerForEscape = (fallback: string) => (matched: string) =>
  `<span data-escape="${fallback.repeat(matched.length)}">${matched}</span>`

export const escapeReplacers = {
  blockquote: (partial: string) =>
    partial
      .replace(/^&gt;/gm, c => `\u00ad${c}`)
      .replace(/^＞/gm, generateReplacerForEscape('\u00ad＞')),
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
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const buildAttr = (
  props: { [key: string]: any },
  escapeEntities = true
) => {
  let attr = ''

  for (const prop of Object.keys(props)) {
    if (props[prop] !== undefined) {
      let attrBase = props[prop].toString()
      if (escapeEntities) attrBase = escapeEntity(attrBase)

      attr += ` ${prop}="${attrBase.replace(/"/g, '&quot;')}"`
    }
  }

  return attr
}

export const Escape: JSXSlack.FC<{ children: JSXSlack.Children<{}> }> = props =>
  JSXSlack.h(JSXSlack.NodeType.escapeInHtml, props)

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
