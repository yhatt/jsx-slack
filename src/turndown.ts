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

    if (!wrapPre) filtered = filtered.replace(/<<pre:\d+>>/g, '')
    if (!filtered.trim()) return original

    return `${quote}${delimiter}${str}${delimiter}`
  })

const preSymbol = Symbol('pre')

const turndownService = () => {
  const td = new TurndownService({
    br: '<br />',
    bulletListMarker: '•',
    codeBlockStyle: 'fenced',
    codeDelimiter: JSXSlack.exactMode() ? '\u200b`\u200b' : '`',
    emDelimiter: JSXSlack.exactMode() ? '\u200b_\u200b' : '_',
    fence: '```',
    linkStyle: 'inlined',
    strikethroughDelimiter: JSXSlack.exactMode() ? '\u200b~\u200b' : '~',
    strongDelimiter: JSXSlack.exactMode() ? '\u200b*\u200b' : '*',
  })

  const rules = {
    heading: null,
    horizontalRule: null,
    image: null,

    blockquote: {
      filter: 'blockquote',
      replacement: (s: string) =>
        `\n\n${`${s.replace(/^\n+|\n+$/g, '')}\n`.replace(/^/gm, '&gt; ')}\n\n`,
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
    fencedCodeBlock: {
      filter: (node: HTMLElement, options) =>
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE',
      replacement: (_, node: HTMLElement, opts) => {
        const pre = node.firstChild ? node.firstChild.textContent : ''
        opts[preSymbol].push(pre)

        return `\n${`<<pre:${opts[preSymbol].length - 1}>>`}\n`
      },
    },
    emphasis: {
      filter: ['em', 'i'],
      replacement: (s: string, _, { emDelimiter }) =>
        applyMarkup(emDelimiter, s),
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
  }

  td.escape = (str: string) => escapeEntity(str)

  Object.defineProperty(td.options, preSymbol, { writable: true, value: [] })

  const { turndown: originalTurndown } = td
  const postprocess = (mrkdwn: string) =>
    mrkdwn
      .replace(/<br \/>/g, '')
      .replace(
        /<<pre:(\d+)>>/g,
        (_, i) => `\`\`\`\n${td.options[preSymbol][i]}\n\`\`\``
      )

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
