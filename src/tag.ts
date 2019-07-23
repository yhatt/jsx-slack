import htm from 'htm'
import * as components from './components'
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
  if (
    typeof type === 'string' &&
    Object.prototype.hasOwnProperty.call(components, type)
  ) {
    elm = components[type]
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
