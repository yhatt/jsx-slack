/** @jsx JSXSlack.h */
import { JSXSlack } from './jsx'

export enum SpecialLink {
  ChannelMention,
  EveryoneMention,
  HereMention,
  PublicChannel,
  UserGroupMention,
  UserMention,
}

const spLinkMatcher = /^(#C|@[SUW])[A-Z0-9]{8}$/

export function ArrayOutput<P = any>(props: {
  children: JSXSlack.Children<P>
}) {
  return JSXSlack.h(JSXSlack.NodeType.array, props)
}

export const ObjectOutput = <P extends {} = any>(props: P) =>
  JSXSlack.h(JSXSlack.NodeType.object, props)

export const PlainText = (props: { children: JSXSlack.Children<{}> }) =>
  JSXSlack.h(JSXSlack.NodeType.string, props)

export const Html = (props: { children: JSXSlack.Children<{}> }) =>
  JSXSlack.h(JSXSlack.NodeType.html, props)

export function wrap<T>(children: T | T[]): T[] {
  if (Array.isArray(children)) return children
  if (children) return [children]

  return []
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
