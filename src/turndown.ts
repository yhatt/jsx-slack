import TurndownService from 'turndown'
import { JSXSlack } from './jsx'
import { escapeEntity } from './html'
import { SpecialLink, coerceToInteger, detectSpecialLink } from './utils'

const preSymbol = Symbol('pre')
const uniqIdSymbol = Symbol('uniqId')
const olDigitsSymbol = Symbol('olDigits')

const applyMarkup = (
  delimiter: string,
  target: string,
  wrapPre: boolean = true
) =>
  target.replace(/^((?:&gt; ?)?)(.*)$/gm, (original, quote, str) => {
    let filtered = str.replace(/<br \/>/g, '')

    if (!wrapPre) filtered = filtered.replace(/<<pre:\d+s?>>/g, '')
    if (!filtered.trim()) return original

    return `${quote}${delimiter}${str}${delimiter}`
  })

const turndownService = () => {
  const td = new TurndownService({
    br: '<br />',
    bulletListMarkers: ['•', '◦', '▪\ufe0e'],
    codeBlockStyle: 'fenced',
    codeDelimiter: JSXSlack.exactMode() ? '\u200b`\u200b' : '`',
    emDelimiter: JSXSlack.exactMode() ? '\u200b_\u200b' : '_',
    fence: '```',
    linkStyle: 'mrkdwn',
    strikethroughDelimiter: JSXSlack.exactMode() ? '\u200b~\u200b' : '~',
    strongDelimiter: JSXSlack.exactMode() ? '\u200b*\u200b' : '*',
  })

  let uniqId = 0

  const elmUniqId = () => {
    // eslint-disable-next-line no-plusplus
    elmUniqId[uniqIdSymbol] = elmUniqId[uniqIdSymbol] || ++uniqId

    return elmUniqId[uniqIdSymbol]
  }

  const applyListIndent = (element: HTMLElement, target: string) => {
    // NOTE: trim() may remove the first spaces for right-aligned number in <ol>
    let processed = target.replace(/[\s\uFEFF\xA0]+$/g, '')
    let breaks = ['\n\n', '\n\n']

    if (element.parentNode) {
      const node = element.parentNode as HTMLElement

      if (node.nodeName === 'LI') breaks = ['\n', '\n']
      if (['UL', 'OL'].includes(node.nodeName)) {
        breaks = ['', '\n']
        processed = processed
          .split('\n')
          .map(l => `<<list-indent:${elmUniqId()}>>${l}`)
          .join('\n')
      }
    }

    return `${breaks[0]}${processed}${breaks[1]}`
  }

  const rules = {
    heading: null,
    horizontalRule: null,
    image: null,

    blockquote: {
      filter: 'blockquote',
      replacement: (s: string) =>
        `\n\n${`${s.replace(/^\n+|\n+$/g, '')}\n`.replace(/^/gm, '&gt; ')}\n\n`,
    },
    quote: {
      filter: 'q',
      replacement: (s: string) => `&gt; ${s}`, // For blockquote inside a link
    },
    code: {
      filter: (node: HTMLElement) => {
        const hasSiblings = node.previousSibling || node.nextSibling
        const isCodeBlock =
          node &&
          node.parentNode &&
          node.parentNode.nodeName === 'PRE' &&
          !hasSiblings

        return node.nodeName === 'CODE' && !isCodeBlock
      },
      replacement: (s: string, _, { codeDelimiter }) =>
        applyMarkup(codeDelimiter, s),
    },
    emphasis: {
      filter: ['em', 'i'],
      replacement: (s: string, _, { emDelimiter }) =>
        applyMarkup(emDelimiter, s),
    },
    fencedCodeBlock: {
      filter: (node: HTMLElement, options) =>
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE',

      replacement: (_, node: HTMLElement, opts) => {
        const pre = node.firstChild ? node.firstChild.textContent : ''
        const singleLine = node.parentNode && node.parentNode.nodeName === 'A'
        opts[preSymbol].push(pre)

        return `\n${`<<pre:${opts[preSymbol].length - 1}${
          singleLine ? 's' : ''
        }>>`}\n`
      },
    },
    listItem: {
      filter: 'li',
      replacement: (s: string, node: HTMLElement) => {
        const content = s
          .replace(/^\n+/, '') // remove leading newlines
          .replace(/\n+$/, '\n') // replace trailing newlines with just a single one

        const parent = node.parentNode as HTMLElement
        let prefix = `<<list-bullet:${elmUniqId()}>>`

        if (parent && parent.nodeName === 'OL') {
          // Get the number of order
          const start = coerceToInteger(parent.getAttribute('start') || 1)
          const index = Array.prototype.indexOf.call(
            Array.prototype.filter.call(
              parent.children,
              (n: HTMLElement) => n.nodeName === 'LI'
            ),
            node
          )
          const number = Number(start) + index

          parent[olDigitsSymbol] = Math.max(
            parent[olDigitsSymbol] || 0,
            number.toString().length
          )

          prefix = `<<list-number:${elmUniqId()}:${number}>>`
        }

        return [
          prefix,
          content.replace(/\n/g, `\n<<list-indent:${elmUniqId()}>>`),
          node.nextSibling && !/\n$/.test(content) ? '\n' : '',
        ]
          .join('')
          .replace(/(<<list-indent:\d+>>)+$/, '') // remove trailing indents
      },
    },
    unorderedList: {
      filter: 'ul',
      replacement: (s: string, ul: HTMLUListElement, { bulletListMarkers }) => {
        let level = 0
        let elm = ul.parentNode

        while (elm) {
          if (['UL', 'OL'].includes(elm.nodeName)) level += 1
          elm = elm.parentNode
        }

        return applyListIndent(
          ul,
          s
            .replace(
              new RegExp(`<<list-bullet:${elmUniqId()}>>`, 'g'),
              `${
                bulletListMarkers[Math.min(level, bulletListMarkers.length - 1)]
              } `
            )
            .replace(
              new RegExp(`<<list-indent:${elmUniqId()}>>`, 'g'),
              '\u2007 '
            )
        )
      },
    },
    orderedList: {
      filter: 'ol',
      replacement: (s: string, ol: HTMLOListElement) =>
        applyListIndent(
          ol,
          s
            .replace(
              new RegExp(`<<list-number:${elmUniqId()}:(\\d+)>>`, 'g'),
              (_, n: string) => `${n.padStart(ol[olDigitsSymbol], '\u2007')}. `
            )
            .replace(
              new RegExp(`<<list-indent:${elmUniqId()}>>`, 'g'),
              `${'\u2007'.repeat(ol[olDigitsSymbol])}  `
            )
        ),
    },
    mrkdwnLink: {
      filter: (node: HTMLElement, { linkStyle }) =>
        linkStyle === 'mrkdwn' &&
        node.nodeName === 'A' &&
        node.getAttribute('href'),

      replacement: (s: string, node: HTMLElement) => {
        const href = node.getAttribute('href')
        if (!href) return ''

        switch (detectSpecialLink(href)) {
          case SpecialLink.PublicChannel:
          case SpecialLink.UserMention:
            return `<${href}>`
          case SpecialLink.UserGroupMention:
            return `<!subteam^${href.slice(1)}>`
          case SpecialLink.ChannelMention:
            return '<!channel|channel>'
          case SpecialLink.EveryoneMention:
            return '<!everyone|everyone>'
          case SpecialLink.HereMention:
            return '<!here|here>'
          default: {
            // Date localization
            const date = s.match(/^(<!date\^.+)\|(.+>)$/)
            if (date) return `${date[1]}^${encodeURI(href)}|${date[2]}`

            // General URI
            const content = s.replace(/(?:(?:<br \/>)?\n)+/g, ' ').trim()
            return `<${encodeURI(href)}|${content}>`
          }
        }
      },
    },
    strong: {
      filter: ['strong', 'b'],
      replacement: (s: string, _, { strongDelimiter }) =>
        applyMarkup(strongDelimiter, s),
    },
    strikethrough: {
      filter: ['del', 's', 'strike'],
      replacement: (s: string, _, { strikethroughDelimiter }) =>
        applyMarkup(strikethroughDelimiter, s, false),
    },
    time: {
      filter: (node: HTMLElement) =>
        node.nodeName === 'TIME' &&
        node.getAttribute('datetime') &&
        node.getAttribute('data-fallback'),

      replacement: (s: string, node: HTMLTimeElement) => {
        const datetime = node.getAttribute('datetime')
        const fallback = node.getAttribute('data-fallback')
        if (!datetime || !fallback) return ''

        const content = s.replace(/(?:(?:<br \/>)?\n)+/g, ' ').trim()
        return `<!date^${datetime}^${content}|${fallback}>`
      },
    },
  }

  td.escape = (str: string) => escapeEntity(str)

  Object.defineProperty(td.options, preSymbol, { writable: true, value: [] })

  const { turndown: originalTurndown } = td
  const postprocess = (mrkdwn: string) =>
    mrkdwn
      .replace(/<br \/>/g, '')
      .replace(/<<pre:(\d+)(s?)>>/g, (_, i, singleLine) => {
        if (singleLine) {
          return `\`\`\`${td.options[preSymbol][i].replace(/\n+/g, ' ')}\`\`\``
        }
        return `\`\`\`\n${td.options[preSymbol][i]}\n\`\`\``
      })

  td.turndown = (...args) => {
    td.options[preSymbol] = []
    return postprocess(originalTurndown.apply(td, args))
  }

  for (const rule of Object.keys(rules)) {
    td.remove(rule)
    if (rules[rule]) td.addRule(rule, rules[rule])
  }

  return td
}

export default function turndown(html: string) {
  return turndownService().turndown(html)
}
