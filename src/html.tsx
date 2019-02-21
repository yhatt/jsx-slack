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

      // We use full-width char as primary markup character. It won't require
      // spaces around, and can show defined markup in JSX exactly with
      // regardless around text contexts.
      return wrap(text().indexOf('＊') > -1 ? '*' : '＊')
    case 'i':
    case 'em':
      if (isInside('i', 'em')) return text()

      // As same as bold markup, the primary markup is full-width char.
      return wrap(text().indexOf('＿') > -1 ? '_' : '＿')
    case 's':
    case 'del':
      if (isInside('s', 'del')) return text()

      // Strikethrough has not alternative character. So we will replace to
      // similar character (Tilde operator) if the contents was included tilde.
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

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
