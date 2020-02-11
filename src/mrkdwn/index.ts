import rehype2Remark from 'rehype-remark'
import unified from 'unified'
import parser from './parser'
import stringifier from './stringifier'

const processor = unified()
  .use(parser)
  .use(rehype2Remark, {
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
    },
  })
  .use(stringifier)
  .freeze()

const mrkdwn = (html: string) => processor.processSync(html).contents

export default mrkdwn
