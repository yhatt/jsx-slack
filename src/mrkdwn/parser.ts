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

const html2hastLight = htm.bind<any>((tagName, props, ...children) => {
  const hast = {
    tagName,
    type: 'element',
    properties: {},
    children: [] as any[],
  }

  for (const k of props ? Object.keys(props) : [])
    hast.properties[k] = decodeEntity(props[k])

  for (const child of children) {
    const value = decodeEntity(child)

    hast.children.push(
      typeof value === 'string' ? { value, type: 'text' } : value
    )
  }

  return hast
})

export default function rehypeLightParser(html: string) {
  const { children } = html2hastLight([`<body>${html}</body>`] as any)
  return { type: 'root', children }
}
