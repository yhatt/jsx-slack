import {
  escapeChars,
  escapeEntity,
  escapeEverythingContents,
  escapeReplacers,
} from './escape'
import formatDate from '../date'
import { JSXSlack, createComponent } from '../jsx'
import { detectSpecialLink } from '../utils'

const buildAttr = (props: { [key: string]: any }, escapeEntities = true) => {
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

const stringifyHtml = (
  name: string,
  props: Record<string, any>,
  children: any[],
  parents: string[]
) => {
  const text = () => children.join('')
  const isChild = (...elms: string[]) =>
    parents.length > 0 && elms.some((e) => e === parents[parents.length - 1])
  const isDescendant = (...elms: string[]) =>
    elms.some((e) => parents.includes(e))

  if (name === 'br') return '<br />'
  if (isChild('pre', 'code') && !['a', 'time'].includes(name)) return text()

  switch (name) {
    case 'b':
    case 'strong':
      if (isDescendant('b', 'strong', 'time')) return text()
      return `<b>${escapeReplacers.bold(text())}</b>`
    case 'i':
    case 'em':
      if (isDescendant('i', 'em', 'time')) return text()

      // Underscores have to avoid escaping in emoji shorthand
      return `<i>${escapeChars(text(), escapeReplacers.italic)}</i>`
    case 's':
    case 'strike':
    case 'del':
      if (isDescendant('s', 'strike', 'del', 'time')) return text()
      return `<s>${escapeReplacers.strikethrough(text())}</s>`
    case 'code':
      if (isDescendant('time')) return text()
      return `<code>${escapeReplacers.code(text())}</code>`
    case 'p':
      return isDescendant('p') ? text() : `<p>${text()}</p>`
    case 'blockquote': {
      if (isDescendant('blockquote', 'ul', 'ol', 'time')) return text()
      return `<blockquote>${escapeReplacers.blockquote(text())}</blockquote>`
    }
    case 'pre': {
      if (isDescendant('ul', 'ol', 'time')) return text()

      // Encode everything to preserve whitespaces (except tags such as <a> and <time>)
      return `<pre>${escapeEverythingContents(
        text().replace(/`{3}/g, '``\u02cb')
      )}</pre>`
    }
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

      const datetimeAttr = buildAttr({ datetime })
      const fallbackAttr = props.fallback
        ? buildAttr({
            'data-fallback': props.fallback.replace(/\|/g, '\u01c0'),
          })
        : buildAttr({ 'data-fallback': formatDate(date, format) }, false)

      // Encode everything of the format text to preserve from unexpected escape
      return `<time${datetimeAttr}${fallbackAttr}>${escapeEverythingContents(
        format
      )}</time>`
    }
    case 'small':
    case 'span':
    case 'ul':
      return `<${name}>${text()}</${name}>`
    case 'ol':
    case 'li':
      return `<${name}${buildAttr(props)}>${text()}</${name}>`
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

export const Escape = createComponent('Escape', JSXSlack.Fragment.bind(null))

export const parseJSX = (
  children: JSXSlack.ChildElements,
  parents: string[],
  escaped = false
): string[] =>
  JSXSlack.Children.map(children, (c) => c)?.reduce(
    (reduced: string[], child) => {
      if (JSXSlack.isValidElement(child)) {
        const { type, props, children: nodeChildren } = child.$$jsxslack

        if (typeof type === 'string') {
          const digged = parseJSX(nodeChildren, [...parents, type])
          return [...reduced, stringifyHtml(type, props || {}, digged, parents)]
        }

        // Component except <Escape> just ignores and digs into children
        const shouldEscape = !escaped && type === Escape
        const digged = parseJSX(nodeChildren, parents, shouldEscape)

        return reduced.concat(
          shouldEscape ? escapeChars(digged.join('')) : digged
        )
      }
      return [...reduced, escapeEntity(child.toString())]
    },
    []
  ) || []
