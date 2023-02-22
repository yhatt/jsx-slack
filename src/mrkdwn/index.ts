import { visit } from 'unist-util-visit'
import { JSXSlack } from '../jsx'
import {
  hastUtilToMdast,
  hastUtilToMdastRoot as root,
  hastUtilToMdastListItem as listItem,
  hastUtilToMdastTextarea as toTextNode,
} from '../prebundles/hastUtilToMdast'

import { decodeEntity } from './escape'
import { parseJSX } from './jsx'
import parser from './parser'
import stringifier from './stringifier'

const list = (state, node) => {
  const ordered = node.tagName === 'ol'
  const orderedType = ordered ? node.properties.type ?? '1' : null
  const start = ordered ? Number.parseInt(node.properties.start ?? 1, 10) : null

  // Mark implied list item
  let children = state.handlers.span(state, node, undefined)

  if (children) {
    children = ([] as any[]).concat(children).map((item) => {
      if (item.type !== 'listItem')
        return { type: 'listItem', data: { implied: true }, children: [item] }

      return item
    })
  }

  const result: any = {
    type: 'list',
    ordered,
    orderedType,
    start,
    children,
  }

  state.patch(node, result)

  return result
}

const hast2mdast: typeof hastUtilToMdast = (...args) => {
  const mdast = hastUtilToMdast(...args)

  // Restore text nodes
  visit(mdast, (n) => {
    if (n.type.startsWith('text-jsxslack-')) n.type = 'text'
  })

  return mdast
}

const htmlToMrkdwn = (html: string) =>
  stringifier(
    hast2mdast(parser(html), {
      document: false,
      nodeHandlers: {
        root: (state, element) => {
          visit(element, (node) => {
            if (node.type === 'text') node.value = decodeEntity(node.value)
          })

          const ret = root(state, element)

          // Prevent merging adjacent text nodes
          const preprocessRoot = (() => {
            if (!ret) return { type: 'root', children: [] }
            if (Array.isArray(ret)) return { type: 'root', children: ret }
            return ret
          })()

          let i = 0
          visit(preprocessRoot, 'text', (n: any) => {
            n.type = 'text-jsxslack-' + i
            i += 1
          })

          return ret
        },
      },
      handlers: {
        code: (h, node, parent) => ({
          ...node,
          type: 'inlineCode' as any,
          children: h.handlers.span(h, node, parent),
        }),
        pre: (h, node, parent) => ({
          ...node,
          // Render as inline code to prevent making implied paragraphs
          type: 'inlineCode' as any,
          children: h.handlers.span(h, node, parent),
          data: { codeBlock: true },
        }),
        time: (h, node): any => ({
          ...toTextNode(h, node),
          data: {
            time: {
              datetime: node.properties?.datetime,
              fallback: node.properties?.['data-fallback'],
            },
          },
        }),
        ul: list,
        ol: list,
        li: (h, node) => {
          const elm: any = listItem(h, node)
          const value = Number.parseInt(node.properties?.value as any, 10)

          if (!Number.isNaN(value) && elm) elm.data = { value }

          return elm
        },
        span: (h, node): any => {
          if (node.properties?.['data-escape']) {
            return {
              ...toTextNode(h, node),
              data: { escape: node.properties['data-escape'] },
            }
          }
          return h.all(node)
        },
      },
    })
  )

export const mrkdwn = (children: JSXSlack.ChildElements) =>
  htmlToMrkdwn(parseJSX(children, []).join(''))
