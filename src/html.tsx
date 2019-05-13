/** @jsx JSXSlack.h */
import formatDate from './date'
import { JSXSlack, ParseContext } from './jsx'
import { Html } from './utils'

const spLinkMatcher = /^((#C|@[US])[A-Z0-9]{8}|@(here|channel|everyone))$/

export const escapeEntity = (str: string) =>
  str
    .replace(/&(?!(?:amp|lt|gt);)/g, '&amp;')
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

export const parse = (
  name: string,
  props: Record<string, any>,
  children: any[],
  context: ParseContext
) => {
  const parents = context.elements.slice(0, -1)

  const text = () => children.join('')
  const isInside = (...elements: string[]) =>
    elements.some(e => parents.includes(e))

  if (name === 'br') return '<br />'
  if (isInside('code', 'pre')) return text()

  switch (name) {
    case 'b':
    case 'strong':
      if (isInside('b', 'strong', 'time')) return text()

      return `<b>${text()
        .replace(/\*/g, '\u2217')
        .replace(/＊/g, '\ufe61')}</b>`
    case 'i':
    case 'em':
      if (isInside('i', 'em', 'time')) return text()

      return `<i>${text()
        .replace(/_/g, '\u02cd')
        .replace(/＿/g, '\u2e0f')}</i>`
    case 's':
    case 'strike':
    case 'del':
      if (isInside('s', 'strike', 'del', 'time')) return text()
      return `<s>${text().replace(/~/g, '\u223c')}</s>`
    case 'code':
      if (isInside('time')) return text()
      return `<code>${text().replace(/[`｀]/g, '\u02cb')}</code>`
    case 'p':
      return isInside('p') ? text() : `<p>${text()}</p>`
    case 'blockquote': {
      if (isInside('blockquote', 'ul', 'ol', 'time')) return text()

      const bq = text().replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
      const tag = isInside('a') ? 'q' : 'blockquote'

      return `<${tag}>${bq}</${tag}>`
    }
    case 'pre':
      if (isInside('ul', 'ol', 'time')) return text()
      return `<pre><code>${text().replace(/`{3}/g, '``\u02cb')}</code></pre>`
    case 'a': {
      if (isInside('a', 'time')) return text()

      let content = text()

      // Prevent vanishing special link used as void element
      if (!content && props.href && spLinkMatcher.test(props.href))
        content = 'sp'

      return `<a${buildAttr(props)}>${content}</a>`
    }
    case 'time': {
      const dateInt = Number.parseInt(props.datetime, 10)
      const date = new Date(
        Number.isNaN(dateInt) ? props.datetime : dateInt * 1000
      )
      const datetime = Math.floor(date.getTime() / 1000)
      const format = text().replace(/\|/g, '\u01c0')
      const fallback = props.fallback || formatDate(date, format)
      const attrs = buildAttr({
        datetime,
        'data-fallback': fallback.replace(/\|/g, '\u01c0'),
      })

      return `<time${attrs}>${format}</time>`
    }
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

export const escapeChars = (mrkdwn: string) =>
  mrkdwn
    .replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
    .replace(/\*/g, '\u2217')
    .replace(/＊/g, '\ufe61')
    .replace(/_/g, '\u02cd')
    .replace(/＿/g, '\u2e0f')
    .replace(/[`｀]/g, '\u02cb')
    .replace(/~/g, '\u223c')

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
