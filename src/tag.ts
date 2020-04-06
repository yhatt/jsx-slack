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

const strSubSymbol = Symbol('jsx-slack-subsitution')

const isString = (value: any): value is string =>
  Object.prototype.toString.call(value) === '[object String]'

const normalize = (value: any, isAttributeValue = false) => {
  if (isString(value)) {
    if (value[strSubSymbol]) return value.toString()
    return he.decode(value, { isAttributeValue })
  }
  return value
}

const normalizeType = (type: any): any => {
  const func = normalize(type)

  return typeof func === 'string' &&
    Object.prototype.hasOwnProperty.call(blockKitComponents, func)
    ? blockKitComponents[func]
    : func
}

const render = htm.bind((type, props, ...children) =>
  JSXSlack.h(
    normalizeType(type),
    props
      ? Object.keys(props).reduce(
          (p, k) => ({ ...p, [k]: normalize(props[k], true) }),
          {}
        )
      : props,
    ...children.map((c) => normalize(c))
  )
)

export const jsxslack =
  ((template, ...substitutions) =>
    render(
      template,
      ...substitutions.map((s) =>
        isString(s)
          ? Object.defineProperty(new String(s), strSubSymbol, { value: true })
          : s
      )
    )) as JSXSlackTemplateTag

// Deprecated jsxslack.raw
Object.defineProperty(jsxslack, 'raw', {
  value: (...params: Parameters<JSXSlackTemplateTag>) => {
    console.warn(
      '[DEPRECATION WARNING] `jsxslack.raw` is now just an alias to `jsxslack`. It has been deprecated and will remove in future version so you should use `jsxslack` instead.'
    )
    return jsxslack(...params)
  },
})
