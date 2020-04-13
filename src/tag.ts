/* eslint-disable no-new-wrappers */
import he from 'he'
import htm from 'htm/mini'
import * as blockKitComponents from './components'
import { JSXSlack } from './index'

interface JSXSlackTemplateTag {
  (template: TemplateStringsArray, ...substitutions: any[]): any

  /**
   * An alias into `jsxslack` template literal tag.
   *
   * @deprecated `jsxslack.raw` has been deprecated and will remove in future
   * version so you should use `jsxslack` instead.
   */
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

/**
 * Template literal tag for rendering the JSX-compatible template into JSON.
 *
 * `jsxslack` allows using the template syntax almost the same as JSX, powered
 * by {@link https://github.com/developit/htm HTM (Hyperscript Tagged Markup) }.
 * You can build Block Kit JSON without setting JSX transpiler and importing
 * built-in components.
 *
 * ```javascript
 * const exampleBlocks = ({ name }) => jsxslack`
 *  <Blocks>
 *    <Section>
 *      Hello, <b>${name}</b>!
 *    </Section>
 *  </Blocks>
 * `
 * ```
 *
 * It has built-in fragments support so `<Fragment>` does not have to use even
 * if there are 2 and more elements.
 *
 * ```javascript
 * const Header = ({ children }) => jsxslack`
 *  <Section>
 *    <b>${children}</b>
 *  </Section>
 *  <Divider />
 * `
 * ```
 *
 * And you can use user-defined custom component by following:
 *
 * ```javascript
 * jsxslack`
 *  <Blocks>
 *    <${Header}>
 *      <i>jsx-slack custom block</i> :sunglasses:
 *    <//>
 *    <Section>Let's build your block.</Section>
 *  </Blocks>
 * `
 * ```
 *
 * Please notice to a usage of component that has a bit different syntax from
 * JSX. {@link https://github.com/developit/htm Learn about HTM syntax}.
 */
export const jsxslack = ((template, ...substitutions) =>
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
      '[DEPRECATION WARNING] `jsxslack.raw` is now just an alias into `jsxslack`. It has been deprecated and will remove in future version so you should use `jsxslack` instead.'
    )
    return jsxslack(...params)
  },
})
