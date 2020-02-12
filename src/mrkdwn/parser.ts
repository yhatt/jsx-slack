import hastscript from 'hastscript'
import htm from 'htm/mini'

const decodeEntity = obj => {
  if (typeof obj === 'string')
    return obj.replace(/&(amp|gt|lt|quot|#\d+);/g, (_, entity: string) => {
      if (entity.startsWith('#'))
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))

      return { amp: '&', gt: '>', lt: '<', quot: '"' }[entity]
    })

  return obj
}

const html2hast = htm.bind((type, props, ...children) =>
  hastscript(
    type,
    props
      ? Object.keys(props).reduce(
          (p, k) => ({ ...p, [k]: decodeEntity(props[k]) }),
          {}
        )
      : props,
    ...children.map(c => decodeEntity(c))
  )
)

export default function rehypeLightParser(html: string) {
  const { children } = html2hast([`<body>${html}</body>`] as any)
  return { type: 'root', children }
}
