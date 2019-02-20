/** @jsx JSXSlack.h */
import { JSXSlack } from './jsx'
import { Html } from './utils'

export const parse = (name: string, props: object, children: any[]) => {
  switch (name) {
    case 'b':
    case 'strong':
      return `*${children.join('')}*`
    case 'i':
    case 'em':
      return `_${children.join('')}_`
    case 's':
    case 'del':
      return `~${children.join('')}~`
    case 'br':
      return '\n'
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
