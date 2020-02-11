import hastscript from 'hastscript'
import he from 'he'
import htm from 'htm/mini'
import { Processor } from 'unified'

const decodeEntity = <T>(obj: T, isAttributeValue = false): T => {
  if (typeof obj === 'string') return he.decode(obj, { isAttributeValue })
  return obj
}

const html2hast = htm.bind((type, props, ...children) =>
  hastscript(
    type,
    props
      ? Object.keys(props).reduce(
          (p, k) => ({ ...p, [k]: decodeEntity(props[k], true) }),
          {}
        )
      : props,
    ...children.map(c => decodeEntity(c))
  )
)

export default function rehypeLightParser(this: Processor) {
  this.Parser = html => {
    const { children } = html2hast([`<body>${html}</body>`] as any)
    return { type: 'root', children }
  }
}
