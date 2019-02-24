/** @jsx JSXSlack.h */
import { JSXSlack, ParseContext } from './jsx'
import { Html } from './utils'

export const escapeEntity = (str: string) =>
  str
    .replace(/&(?!(?:amp|lt|gt);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const parse = (
  name: string,
  props: object,
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
      if (isInside('b', 'strong')) return text()

      return `<b>${text()
        .replace(/\*/g, '\u2217')
        .replace(/＊/g, '\ufe61')}</b>`
    case 'i':
    case 'em':
      if (isInside('i', 'em')) return text()

      return `<i>${text()
        .replace(/_/g, '\u02cd')
        .replace(/＿/g, '\u2e0f')}</i>`
    case 's':
    case 'strike':
    case 'del':
      if (isInside('s', 'strike', 'del')) return text()
      return `<s>${text().replace(/~/g, '\u223c')}</s>`
    case 'code':
      return `<code>${text().replace(/[`｀]/g, '\u02cb')}</code>`
    case 'p':
      return isInside('p') ? text() : `<p>${text()}</p>`
    case 'blockquote': {
      if (isInside('blockquote')) return text()

      const bq = text().replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
      return `<blockquote>${bq}</blockquote>`
    }
    case 'pre':
      return `<pre><code>${text().replace(/`{3}/g, '``\u02cb')}</code></pre>`
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
