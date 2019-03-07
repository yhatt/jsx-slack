import { bind } from 'htm'
import * as components from './components'
import { JSXSlack } from './index'

export default function jsxslack(...args) {
  return JSXSlack(
    bind((type, props, ...children) => {
      let elm = type

      if (
        typeof type === 'string' &&
        Object.prototype.hasOwnProperty.call(components, type)
      ) {
        elm = components[type]
      }

      return JSXSlack.h(elm, props, ...children)
    })(...args)
  )
}
