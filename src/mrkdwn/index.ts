import hast2mdast from 'hast-util-to-mdast'
import root from 'hast-util-to-mdast/lib/handlers/root'
import visit from 'unist-util-visit'
import parser, { decodeEntity } from './parser'
import stringifier from './stringifier'

const list = (h, node) => {
  const ordered = node.tagName === 'ol'
  const start = ordered ? Number.parseInt(node.properties.start ?? 1, 10) : null

  // Mark implied list item
  const children = h.handlers.span(h, node).map(item => {
    if (item.type !== 'listItem')
      return { type: 'listItem', data: { implied: true }, children: [item] }

    return item
  })

  return h(node, 'list', { ordered, start }, children)
}

const mrkdwn = (html: string) =>
  stringifier(
    hast2mdast(parser(html), {
      document: false,
      handlers: {
        root: (h, node) => {
          visit(node, n => {
            // eslint-disable-next-line no-param-reassign
            if (n.type === 'text') n.value = decodeEntity(n.value)
          })
          return root(h, node)
        },
        code: (h, node) =>
          h.augment(node, {
            type: 'inlineCode',
            children: h.handlers.span(h, node),
          }),
        pre: (h, node) =>
          h.augment(node, {
            // Render as inline code to prevent making implied paragraphs
            type: 'inlineCode',
            children: h.handlers.span(h, node),
            data: { codeBlock: true },
          }),
        time: (h, node) => ({
          ...h.handlers.textarea(h, node),
          data: {
            time: {
              datetime: node.properties.datetime,
              fallback: node.properties['data-fallback'],
            },
          },
        }),
        ul: list,
        ol: list,
      },
    })
  )

export default mrkdwn
