/* eslint-disable no-new-wrappers */
import he from 'he'
import htm from 'htm/mini'
import * as blockKitComponents from './components'
import { JSXSlack } from './index'

interface JSXSlackTemplateTag {
  (template: TemplateStringsArray, ...substitutions: any[]): any

  /** @deprecated `jsxslack.raw` is now just an alias to `jsxslack`. It has been deprecated and will remove in future version so you should use `jsxslack` instead. */
  readonly raw: JSXSlackTemplateTag
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

const render = htm.bind((type, props, ...children) =>
  JSXSlack.h(
    ((): any => {
      const func = normalize(type)

      if (
        typeof func === 'string' &&
        Object.prototype.hasOwnProperty.call(blockKitComponents, func)
      )
        return blockKitComponents[func]

      return func
    })(),
    props
      ? Object.keys(props).reduce(
          (p, k) => ({ ...p, [k]: normalize(props[k], true) }),
          {}
        )
      : props,
    ...children.map((c) => normalize(c))
  )
)

export const jsxslack = ((template, ...substitutions) =>
  render(
    template,
    ...substitutions.map((s) =>
      typeof s === 'string'
        ? Object.defineProperty(new String(s), stringSubsitutionSymbol, {
            value: true,
          })
        : s
    )
  )) as JSXSlackTemplateTag

// Deprecated jsxslack.raw
Object.defineProperty(jsxslack, 'raw', { value: jsxslack })
