import isPhrasing from 'mdast-util-phrasing'
import { Compiler, Processor } from 'unified'
import { escapeEntity } from '../html'
import { JSXSlack } from '../jsx'
import { SpecialLink, detectSpecialLink } from '../utils'

type Node = { type: string; [key: string]: any }
type Visitor = (node: Node, parent?: Node) => string

const bulletListMarkers = ['•', '◦', '▪\ufe0e']
const phrasing = (node: Node) => !node.data?.codeBlock && isPhrasing(node)

export class MrkdwnCompiler implements Compiler {
  constructor(node: Node) {
    this.root = node
  }

  compile() {
    this.codes = []
    this.lists = []

    return this.visit(this.root)
  }

  private codes: string[] = []

  private lists: number[] = []

  private root: Node

  private visitors: Record<string, Visitor> = {
    root: node => this.renderCodeBlock(this.block(node)),
    text: node =>
      node.data?.time ? this.visitors.time(node) : this.escape(node.value),
    paragraph: node => this.block(node),
    blockquote: node =>
      [...this.block(node).split('\n'), ''].map(s => `&gt; ${s}`).join('\n'),
    emphasis: node => this.markup('_', this.block(node)),
    strong: node => this.markup('*', this.block(node)),
    delete: node => this.markup('~', this.block(node), { skipCodeBlock: true }),
    inlineCode: node =>
      node.data?.codeBlock
        ? this.visitors.code(node)
        : this.markup('`', this.block(node)),
    code: node => {
      const idx = this.codes.length
      this.codes.push(this.block(node))

      return `<<code:${idx}>>`
    },
    link: node => {
      switch (detectSpecialLink(node.url)) {
        case SpecialLink.PublicChannel:
        case SpecialLink.UserMention:
          return `<${node.url}>`
        case SpecialLink.UserGroupMention:
          return `<!subteam^${node.url.slice(1)}>`
        case SpecialLink.ChannelMention:
          return '<!channel|channel>'
        case SpecialLink.EveryoneMention:
          return '<!everyone|everyone>'
        case SpecialLink.HereMention:
          return '<!here|here>'
        default: {
          // The content of link must be one line
          const content = this.renderCodeBlock(
            this.block(node).replace(/\n+/g, ' '),
            { singleLine: true }
          )

          // Date localization
          const date = content.match(/^(<!date\^.+)\|(.+>)$/)
          if (date) return `${date[1]}^${encodeURI(node.url)}|${date[2]}`

          // General URI
          return `<${encodeURI(node.url)}|${content}>`
        }
      }
    },
    list: node => {
      this.lists.unshift(Math.floor(node.start - 1) || 0)

      const rendered = this.block(node)
      const digitLength = this.lists.shift()?.toString().length || 1

      if (node.ordered) {
        return rendered
          .replace(
            /<<l(\d+)>>/g,
            (_, d: string) => `${d.padStart(digitLength, '\u2007')}. `
          )
          .replace(/<<ls>>/g, `${'\u2007'.repeat(digitLength)}  `)
      }

      const marker =
        bulletListMarkers[
          Math.min(this.lists.length, bulletListMarkers.length - 1)
        ]

      return rendered
        .replace(/<<l\d+>>/g, `${marker} `)
        .replace(/<<ls>>/g, '\u2007 ')
    },
    listItem: node => {
      // eslint-disable-next-line no-plusplus
      const number = node.data?.implied ? 's' : ++this.lists[0]

      return this.block(node)
        .split('\n')
        .map((s, i) => `<<l${i > 0 ? 's' : number}>>${s}`)
        .join('\n')
    },
    time: node => {
      const datetime = this.escape(node.data.time.dateTime)
      const content = this.escape(node.value.replace(/\n+/g, ' '))
      const fallback = this.escape(node.data.time.dataFallback)

      return datetime && content && fallback
        ? `<!date^${datetime}^${content}|${fallback}>`
        : ''
    },
    break: () => '\n',
  }

  private block = (node: Node): string => {
    const ret: string[] = []
    let prev: Node | undefined

    for (const child of node.children) {
      if (prev) {
        if (prev.data?.codeBlock) ret.push('\n')
        if (!phrasing(child)) {
          // Add line break if the trailing break does not have
          if (!ret[ret.length - 1]?.endsWith('\n')) ret.push('\n')

          if (
            !(child.type === 'list' && this.lists.length > 0) &&
            ['paragraph', 'blockquote', 'list'].includes(prev.type)
          )
            ret.push('\n')
        }
      }

      ret.push(this.visit(child, node))

      prev = child
    }

    return ret.join('')
  }

  private escape = escapeEntity

  private markup = (
    char: string,
    text: string,
    { skipCodeBlock = false }: { skipCodeBlock?: boolean } = {}
  ): string => {
    const marker = JSXSlack.exactMode() ? `\u200b${char}\u200b` : char

    // Keep leading quotes
    return text
      .split('\n')
      .map(s =>
        s.replace(/^((?:&gt; )*)(.*)$/, (_, quote, content) => {
          // Slack cannot wrap code block in strikethrough
          if (content && !(skipCodeBlock && content.startsWith('<<code:'))) {
            return `${quote}${marker}${content}${marker}`
          }
          return `${quote}${content}`
        })
      )
      .join('\n')
  }

  private renderCodeBlock = (
    str: string,
    { singleLine = false }: { singleLine?: boolean } = {}
  ) =>
    str.replace(/<<code:(\d+)>>/g, (_, num) => {
      const code = this.codes[Number.parseInt(num, 10)]

      return singleLine
        ? `\`\`\`${code.replace(/\n+/g, ' ')}\`\`\``
        : `\`\`\`\n${code}\n\`\`\``
    })

  private visit: Visitor = (node, parent) => {
    const visitor = this.visitors[node.type]
    if (!visitor) throw new Error(`Visitor for "${node.type}" was not found.`)

    return visitor(node, parent)
  }
}

export default function remarkSlackStringifier(this: Processor) {
  this.Compiler = MrkdwnCompiler
}
