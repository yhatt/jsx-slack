/* eslint-disable no-new-wrappers */
import he from 'he'
import htm from 'htm'
import flattenDeep from 'lodash.flattendeep'
import * as blockKitComponents from './components'
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

const render = (parsed: VirtualNode) => {
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
const resolveComponent = (target: unknown) => {
  if (!(typeof target === 'object' && target)) return target

  const node = target as VirtualNode
  let { type } = node

  if (
    typeof type === 'string' &&
    Object.prototype.hasOwnProperty.call(blockKitComponents, type)
  )
    type = blockKitComponents[type]

  return {
    type,
    props: node.props,
    children: node.children.map(c => resolveComponent(c)),
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
