/** @jsx JSXSlack.h */
import { JSXSlack, ParseContext } from './jsx'
import { Html } from './utils'

export const escapeEntity = (str: string) =>
  str
    .replace(/&(?!(?:amp|lt|gt);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const parse = (
  name: string,
  props: object,
  children: any[],
  context: ParseContext
) => {
  const parents = context.elements.slice(0, -1)

  const text = () => children.join('')
  const isInside = (...elements: string[]) =>
    elements.some(e => parents.includes(e))

  if (name === 'br') return '\n'
  if (isInside('code', 'pre')) return text()

  switch (name) {
    case 'b':
    case 'strong':
      if (isInside('b', 'strong')) return text()

      return `<<b>>${text()
        .replace(/\*/g, '\u2217')
        .replace(/＊/g, '\ufe61')}<</b>>`
    case 'i':
    case 'em':
      if (isInside('i', 'em')) return text()

      return `<<i>>${text()
        .replace(/_/g, '\u02cd')
        .replace(/＿/g, '\u2e0f')}<</i>>`
    case 's':
    case 'del':
      if (isInside('s', 'del')) return text()
      return `<<s>>${text().replace(/~/g, '\u223c')}<</s>>`
    case 'code':
      return `<<code>>${text().replace(/[`｀]/g, '\u02cb')}<</code>>`
    case 'p':
      return isInside('p') ? text() : `<<p>>${text()}<</p>>`
    case 'blockquote': {
      if (isInside('blockquote')) return text()

      const bq = text().replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)

      // Add EOL to apply correct layouting
      return `<<p>><<bq>>${bq}\n<</bq>><</p>>`
    }
    case 'pre':
      return `<<pre>>${text().replace(/`{3}/g, '``\u02cb')}<</pre>>`
    default:
      throw new Error(`Unknown HTML-like element: ${name}`)
  }
}

const wrap = (char: string, contents: string) =>
  contents
    .split(/\r\n|\r|\n/)
    .map(c => {
      const quote = c.startsWith('&gt; ') ? '&gt; ' : ''
      const content = c.slice(quote.length)
      const filtered = content.replace(/<{2,3}\/?[^>]+>{2,3}/g, '')

      return `${quote}${
        /^\s*$/.test(filtered)
          ? content
          : `<<<${char}>>>${content}<<</${char}>>>`
      }`
    })
    .join('\n')

const partitionBreaks = (str: string): [string, string] => {
  const stripped = str.split('\n')

  let breaks = ''
  for (let i = 1; i < stripped.length; i += 1) breaks += '\n'

  return [stripped.join(''), breaks]
}

export const postprocess = (mrkdwn: string) => {
  const pre: string[] = []
  const blockquote: string[] = []
  const exact = JSXSlack.exactMode()

  const base = mrkdwn
    .replace(/<<pre>>([\s\S]*?)<<\/pre>>/g, (_, s) => {
      pre.push(s)
      return `\n<<<<pre:${pre.length - 1}>>>>\n`
    })
    .replace(/<<bq>>([\s\S]*?)<<\/bq>>/g, (_, s) => {
      blockquote.push(s)
      return `<<<bq:${blockquote.length - 1}>>>`
    })

  const processParagraph = (m: string) =>
    m
      .replace(/^((?:\n|<<\w+>>)*)<<p>>/, (_, s) => {
        const [content, breaks] = partitionBreaks(s)
        return `${breaks}${content}`
      })
      .replace(/\n{0,2}<<p>>/g, '\n\n')
      .replace(/<<\/p>>((?:\n|<<\/\w+>>)*)$/, (_, s) =>
        partitionBreaks(s).join('')
      )
      .replace(/<<\/p>>\n{0,2}/g, '\n\n')

  return processParagraph(base)
    .replace(/<<<bq:(\d+)>>>/g, (_, n) =>
      processParagraph(blockquote[n]).replace(/^/gm, '&gt; ')
    )
    .replace(/<<b>>([\s\S]*?)<<\/b>>/g, (_, s) => wrap('*', s))
    .replace(/<<i>>([\s\S]*?)<<\/i>>/g, (_, s) => wrap('_', s))
    .replace(/<<s>>([\s\S]*?)<<\/s>>/g, (_, s) => wrap('~', s))
    .replace(/<<code>>([\s\S]*?)<<\/code>>/g, (_, s) => wrap('`', s))
    .replace(
      /\n((?:&gt; )?(?:<<<.>>>)*)<<<<pre:(\d+)>>>>((?:<<<\/.>>>)*)\n(?:&gt; )?/g,
      (_, mb, n, __, matchIdx) => {
        // Re-align close tag
        const closeTags: string[] = []
        mb.replace(/<<<(.)>>>/g, (_, s) => closeTags.unshift(`<<</${s}>>>`))

        return `${matchIdx === 0 ? '' : '\n'}${mb}\`\`\`\n${
          pre[n]
        }\n\`\`\`${closeTags.join('')} `
      }
    )
    .replace(/<<<\/?(.)>>>/g, (_, s) => (exact ? `\u200b${s}\u200b` : s))
}

export const escapeChars = (mrkdwn: string) =>
  mrkdwn
    .replace(/^(&gt;|＞)/gm, (_, c) => `\u00ad${c}`)
    .replace(/\*/g, '\u2217')
    .replace(/＊/g, '\ufe61')
    .replace(/_/g, '\u02cd')
    .replace(/＿/g, '\u2e0f')
    .replace(/[`｀]/g, '\u02cb')
    .replace(/~/g, '\u223c')

export const Escape: JSXSlack.FC<{ children: JSXSlack.Children<{}> }> = props =>
  JSXSlack.h(JSXSlack.NodeType.escapeInHtml, props)

export default function html(children: JSXSlack.Children<{}>) {
  return JSXSlack(<Html>{children}</Html>)
}
