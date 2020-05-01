export type DistributedProps<
  P,
  K extends string | number | symbol = P extends never ? never : keyof P
> = P extends never ? never : P & { [U in Exclude<K, keyof P>]?: never }

type SpecialLink = '@channel' | '@everyone' | '@here' | '#C' | '@S' | '@UW'

const romanNumerals = {
  m: 1000,
  cm: 900,
  d: 500,
  cd: 400,
  c: 100,
  xc: 90,
  l: 50,
  xl: 40,
  x: 10,
  ix: 9,
  v: 5,
  iv: 4,
  i: 1,
}

export const detectSpecialLink = (href: string): SpecialLink | undefined => {
  if (href === '@channel' || href === '@everyone' || href === '@here')
    return href

  const matched = href.match(/^(#C|@[SUW])[A-Z0-9]{8,}$/)

  if (matched)
    return matched[1] === '#C' || matched[1] === '@S' ? matched[1] : '@UW'

  return undefined
}

export const coerceToInteger = (
  num: number | string | undefined
): number | undefined => {
  if (num === undefined) return undefined

  const coerced = Number.parseInt(num.toString(), 10)
  if (Number.isNaN(coerced)) return undefined

  return coerced
}

export const intToAlpha = (num: number): string => {
  const int = coerceToInteger(num)
  if (int === undefined) return num.toString()
  if (int <= 0) return int.toString()

  const remaining = Math.floor((int - 1) / 26)
  const digits = remaining > 0 ? intToAlpha(remaining) : ''

  return digits + String.fromCharCode(((int - 1) % 26) + 97)
}

export const intToRoman = (num: number): string => {
  let int = coerceToInteger(num)
  if (int === undefined) return num.toString()
  if (int <= 0 || int >= 4000) return int.toString()

  let str = ''

  for (const [roman, v] of Object.entries(romanNumerals)) {
    const rep = Math.floor(int / v)
    str += rep > 0 ? roman.repeat(rep) : ''
    int %= v
  }

  return str
}
