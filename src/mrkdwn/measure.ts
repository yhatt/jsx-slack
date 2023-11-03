import { letters, spaces } from '../data/font-width.json'

const flippedSpaces = Object.keys(spaces).reduce(
  (obj, key) => ({ ...obj, [spaces[key]]: key }),
  {} as Record<number, string>,
)

const spaceWidth = Object.values(spaces).sort((a, b) => b - a)

const indentCache = new Map<number, string>()
const measureCache = new Map<string, number>()

export function makeIndent(width: number): string {
  let indent = indentCache.get(width)

  if (indent === undefined) {
    indent = ''
    let targetWidth = width

    spaceWidth.forEach((w) => {
      const num = Math.floor(targetWidth / w)
      if (num > 0) indent += flippedSpaces[w].repeat(num)

      targetWidth -= w * num
    })

    indentCache.set(width, indent)
  }

  return indent
}

export function measureWidth(bulletStr: string) {
  let width = measureCache.get(bulletStr)

  if (width === undefined) {
    // 25.6 is almost same width with the regular whitespace
    width = [...bulletStr].reduce((total, l) => total + (letters[l] ?? 25.6), 0)
    measureCache.set(bulletStr, width)
  }

  return width
}
