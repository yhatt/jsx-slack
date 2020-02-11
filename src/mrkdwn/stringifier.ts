import compact from 'mdast-util-compact'
import { Compiler, Processor } from 'unified'
import { escapeEntity } from '../html'
import { JSXSlack } from '../jsx'
import { SpecialLink, detectSpecialLink } from '../utils'

type Node = { type: string; [key: string]: any }
type Visitor = (node: Node, parent?: Node) => string

const trimEnd = (str: string) => str.replace(/[\s\uFEFF\xA0]+$/g, '')

export class MrkdwnCompiler implements Compiler {
  constructor(node: Node) {
    this.root = compact(node)
  }

  compile() {
    this.codes = []
    return this.visit(this.root)
  }

  private codes: string[] = []

  private root: Node

  private visitors: Record<string, Visitor> = {
    root: node =>
      this.block(node).replace(
        /~?<<code:(\d+)>>~?/g,
        (_, num) => `\`\`\`\n${this.codes[Number.parseInt(num, 10)]}\n\`\`\``
      ),
    paragraph: node => `${this.all(node).join('')}\n\n`,
    text: node =>
      node.data?.time ? this.visitors.time(node) : escapeEntity(node.value),
    emphasis: node => this.applyMarker(this.all(node).join(''), '_'),
    strong: node => this.applyMarker(this.all(node).join(''), '*'),
    delete: node => this.applyMarker(this.all(node).join(''), '~'),
    inlineCode: node => this.applyMarker(this.all(node).join(''), '`'),
    link: node => {
      const { url } = node
      if (!url) return ''

      switch (detectSpecialLink(url)) {
        case SpecialLink.PublicChannel:
        case SpecialLink.UserMention:
          return `<${url}>`
        case SpecialLink.UserGroupMention:
          return `<!subteam^${url.slice(1)}>`
        case SpecialLink.ChannelMention:
          return '<!channel|channel>'
        case SpecialLink.EveryoneMention:
          return '<!everyone|everyone>'
        case SpecialLink.HereMention:
          return '<!here|here>'
        default: {
          const content = trimEnd(
            this.all(node)
              .join('')
              .replace(/\n+/g, ' ')
          )

          // Date localization
          const date = content.match(/^(<!date\^.+)\|(.+>)$/)
          if (date) return `${date[1]}^${encodeURI(url)}|${date[2]}`

          // General URI
          return `<${encodeURI(url)}|${content}>`
        }
      }
    },
    time: node => {
      const datetime = escapeEntity(node.data.time.dateTime)
      const content = escapeEntity(node.value.replace(/\n+/g, ' '))
      const fallback = escapeEntity(node.data.time.dataFallback)

      return datetime && content && fallback
        ? `<!date^${datetime}^${content}|${fallback}>`
        : ''
    },
    break: () => '\n',
    blockquote: node =>
      `${`${this.block(node)}\n`
        .split('\n')
        .map(l => `&gt; ${l}`)
        .join('\n')}\n\n`,
    code: node => {
      const idx = this.codes.length
      this.codes.push(this.block(node))

      return `<<code:${idx}>>\n`
    },
  }

  private applyMarker = (text: string, char: string) => {
    const marker = JSXSlack.exactMode() ? `\u200b${char}\u200b` : char

    return text
      .split('\n')
      .map(s =>
        s.replace(
          /^((?:&gt; )*)(.*)$/,
          (_, quote, content) =>
            `${quote}${content ? `${marker}${content}${marker}` : content}`
        )
      )
      .join('\n')
  }

  private all = (node: Node): string[] =>
    node.children.map(child => this.visit(child, node))

  private block = (node: Node): string => trimEnd(this.all(node).join(''))

  private visit: Visitor = (node, parent) => {
    const visitor = this.visitors[node.type]
    if (!visitor) throw new Error(`Visitor for "${node.type}" was not found.`)

    return visitor(node, parent)
  }
}

export default function remarkSlackStringifier(this: Processor) {
  this.Compiler = MrkdwnCompiler
}
