import htm from 'htm'
import * as components from './components'
import { JSXSlack } from './index'

type JSXSlackTemplate = (
  template: TemplateStringsArray,
  ...substitutions: any[]
) => any

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

const jsxslack = (template: TemplateStringsArray, ...substitutions: any[]) =>
  JSXSlack(parse(template, ...substitutions))

jsxslack.fragment = parse

export default jsxslack
