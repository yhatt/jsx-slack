/** @jsx JSXSlack.h */
import { JSXSlack, ParseContext } from './jsx'
import { Html, ArrayOutput } from './utils'

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
  const wrap = (char: string, contents: string = text()) => {
    // In exact mode, we add zero-width space around markup character to apply
    // formatting exactly.
    const wc = JSXSlack.exactMode() ? `\u200b${char}\u200b` : char

    return `${wc}${contents}${wc}`
  }
  const isInside = (...elements: string[]) =>
    elements.some(e => parents.includes(e))

  if (isInside('code', 'pre')) return text()

  switch (name) {
    case 'b':
    case 'strong':
      if (isInside('b', 'strong')) return text()

      return wrap(
        '*',
        text()
          .replace(/\*/g, '\u2217')
          .replace(/＊/g, '\ufe61')
      )
    case 'i':
    case 'em':
      if (isInside('i', 'em')) return text()

      return wrap(
        '_',
        text()
          .replace(/_/g, '\u02cd')
          .replace(/＿/g, '\u2e0f')
      )
    case 's':
    case 'del':
      if (isInside('s', 'del')) return text()
      return wrap('~', text().replace(/~/g, '\u223c'))
    case 'br':
      return '\n'
    case 'p':
      return isInside('p') ? text() : `<<p>>${text()}<</p>>`
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export const postprocess = (mrkdwn: string) =>
  mrkdwn
    .replace(/^(\n*)<<p>>/, (_, s) => s)
    .replace(/\n{0,2}<<p>>/g, '\n\n')
    .replace(/<<\/p>>(\n*)$/, (_, s) => s)
    .replace(/<<\/p>>\n{0,2}/g, '\n\n')

export const escapeChars = (mrkdwn: string) =>
  mrkdwn
    .replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
    .replace(/\*/g, '\u2217')
    .replace(/＊/g, '\ufe61')
    .replace(/_/g, '\u02cd')
    .replace(/＿/g, '\u2e0f')
    .replace(/[`｀]/g, '\u02cb')
    .replace(/~/g, '\u223c')

export const Escape: JSXSlack.FC<{ children: JSXSlack.Children<{}> }> = props =>
  JSXSlack.h(JSXSlack.NodeType.escapeInHtml, props)

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
