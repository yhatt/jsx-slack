import htm from 'htm'
import * as blockKitComponents from './components'
import * as dialogComponents from './dialog/components'
import { JSXSlack } from './index'

type JSXSlackTemplate = (
  template: TemplateStringsArray,
  ...substitutions: any[]
) => any

interface JSXSlackTemplateTag extends JSXSlackTemplate {
  readonly fragment: JSXSlackTemplate
}

const parse: JSXSlackTemplate = htm.bind((type, props, ...children) => {
  let elm = type

  // Support built-in components without import
  if (typeof type === 'string') {
    if (
      type.startsWith('Dialog.') &&
      Object.prototype.hasOwnProperty.call(dialogComponents, type.slice(7))
    ) {
      // `Dialog.` prefix
      elm = dialogComponents[type.slice(7)]
    } else if (Object.prototype.hasOwnProperty.call(blockKitComponents, type)) {
      elm = blockKitComponents[type]
    } else if (Object.prototype.hasOwnProperty.call(dialogComponents, type)) {
      elm = dialogComponents[type]
    }
  }

  return JSXSlack.h(elm, props, ...children)
})

const jsxslack: JSXSlackTemplateTag = Object.defineProperty(
  (template: TemplateStringsArray, ...substitutions: any[]) =>
    JSXSlack(parse(template, ...substitutions)),
  'fragment',
  { value: parse }
)

export default jsxslack
