import { JSXSlackError } from '../error'
import { JSXSlack } from '../jsx'
import { escapeEntity, escapeEverythingContents } from '../mrkdwn/escape'
import { detectSpecialLink } from '../utils'

const buildAttr = (props: { [key: string]: any }, escapeEntities = true) => {
  let attr = ''

  for (const prop of Object.keys(props)) {
    if (
      props[prop] != null &&
      ['number', 'bigint', 'boolean', 'string', 'symbol'].includes(
        typeof props[prop],
      )
    ) {
      let attrBase = props[prop].toString()
      if (escapeEntities) attrBase = escapeEntity(attrBase)

      attr += ` ${prop}="${attrBase.replace(/"/g, '&quot;')}"`
    }
  }

  return attr
}

const stringifyHtml = (
  name: string,
  props: Record<string, any>,
  children: any[],
  parents: string[],
) => {
  const text = () => children.join('')
  const isDescendant = (...elms: string[]) =>
    elms.some((e) => parents.includes(e))

  switch (name) {
    case 'br':
      return '<br />'
    case 'b':
    case 'strong':
      if (isDescendant('b', 'strong')) return text()
      return `<b>${text()}</b>`
    case 'i':
    case 'em':
      if (isDescendant('i', 'em')) return text()
      return `<i>${text()}</i>`
    case 's':
    case 'strike':
    case 'del':
      if (isDescendant('s', 'strike', 'del')) return text()
      return `<s>${text()}</s>`
    case 'code':
      if (isDescendant('code')) return text()
      return `<code>${text()}</code>`
    case 'p':
      if (isDescendant('p')) return text()
      return `<p>${text()}</p>`
    case 'blockquote': {
      if (isDescendant('blockquote', 'ul', 'ol')) return text()
      return `<blockquote>${text()}</blockquote>`
    }
    case 'pre': {
      if (isDescendant('ul', 'ol')) return text()

      // Encode everything to preserve whitespaces (except tags such as <a> and <time>)
      return `<pre>${escapeEverythingContents(text())}</pre>`
    }
    case 'a': {
      if (isDescendant('a')) return text()

      let content = text()

      // Prevent vanishing special link used as void element
      if (!content && props.href && detectSpecialLink(props.href))
        content = 'specialLink'

      return `<a${buildAttr(props)}>${content}</a>`
    }
    case 'ul':
      return `<${name}>${text()}</${name}>`
    case 'ol':
    case 'li':
      return `<${name}${buildAttr(props)}>${text()}</${name}>`
    default:
      throw new JSXSlackError(
        `Unknown HTML-like element: ${name}`,
        props.__source,
      )
  }
}

export const parseJSX = (
  children: JSXSlack.ChildElements,
  parents: string[] = [],
): string[] =>
  JSXSlack.Children.map(children, (c) => c)?.reduce(
    (reduced: string[], child) => {
      if (JSXSlack.isValidElement(child)) {
        const { type, props, children: nodeChildren } = child.$$jsxslack

        if (typeof type === 'string') {
          const digged = parseJSX(nodeChildren, [...parents, type])
          return [...reduced, stringifyHtml(type, props || {}, digged, parents)]
        }

        const digged = parseJSX(nodeChildren, parents)
        return reduced.concat(digged)
      }
      return [...reduced, escapeEntity(child.toString())]
    },
    [],
  ) || []
