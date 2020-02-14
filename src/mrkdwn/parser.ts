import htm from 'htm/mini'

export const decodeEntity = obj => {
  if (typeof obj === 'string')
    return obj.replace(/&(amp|gt|lt|quot|#\d+);/g, (_, entity: string) => {
      if (entity.startsWith('#'))
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))

      return { amp: '&', gt: '>', lt: '<', quot: '"' }[entity]
    })

  return obj
}

// Preserve text's special spaces that would be rendered in HTML
// (hast-util-to-mdast will over-collapse many spaces against HTML spec)
const decodeForMdast = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/(?![\t\n\r ])\s/g, sp => `&#${sp.codePointAt(0)};`)

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
    const v = decodeEntity(child)

    hast.children.push(
      typeof v === 'string' ? { value: decodeForMdast(v), type: 'text' } : v
    )
  }

  return hast
})

export default function rehypeLightParser(html: string) {
  const { children } = html2hastLight([`<body>${html}</body>`] as any)
  return { type: 'root', children }
}
