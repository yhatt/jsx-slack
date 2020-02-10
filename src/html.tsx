/** @jsx JSXSlack.h */
import he from 'he'
import formatDate from './date'
import { JSXSlack, ParseContext } from './jsx'
import { Html, detectSpecialLink } from './utils'

const emojiShorthandRegex = /(:[-a-z0-9ÀÁÂÃÄÇÈÉÊËÍÎÏÑÓÔÕÖŒœÙÚÛÜŸßàáâãäçèéêëíîïñóôõöùúûüÿ_＿+＋'\u2e80-\u2fd5\u3005\u3041-\u3096\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcb\uff10-\uff19\uff41-\uff5a\uff61-\uff9f]+:)/

export const escapeEntity = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const buildAttr = (props: { [key: string]: any }) => {
  let attr = ''

  for (const prop of Object.keys(props)) {
    if (props[prop] !== undefined) {
      const s = escapeEntity(props[prop].toString()).replace(/"/g, '&quot;')
      attr += ` ${prop}="${s}"`
    }
  }

  return attr
}

const escapeCharsDefaultReplacer = (partial: string) =>
  partial
    .replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
    .replace(/\*/g, '\u2217')
    .replace(/＊/g, '\ufe61')
    .replace(/_/g, '\u02cd')
    .replace(/＿/g, '\u2e0f')
    .replace(/[`｀]/g, '\u02cb')
    .replace(/~/g, '\u223c')

export const escapeChars = (
  mrkdwn: string,
  replacer: (partial: string) => string = escapeCharsDefaultReplacer
) =>
  mrkdwn
    .split(emojiShorthandRegex)
    .reduce(
      (acc, str, i) => [...acc, i % 2 === 1 ? str : replacer(str)],
      [] as string[]
    )
    .join('')

export const parse = (
  name: string,
  props: Record<string, any>,
  children: any[],
  context: ParseContext
) => {
  const parents = context.elements.slice(0, -1)

  const text = () => children.join('')

  const isChild = (...elements: string[]) =>
    parents.length > 0 && elements.some(e => e === parents[parents.length - 1])

  const isDescendant = (...elements: string[]) =>
    elements.some(e => parents.includes(e))

  if (name === 'br') return '<br />'
  if (isChild('pre', 'code') && !['a', 'time'].includes(name)) return text()

  switch (name) {
    case 'b':
    case 'strong':
      if (isDescendant('b', 'strong', 'time')) return text()

      return `<b>${text()
        .replace(/\*/g, '\u2217')
        .replace(/＊/g, '\ufe61')}</b>`
    case 'i':
    case 'em':
      if (isDescendant('i', 'em', 'time')) return text()

      // Underscores have to avoid escaping in emoji shorthand
      return `<i>${escapeChars(text(), t =>
        t.replace(/_/g, '\u02cd').replace(/＿/g, '\u2e0f')
      )}</i>`
    case 's':
    case 'strike':
    case 'del':
      if (isDescendant('s', 'strike', 'del', 'time')) return text()
      return `<s>${text().replace(/~/g, '\u223c')}</s>`
    case 'code':
      if (isDescendant('time')) return text()
      return `<code>${text().replace(/[`｀]/g, '\u02cb')}</code>`
    case 'p':
      return isDescendant('p') ? text() : `<p>${text()}</p>`
    case 'blockquote': {
      if (isDescendant('blockquote', 'ul', 'ol', 'time')) return text()

      const bq = text().replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
      const tag = isDescendant('a') ? 'q' : 'blockquote'

      return `<${tag}>${bq}</${tag}>`
    }
    case 'pre':
      if (isDescendant('ul', 'ol', 'time')) return text()
      return `<pre><code>${text().replace(/`{3}/g, '``\u02cb')}</code></pre>`
    case 'a': {
      if (isDescendant('a', 'time')) return text()

      let content = text()

      // Prevent vanishing special link used as void element
      if (!content && props.href && detectSpecialLink(props.href) !== undefined)
        content = 'specialLink'

      return `<a${buildAttr(props)}>${content}</a>`
    }
    case 'time': {
      const dateInt = Number.parseInt(props.datetime, 10)
      const date = new Date(
        Number.isNaN(dateInt) ? props.datetime : dateInt * 1000
      )
      const datetime = Math.floor(date.getTime() / 1000)
      const format = text().replace(/\|/g, '\u01c0')
      const fallback = props.fallback || formatDate(date, he.decode(format))
      const attrs = buildAttr({
        datetime,
        'data-fallback': fallback.replace(/\|/g, '\u01c0'),
      })

      return `<time${attrs}>${format}</time>`
    }
    case 'small':
    case 'span':
    case 'ul':
    case 'li':
      return `<${name}>${text()}</${name}>`
    case 'ol':
      return `<ol${buildAttr(props)}>${text()}</ol>`
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export const Escape: JSXSlack.FC<{ children: JSXSlack.Children<{}> }> = props =>
  JSXSlack.h(JSXSlack.NodeType.escapeInHtml, props)

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
