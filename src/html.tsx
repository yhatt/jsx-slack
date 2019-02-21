/** @jsx JSXSlack.h */
import { JSXSlack, ParseContext } from './jsx'
import { Html } from './utils'

export const escapeEntity = (str: string) =>
  str.replace(/&(?!(?:amp|lt|gt);)/g, '&amp;')

export const parse = (
  name: string,
  props: object,
  children: any[],
  { elements, builts }: ParseContext
) => {
  const parents = elements.slice(0, -1)
  const text = () => children.join('')
  const wrap = (char: string) => {
    // In exact mode, we add zero-width space around markup character to apply
    // formatting exactly.
    const wc = JSXSlack.exactMode() ? `\u200b${char}\u200b` : char

    return `${wc}${text()}${wc}`
  }

  switch (name) {
    case 'b':
    case 'strong': {
      if (parents.includes('b') || parents.includes('strong')) return text()

      // We use full-width char as primary markup character. It won't require
      // spaces around, and can show defined markup in JSX exactly with
      // regardless around text contexts.
      return wrap(text().indexOf('＊') > -1 ? '*' : '＊')
    }
    case 'i':
    case 'em': {
      if (parents.includes('i') || parents.includes('em')) return text()

      // As same as bold markup, the primary markup is full-width char.
      return wrap(text().indexOf('＿') > -1 ? '_' : '＿')
    }
    case 's':
    case 'del':
      if (parents.includes('s') || parents.includes('del')) return text()
      return wrap('~')
    case 'br':
      return '\n'
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
