import htm from 'htm/mini'
import * as blockKitComponents from './components'
import { createElementInternal } from './jsx-internals'
import { he } from './prebundles/he'

type JSXSlackTemplateTag = (
  template: readonly string[],
  ...substitutions: any[]
) => any

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
  createElementInternal(
    normalizeType(type),
    props
      ? Object.keys(props).reduce(
          (p, k) => ({ ...p, [k]: normalize(props[k], true) }),
          {},
        )
      : props,
    ...children.map((c) => normalize(c)),
  ),
)

/**
 * Template literal tag for rendering the JSX-compatible template into JSON.
 *
 * `jsxslack` allows using the template syntax almost the same as JSX, powered
 * by [HTM (Hyperscript Tagged Markup)](https://github.com/developit/htm).
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
 * const Heading = ({ children }) => jsxslack`
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
 *    <${Heading}>
 *      <i>jsx-slack custom block</i> :sunglasses:
 *    <//>
 *    <Section>Let's build your block.</Section>
 *  </Blocks>
 * `
 * ```
 *
 * Please notice to a usage of component that has a bit different syntax from
 * JSX. [Learn about HTM syntax](https://github.com/developit/htm).
 */
export const jsxslack: JSXSlackTemplateTag = (template, ...substitutions) =>
  render(
    template as TemplateStringsArray,
    ...substitutions.map((s) =>
      isString(s)
        ? Object.defineProperty(new String(s), strSubSymbol, { value: true })
        : s,
    ),
  )
