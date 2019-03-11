import TurndownService from 'turndown'
import { JSXSlack } from './jsx'
import { escapeEntity } from './html'

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

const preSymbol = Symbol('pre')
const olIdSymbol = Symbol('olId')
const olDigitsSymbol = Symbol('olDigits')

const turndownService = () => {
  const td = new TurndownService({
    br: '<br />',
    bulletListMarker: '•',
    codeBlockStyle: 'fenced',
    codeDelimiter: JSXSlack.exactMode() ? '\u200b`\u200b' : '`',
    emDelimiter: JSXSlack.exactMode() ? '\u200b_\u200b' : '_',
    fence: '```',
    linkStyle: 'mrkdwn',
    strikethroughDelimiter: JSXSlack.exactMode() ? '\u200b~\u200b' : '~',
    strongDelimiter: JSXSlack.exactMode() ? '\u200b*\u200b' : '*',
  })

  let olUniqueId = 0

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
      replacement: (s: string, node: HTMLElement, opts) => {
        const content = s
          .replace(/^\n+/, '') // remove leading newlines
          .replace(/\n+$/, '\n') // replace trailing newlines with just a single one

        let prefix = `${opts.bulletListMarker} `
        let indent = `\u2007 ` // Figure space + space

        const parent = node.parentNode
        if (parent && parent.nodeName === 'OL') {
          const ol = parent as HTMLOListElement

          // Get the number of order
          const start = ol.getAttribute('start') || 1
          const index = Array.prototype.indexOf.call(
            Array.prototype.filter.call(
              parent.children,
              (n: HTMLElement) => n.nodeName === 'LI'
            ),
            node
          )
          const number = Number(start) + index

          // eslint-disable-next-line no-plusplus
          ol[olIdSymbol] = ol[olIdSymbol] || ++olUniqueId
          ol[olDigitsSymbol] = Math.max(
            ol[olDigitsSymbol] || 0,
            number.toString().length
          )

          prefix = `<<ol-number:${ol[olIdSymbol]}:${number}>> `
          indent = `<<ol-indent:${ol[olIdSymbol]}>> `
        }

        return `${prefix}${content.replace(/\n/gm, `\n${indent}`)}${
          node.nextSibling && !/\n$/.test(content) ? '\n' : ''
        }`
      },
    },
    orderedList: {
      filter: 'ol',
      replacement: (s: string, ol: HTMLOListElement) => {
        const uniqId = ol[olIdSymbol]
        const numMatcher = new RegExp(`<<ol-number:${uniqId}:(\\d+)>>`, 'g')
        const indentMatcher = new RegExp(`<<ol-indent:${uniqId}>>`, 'g')

        return s
          .replace(
            numMatcher,
            (_, num: string) => `${num.padStart(ol[olDigitsSymbol], '\u2007')}.`
          )
          .replace(indentMatcher, `${'\u2007'.repeat(ol[olDigitsSymbol])} `)
      },
    },
    mrkdwnLink: {
      filter: (node: HTMLElement, { linkStyle }) =>
        linkStyle === 'mrkdwn' &&
        node.nodeName === 'A' &&
        node.getAttribute('href'),

      replacement: (s: string, node: HTMLElement) => {
        const href = node.getAttribute('href')
        if (!href) return ''

        // Link to channel and user mention
        if (/^(?:#C|@U)[A-Z0-9]{8}$/.test(href)) return `<${href}>`
        if (/^@S[A-Z0-9]{8}$/.test(href)) return `<!subteam^${href.slice(1)}>`

        // Special mention
        const spMention = href.match(/^@(here|channel|everyone)$/)
        if (spMention) return `<!${spMention[1]}|${spMention[1]}>`

        // Date localization
        const date = s.match(/^(<!date\^.+)\|(.+>)$/)
        if (date) return `${date[1]}^${encodeURI(href)}|${date[2]}`

        // General URI
        const content = s.replace(/(?:(?:<br \/>)?\n)+/g, ' ').trim()
        return `<${encodeURI(href)}|${content}>`
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
