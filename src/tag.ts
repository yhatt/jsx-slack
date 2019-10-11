/* eslint-disable no-new-wrappers */
import he from 'he'
import htm from 'htm'
import flattenDeep from 'lodash.flattendeep'
import * as blockKitComponents from './components'
import * as dialogComponents from './dialog/components'
import { JSXSlack } from './index'

type JSXSlackTemplate<T = any> = (
  template: TemplateStringsArray,
  ...substitutions: any[]
) => T

interface JSXSlackTemplateTag extends JSXSlackTemplate {
  readonly fragment: JSXSlackTemplate
}

interface VirtualNode {
  type: any
  props: object | null
  children: any[]
}

const stringSubsitutionSymbol = Symbol('jsxslackStringSubsitution')

const isString = (value: any): value is string =>
  Object.prototype.toString.call(value) === '[object String]'

const normalize = (value: any, isAttributeValue = false) => {
  if (isString(value)) {
    if (value[stringSubsitutionSymbol]) return value.toString()
    return he.decode(value, { isAttributeValue })
  }
  return value
}

const firstPass: JSXSlackTemplate<VirtualNode | VirtualNode[]> = htm.bind(
  (type, props, ...children): VirtualNode => ({
    type: normalize(type),
    props: props
      ? Object.keys(props).reduce(
          (prps, key) => ({ ...prps, [key]: normalize(props[key], true) }),
          {}
        )
      : props,
    children: flattenDeep(children.map(c => normalize(c))),
  })
)

const render = (parsed: unknown) => {
  if (typeof parsed === 'object' && parsed) {
    const node = parsed as VirtualNode

    return JSXSlack.h(
      node.type,
      node.props,
      ...node.children.map(c => render(c))
    )
  }
  return parsed
}

// Resolve built-in components
const resolveComponent = (target: unknown, context: any = undefined) => {
  if (!(typeof target === 'object' && target)) return target

  const node = target as VirtualNode
  let { type } = node

  if (typeof type === 'string') {
    if (
      type.startsWith('Dialog.') &&
      Object.prototype.hasOwnProperty.call(dialogComponents, type.slice(7))
    ) {
      // `Dialog.` prefix
      type = dialogComponents[type.slice(7)]
    } else if (context && Object.prototype.hasOwnProperty.call(context, type)) {
      // Resolve from current context
      type = context[type]
    } else if (Object.prototype.hasOwnProperty.call(blockKitComponents, type)) {
      // Block Kit (default)
      type = blockKitComponents[type]
    } else if (Object.prototype.hasOwnProperty.call(dialogComponents, type)) {
      // Dialog (when not resolved in others)
      type = dialogComponents[type]
    }
  }

  let childrenContext: any = context

  if (!childrenContext) {
    if (type === blockKitComponents.Blocks) childrenContext = blockKitComponents
    if (type === dialogComponents.Dialog) childrenContext = dialogComponents
  }

  return {
    type,
    props: node.props,
    children: node.children.map(c => resolveComponent(c, childrenContext)),
  }
}

const parse = (template: TemplateStringsArray, ...substitutions: any[]) => {
  const parsed = firstPass(
    template,
    ...substitutions.map(s =>
      typeof s === 'string'
        ? Object.defineProperty(new String(s), stringSubsitutionSymbol, {
            value: true,
          })
        : s
    )
  )

  return Array.isArray(parsed)
    ? parsed.map(p => render(resolveComponent(p)))
    : render(resolveComponent(parsed))
}

const jsxslack: JSXSlackTemplateTag = Object.defineProperty(
  (template: TemplateStringsArray, ...substitutions: any[]) =>
    JSXSlack(parse(template, ...substitutions)),
  'fragment',
  { value: parse }
)

export default jsxslack
