import TurndownService from 'turndown'
import { JSXSlack } from './jsx'
import { escapeEntity } from './html'

const applyMarkup = (delimiter: string, target: string) =>
  target.replace(/^((?:&gt; ?)?)(.*)$/gm, (original, quote, str) => {
    if (!str.replace(/<br \/>/g, '').trim()) return original
    return `${quote}${delimiter}${str}${delimiter}`
  })

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
      replacement: (_, node: HTMLElement, { fence }) =>
        `\n\n${fence}\n${
          node.firstChild ? node.firstChild.textContent : ''
        }\n${fence}\n\n`,
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
        applyMarkup(strikethroughDelimiter, s),
    },
  }

  td.escape = (str: string) => escapeEntity(str)

  const postprocess = (mrkdwn: string) => mrkdwn.replace(/<br \/>/g, '')
  const { turndown: originalTurndown } = td
  td.turndown = (...args) => postprocess(originalTurndown.apply(td, args))

  for (const rule of Object.keys(rules)) {
    td.remove(rule)
    if (rules[rule]) td.addRule(rule, rules[rule])
  }

  return td
}

export default function turndown(html: string) {
  return turndownService().turndown(html)
}
