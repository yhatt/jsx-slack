import rehype2Remark from 'rehype-remark'
import unified from 'unified'
import parser from './parser'
import stringifier from './stringifier'

const processor = unified()
  .use(parser)
  .use(rehype2Remark, {
    document: true,
    handlers: {
      time: (h, node) =>
        h.augment(node, {
          type: 'text',
          value: node.value,
          data: { time: node.properties },
        }),
    },
  })
  .use(stringifier)
  .freeze()

const mrkdwn = (html: string) => processor.processSync(html).contents

export default mrkdwn
