import hastscript from 'hastscript'
import htm from 'htm/mini'
import { Processor } from 'unified'

const html2hast = htm.bind<any>(hastscript)

export default function rehypeLightParser(this: Processor) {
  this.Parser = html => {
    const { children } = html2hast([`<body>${html}</body>`] as any)
    return { type: 'root', children }
  }
}
