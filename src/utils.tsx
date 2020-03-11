/** @jsx JSXSlack.h */
import { JSXSlack } from './jsx'

export type DistributedProps<
  P,
  K extends string | number | symbol = P extends never ? never : keyof P
> = P extends never ? never : P & { [U in Exclude<K, keyof P>]?: undefined }

export type IntrinsicProps<P> = P extends never
  ? never
  : Omit<P, 'actionId' | 'blockId' | 'hint'>

export enum SpecialLink {
  ChannelMention,
  EveryoneMention,
  HereMention,
  PublicChannel,
  UserGroupMention,
  UserMention,
}

const spLinkMatcher = /^(#C|@[SUW])[A-Z0-9]{8}$/
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

export const ArrayOutput = <P extends {} = any>(props: {
  children: JSXSlack.Children<P>
}) => JSXSlack.h(JSXSlack.NodeType.array, props)

export const ObjectOutput = <P extends {} = any>(props: P) =>
  JSXSlack.h(JSXSlack.NodeType.object, props)

export const PlainText = (props: { children: JSXSlack.Children<{}> }) =>
  JSXSlack.h(JSXSlack.NodeType.string, props)

export const Html = (props: { children: JSXSlack.Children<{}> }) =>
  JSXSlack.h(JSXSlack.NodeType.html, props)

export const isNode = <T extends {} = any>(v: any): v is JSXSlack.Node<T> =>
  typeof v === 'object' && v.type !== undefined

export function wrap<T>(children: T | T[]): T[] {
  if (Array.isArray(children)) return children
  if (children) return [children]

  return []
}

export const aliasTo = (component: JSXSlack.FC<any>, node: JSXSlack.Node) =>
  JSXSlack.h(
    component,
    node.props,
    ...wrap(node.props.children || node.children)
  )

export const makeConvertibleToJSON = (node: JSXSlack.Node): JSXSlack.Node => {
  Object.defineProperty(node, 'toJSON', { value: () => JSXSlack(node) })
  return node
}

export function detectSpecialLink(href: string): SpecialLink | undefined {
  if (href === '@channel') return SpecialLink.ChannelMention
  if (href === '@everyone') return SpecialLink.EveryoneMention
  if (href === '@here') return SpecialLink.HereMention

  const matched = href.match(spLinkMatcher)
  if (matched) {
    if (matched[1] === '#C') return SpecialLink.PublicChannel
    if (matched[1] === '@S') return SpecialLink.UserGroupMention
    if (matched[1] === '@U' || matched[1] === '@W')
      return SpecialLink.UserMention
  }

  return undefined
}

export function coerceToInteger(
  num: number | string | undefined
): number | undefined {
  if (num === undefined) return undefined

  const coerced = Number.parseInt(num.toString(), 10)
  if (Number.isNaN(coerced)) return undefined

  return coerced
}

export function intToAlpha(num: number): string {
  const int = coerceToInteger(num)
  if (int === undefined) return num.toString()
  if (int <= 0) return int.toString()

  const remaining = Math.floor((int - 1) / 26)
  const digits = remaining > 0 ? intToAlpha(remaining) : ''

  return digits + String.fromCharCode(((int - 1) % 26) + 97)
}

export function intToRoman(num: number): string {
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

export function flattenDeep<T = any>(arr: any[]): T[] {
  // Node.js >= 11 has supported Array.prototype.flat
  if ((Array.prototype as any).flat) return (arr as any).flat(Infinity)

  return Array.isArray(arr)
    ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [] as T[])
    : [arr]
}
