/** @jsx JSXSlack.h */
import { JSXSlack } from './jsx'

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
