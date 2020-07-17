/* eslint-disable @typescript-eslint/no-non-null-assertion */
import isPhrasing from 'mdast-util-phrasing'
import parents from 'unist-util-parents'
import { JSXSlack } from '../jsx'
import { detectSpecialLink, intToAlpha, intToRoman } from '../utils'
import { escapeEntity, decodeEntity } from './escape'
import { makeIndent, measureWidth } from './measure'

type Node = { type: string; [key: string]: any }
type Visitor = (node: Node, parent?: Node) => string

const bulletListMarkers = ['•', '◦', '▪\ufe0e']
const phrasing = (node: Node) => !node.data?.codeBlock && isPhrasing(node)

export class MrkdwnCompiler {
  constructor(node: Node) {
    this.root = parents(node)
  }

  compile() {
    this.codes = []
    this.lists = []

    return this.visit(this.root)
  }

  private codes: string[] = []

  private lists: [number, number[]][] = []

  private root: Node

  private visitors: Record<string, Visitor> = {
    root: (node) => this.renderCodeBlock(this.block(node)),
    text: (node) => {
      if (node.data?.time) return this.visitors.time(node)
      if (node.data?.escape) {
        let n = node

        while ((n = n.parent))
          if (n.type === 'link') return this.escape(node.data.escape)

        return `<!date^00000000^{_}|${node.value}>`
      }

      return this.escape(node.value)
    },
    paragraph: (node) => this.block(node),
    blockquote: (node) =>
      [...this.block(node).split('\n'), ''].map((s) => `&gt; ${s}`).join('\n'),
    emphasis: (node) => this.markup('_', this.block(node)),
    strong: (node) => this.markup('*', this.block(node)),
    delete: (node) =>
      this.markup('~', this.block(node), { skipCodeBlock: true }),
    inlineCode: (node) =>
      node.data?.codeBlock
        ? this.visitors.code(node)
        : this.markup('`', this.block(node)),
    code: (node) => {
      const idx = this.codes.length
      this.codes.push(this.block(node))

      return `<<code:${idx}>>`
    },
    link: (node) => {
      if (!node.url) return this.block(node)

      switch (detectSpecialLink(node.url)) {
        case '#C':
        case '@UW':
          return `<${node.url}>`
        case '@S':
          return `<!subteam^${node.url.slice(1)}>`
        case '@channel':
          return '<!channel|channel>'
        case '@everyone':
          return '<!everyone|everyone>'
        case '@here':
          return '<!here|here>'
        default: {
          // The content of link must be one line
          const content = this.renderCodeBlock(
            this.block(node).replace(/\n+/g, ' '),
            { singleLine: true }
          )

          // Date localization
          const date = content.match(/^(<!date\^(?!0{8}).+)\|(.+>)$/)
          if (date) return `${date[1]}^${encodeURI(node.url)}|${date[2]}`

          // General URI
          return node.url === decodeEntity(content) && !content.includes('|')
            ? `<${content}>`
            : `<${encodeURI(node.url)}|${content}>`
        }
      }
    },
    list: (node) => {
      this.lists.unshift([Math.floor(node.start - 1) || 0, []])

      const rendered = this.block(node)
      const [, values] = this.lists.shift()!

      let markers: Map<number, string>

      if (node.ordered) {
        markers = new Map<number, string>(
          values.map((v) => [
            v,
            `${(() => {
              if (node.orderedType === 'a') return intToAlpha(v)
              if (node.orderedType === 'A') return intToAlpha(v).toUpperCase()
              if (node.orderedType === 'i') return intToRoman(v)
              if (node.orderedType === 'I') return intToRoman(v).toUpperCase()
              return v.toString()
            })()}.`,
          ])
        )
      } else {
        const bullet =
          bulletListMarkers[
            Math.min(this.lists.length, bulletListMarkers.length - 1)
          ]

        markers = new Map<number, string>(values.map((v) => [v, bullet]))
      }

      const maxWidth = Math.max(...[...markers.values()].map(measureWidth))

      return rendered
        .replace(/<<l(-?\d+)>>/g, (_, d: string) => {
          const marker = markers.get(Number.parseInt(d, 10))!
          const markerWidth = measureWidth(marker)

          return `${makeIndent(maxWidth - markerWidth)}${marker} `
        })
        .replace(/<<ls>>/g, `${makeIndent(maxWidth)} `)
    },
    listItem: (node) => {
      let num = 's'

      if (!node.data?.implied) {
        if (node.data?.value) {
          this.lists[0][0] = node.data.value
        } else {
          this.lists[0][0] += 1
        }

        this.lists[0][1].push(this.lists[0][0])
        num = this.lists[0][0].toString()
      }

      return this.block(node)
        .split('\n')
        .map((s, i) => `<<l${i > 0 ? 's' : num}>>${s}`)
        .join('\n')
    },
    time: (node) => {
      const datetime = this.escape(node.data.time.datetime)
      const content = this.escape(node.value.replace(/\n+/g, ' '))
      const fallback = this.escape(node.data.time.fallback)

      return `<!date^${datetime}^${content}|${fallback}>`
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
      .map((s) =>
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

  private visit: Visitor = (node, parent) =>
    this.visitors[node.type](node, parent)
}

export default function remarkSlackStringifier(mdast: Node) {
  return new MrkdwnCompiler(mdast).compile()
}
