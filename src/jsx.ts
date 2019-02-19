/* eslint-disable import/export, @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import flattenDeep from 'lodash.flattendeep'
import { parse } from './html'
import { wrap } from './utils'

export function JSXSlack(elm: JSXSlack.Node, plainText: boolean = false) {
  const processedChildren = (pt: boolean = plainText): any[] => {
    if (elm.children == null || typeof elm.children === 'boolean') return []

    return wrap(elm.children)
      .map(e => (typeof e === 'string' ? e : JSXSlack(e, pt)))
      .filter(e => e)
  }

  switch (elm.node) {
    case JSXSlack.NodeType.object:
      return elm.props
    case JSXSlack.NodeType.array:
      return processedChildren()
    case JSXSlack.NodeType.string:
      return processedChildren()
        .map(e => e.toString())
        .join('')
    case JSXSlack.NodeType.plainText:
      return processedChildren(true)
        .map(e => e.toString())
        .join('')
    default:
      if (typeof elm.node === 'string') {
        if (plainText) return processedChildren()
        return parse(elm.node, elm.props, processedChildren())
      }

      throw new Error(`Unknown node type: ${elm.node}`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace JSXSlack {
  export type Child = Node | string | boolean | null | undefined
  export type Children = Child | Child[]

  export enum NodeType {
    object,
    array,
    string,
    plainText,
  }

  export interface Node<P = any> {
    node: FC<P> | string | NodeType
    props: P
    children: (Node | string)[]
  }

  export type FC<P> = (
    props: Readonly<{ children?: unknown } & P>
  ) => Node | null

  export const h = <P = {}>(
    type: FC<P> | string | NodeType,
    props: P | undefined,
    ...rest: Children[]
  ): JSX.Element => {
    const children = flattenDeep(rest).filter(
      c => c != null && typeof c !== 'boolean'
    ) as (Node | string)[]

    if (typeof type === 'function') {
      return (type as any)({
        ...(props || {}),
        children: children.length === 0 ? undefined : children,
      })
    }

    return {
      node: type,
      props: props || {},
      children,
    }
  }

  const nodeCreator = (type: NodeType): FC<{ children: Children }> => ({
    children,
  }) => h(type, {}, ...wrap(children))

  export const Arr = nodeCreator(NodeType.array)
  export const Str = nodeCreator(NodeType.string)
  export const Plain = nodeCreator(NodeType.plainText)

  export const Obj = <P extends {}>(props: Readonly<P>): Node<P> => {
    const collected = {}

    for (const key of Object.keys(props)) {
      if (key !== 'children') collected[key] = props[key]
    }

    return h(NodeType.object, collected)
  }

  export namespace JSX {
    export interface Element extends Node {}
    export interface IntrinsicElements {
      a: { href: string }
      b: {}
      blockquote: {}
      br: {}
      code: {}
      del: {}
      em: {}
      hr: { id?: string }
      i: {}
      img: { alt: string; id?: string; src: string; title?: string }
      li: {}
      p: {}
      pre: {}
      s: {}
      section: { id?: string; children: Children }
      strong: {}
      time: { datetime: string | number; fallback?: string }
      ul: {}
    }
    export interface ElementAttributesProperty {
      props
    }
    export interface ElementChildrenAttribute {
      children
    }
  }
}
