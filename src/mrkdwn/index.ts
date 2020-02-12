import hast2mdast from 'hast-util-to-mdast'
import parser from './parser'
import stringifier from './stringifier'

const list = (h, node) => {
  const ordered = node.tagName === 'ol'
  const start = ordered ? node.properties.start ?? 1 : null

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
          data: { time: node.properties },
        }),
        ul: list,
        ol: list,
      },
    })
  )

export default mrkdwn
