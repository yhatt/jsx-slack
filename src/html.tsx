/** @jsx JSXSlack.h */
import { JSXSlack, ParseContext } from './jsx'
import { Html } from './utils'

export const escapeEntity = (str: string) =>
  str.replace(/&(?!(?:amp|lt|gt);)/g, '&amp;')

export const parse = (
  name: string,
  props: object,
  children: any[],
  context: ParseContext
) => {
  const parents = context.elements.slice(0, -1)
  const text = () => children.join('')

  switch (name) {
    case 'b':
    case 'strong': {
      if (parents.includes('b') || parents.includes('strong')) return text()

      const char = text().indexOf('*') > -1 ? '＊' : '*'
      return `${char}${text()}${char}`
    }
    case 'i':
    case 'em': {
      if (parents.includes('i') || parents.includes('em')) return text()

      const char = text().indexOf('_') > -1 ? '＿' : '_'
      return `${char}${text()}${char}`
    }
    case 's':
    case 'del':
      if (parents.includes('s') || parents.includes('del')) return text()
      return `~${text()}~`
    case 'br':
      return '\n'
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
