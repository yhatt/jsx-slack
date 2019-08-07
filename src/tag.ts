import htm from 'htm'
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
  e: any
  props: object | null
  children: any[]
}

const firstPass: JSXSlackTemplate<VirtualNode | VirtualNode[]> = htm.bind(
  (e, props, ...children): VirtualNode => ({ e, props, children })
)

const render = (parsed: any) =>
  typeof parsed === 'object'
    ? JSXSlack.h(parsed.e, parsed.props, ...parsed.children.map(c => render(c)))
    : parsed

const parse = (template: TemplateStringsArray, ...substitutions: any[]) => {
  const parsed = firstPass(template, ...substitutions)

  // Resolve built-in components
  const resolve = (target: VirtualNode, context: any = undefined) => {
    if (typeof target !== 'object') return target

    let { e } = target

    if (typeof e === 'string') {
      if (
        e.startsWith('Dialog.') &&
        Object.prototype.hasOwnProperty.call(dialogComponents, e.slice(7))
      ) {
        // `Dialog.` prefix
        e = dialogComponents[e.slice(7)]
      } else if (context && Object.prototype.hasOwnProperty.call(context, e)) {
        // Current context
        e = context[e]
      } else if (Object.prototype.hasOwnProperty.call(blockKitComponents, e)) {
        // Block Kit (default)
        e = blockKitComponents[e]
      } else if (Object.prototype.hasOwnProperty.call(dialogComponents, e)) {
        // Dialog (when not resolved in others)
        e = dialogComponents[e]
      }
    }

    let childrenContext: any = context

    if (!childrenContext) {
      if (e === blockKitComponents.Blocks) childrenContext = blockKitComponents
      if (e === dialogComponents.Dialog) childrenContext = dialogComponents
    }

    return {
      e,
      props: target.props,
      children: target.children.map(c => resolve(c, childrenContext)),
    }
  }

  return Array.isArray(parsed)
    ? parsed.map(p => render(resolve(p)))
    : render(resolve(parsed))
}

const jsxslack: JSXSlackTemplateTag = Object.defineProperty(
  (template: TemplateStringsArray, ...substitutions: any[]) =>
    JSXSlack(parse(template, ...substitutions)),
  'fragment',
  { value: parse }
)

export default jsxslack
