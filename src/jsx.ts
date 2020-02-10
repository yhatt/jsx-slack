/* eslint-disable import/export, @typescript-eslint/no-namespace */
import mrkdwn from './mrkdwn/index'
import { escapeChars, escapeEntity, parse } from './html'
import { IntrinsicProps, flattenDeep, wrap } from './utils'
import { InputProps, TextareaProps } from './block-kit/Input'
import { ButtonProps } from './block-kit/elements/Button'
import {
  SelectProps,
  OptionProps,
  OptgroupProps,
} from './block-kit/elements/Select'

let internalExactMode = false

enum ParseMode {
  normal,
  plainText,
  HTML,
}

export interface ParseContext {
  builts: string[]
  elements: string[]
  mode: ParseMode
}

export function JSXSlack(node: JSXSlack.Node) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return parseJSX(node, { builts: [], elements: [], mode: ParseMode.normal })
}

function parseJSX(node: JSXSlack.Node, context: ParseContext) {
  const children = JSXSlack.normalizeChildren(
    node.props.children || node.children || []
  )

  const processString = (str: string, ctx: ParseContext) =>
    ctx.mode !== ParseMode.HTML ? str : escapeEntity(str)

  const toArray = (nextCtx = context): any[] =>
    children.reduce((arr, c) => {
      const ctx = { ...nextCtx, builts: arr }
      const ret =
        typeof c === 'string' ? processString(c, ctx) : parseJSX(c, ctx)

      return [...ctx.builts, ...(ret ? [ret] : [])]
    }, [] as any[])

  switch (node.type) {
    case JSXSlack.NodeType.object:
      return Object.keys(node.props).reduce(
        (obj, k) =>
          node.props[k] !== undefined ? { ...obj, [k]: node.props[k] } : obj,
        {}
      )
    case JSXSlack.NodeType.array:
      return toArray()
    case JSXSlack.NodeType.html:
      return mrkdwn(toArray({ ...context, mode: ParseMode.HTML }).join(''))
    case JSXSlack.NodeType.escapeInHtml:
      return escapeChars(toArray().join(''))
    case JSXSlack.NodeType.string:
      return toArray({ ...context, mode: ParseMode.plainText }).join('')
    default:
      if (typeof node.type === 'string') {
        context.elements.push(node.type)

        try {
          if (context.mode === ParseMode.plainText) return toArray()
          return parse(node.type, node.props, toArray(), context)
        } finally {
          context.elements.pop()
        }
      }
      throw new Error(`Unknown node type: ${node.type}`)
  }
}

// eslint-disable-next-line no-redeclare
export namespace JSXSlack {
  export enum NodeType {
    object, // Output props as JSON object
    array, // Output children as array
    string, // Output plain text string
    html, // Format children text with HTML-like elements
    escapeInHtml,
  }

  type ChildElement<P> =
    | Node<P>
    | string
    | number // toString to normalize
    | boolean // Remove to normalize
    | null // Remove to normalize
    | undefined // Remove to normalize

  export type Child<P> = ChildElement<P> | ChildElement<P>[]
  export type Children<P> = Child<P> | Child<P>[]

  // By default, component does not allow children.
  type Props<P> = { children?: unknown } & P

  export type FC<P extends {} = {}> = (props: Props<P>) => Node | null

  export interface Node<P extends {} = any> {
    type: FC<P> | string | NodeType
    props: Props<P>
    children: Child<any>[]
  }

  export const h = <P extends {}>(
    type: FC<P> | string | NodeType,
    props: Props<P> | null,
    ...children: Child<any>[]
  ): JSX.Element | null => {
    if (typeof type === 'function') {
      const passProps: Props<P> = { ...(props || {}) } as any

      // Unpack children to keep prop type strictly
      if (children.length === 1) [passProps.children] = children
      else if (children.length > 1) passProps.children = children

      return type(passProps)
    }
    return { children, type, props: props || {} }
  }

  export const Fragment: FC<{ children: Children<{}> }> = ({ children }) =>
    children as JSX.Element

  // Setting exact mode
  export const exactMode = (mode?: boolean) => {
    if (mode !== undefined) internalExactMode = mode
    return internalExactMode
  }

  // Remove conditional value from children
  export const normalizeChildren = (cr: Children<any>): (Node | string)[] =>
    flattenDeep(wrap(cr))
      .filter(c => c != null && c !== false && c !== true)
      .map(c => (typeof c !== 'object' ? c.toString() : c))

  export namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Element extends Node {}
    export interface IntrinsicElements {
      a: { href: string; children?: Children<any> }
      b: {}
      blockquote: {}
      br: {}
      button: IntrinsicProps<ButtonProps>
      code: {}
      del: {}
      em: {}
      hr: { id?: string }
      i: {}
      img: { alt: string; id?: string; src: string; title?: string }
      input: IntrinsicProps<InputProps>
      li: {}
      ol: { start?: number; children: Children<any> }
      optgroup: OptgroupProps
      option: OptionProps
      p: {}
      pre: {}
      s: {}
      section: { id?: string; children: Children<any> }
      select: IntrinsicProps<SelectProps>
      small: {}
      span: {}
      strike: {}
      strong: {}
      textarea: IntrinsicProps<TextareaProps>
      time: {
        datetime: string | number | Date
        fallback?: string
        children?: Children<any>
      }
      ul: {}
    }
    export interface ElementAttributesProperty {
      props: {}
    }
    export interface ElementChildrenAttribute {
      children: {}
    }
  }
}
