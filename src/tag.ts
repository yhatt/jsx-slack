import { bind } from 'htm'
import * as components from './components'
import { JSXSlack } from './index'

const parse = bind((type, props, ...children) => {
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

export default function jsxslack(...args) {
  return JSXSlack(parse(...args))
}
