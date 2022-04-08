/* eslint-disable prefer-const -- for minimal output of JSX runtime */
/* eslint-disable @typescript-eslint/ban-types */
import type { JSXSlack } from './jsx'

const {
  defineProperty,
  create: objectCreate,
  keys: objectKeys,
  freeze: objectFreeze,
} = Object

const jsxSlackObjKey = '$$jsxslack' as const
const jsxSlackComponentObjKey = jsxSlackObjKey + `Component`

export interface BuiltInComponent<P extends {}> extends JSXSlack.FC<P> {
  readonly $$jsxslackComponent: { name: string } & Record<any, any>
}

export const createElementInternal = <P extends {} = {}>(
  type: JSXSlack.FC<P> | keyof JSXSlack.JSX.IntrinsicElements,
  props: P | null = null,
  ...children: JSXSlack.ChildElement[]
): JSXSlack.JSX.Element | null => {
  let rendered: JSXSlack.Node<P> | null = objectCreate(null)

  if (typeof type === 'function') {
    let p: JSXSlack.PropsWithChildren<P> = { ...(props || ({} as P)) }
    let { length } = children

    if (length === 1) [p.children] = children
    else if (length > 1) p.children = children

    rendered = type(p)
  }

  if (rendered && typeof rendered === 'object') {
    // Apply JSON normalization
    for (let key of objectKeys(rendered)) {
      if (rendered[key] === undefined) delete rendered[key]
    }

    if (!rendered[jsxSlackObjKey]) {
      // Children in metadata must be an array
      let metaChildren = children

      if (!children.length) {
        // Fallback to children props
        let { children: propsChildren } =
          (props as JSXSlack.PropsWithChildren<P>) || {}
        if (propsChildren !== undefined) {
          metaChildren = ([] as JSXSlack.ChildElement[]).concat(propsChildren)
        }
      }

      defineProperty(rendered, jsxSlackObjKey, {
        value: { type, props, children: metaChildren },
      })
    }
  }

  return rendered
}

/**
 * Create the component for JSON payload building with jsx-slack.
 *
 * The passed functional component has to return JSON object or `null`, to build
 * JSON payload for Slack. Unlike a simple functional component defined by
 * JavaScript function, the output would be always preserved in JSON even if it
 * was an array.
 *
 * @remarks
 * `createComponent()` is an internal helper to create built-in components for
 * jsx-slack. Typically user must use a simple function definition of JavaScript
 * to create the functional component.
 *
 * @param name - Component name for showing in debug log
 * @param component - The functional component to turn into jsx-slack component
 * @param meta - An optional metadata for jsx-slack component
 * @return A created jsx-slack component
 */
export const createComponent = <P extends {}, O extends object>(
  name: string,
  component: (props: P) => O | null,
  meta: Record<any, any> = {}
): BuiltInComponent<P> =>
  defineProperty(component as any, jsxSlackComponentObjKey, {
    value: objectFreeze(
      defineProperty({ ...meta }, 'name', {
        value: name,
        enumerable: true,
      })
    ),
  })

export const FragmentInternal = createComponent<
  { children: JSXSlack.ChildElements },
  JSXSlack.ChildElement[]
>('Fragment', ({ children }) =>
  // Should return array's shallow copy to remove metadata from array
  ([] as JSXSlack.ChildElement[]).concat(children)
)

/**
 * Verify the passed function is a jsx-slack component.
 *
 * @param fn - A function to verify
 * @return `true` if the passed object was a jsx-slack component, otherwise
 *   `false`.
 */
export const isValidComponent = <T = any>(
  fn: unknown
): fn is BuiltInComponent<T> =>
  typeof fn === 'function' &&
  !!Object.prototype.hasOwnProperty.call(fn, jsxSlackComponentObjKey)

export const isValidElementInternal = (
  obj: unknown
): obj is JSXSlack.JSX.Element =>
  typeof obj === 'object' &&
  !!obj &&
  !!Object.prototype.hasOwnProperty.call(obj, jsxSlackObjKey)

/**
 * Verify the passed object is a jsx-slack element created from built-in
 * component.
 *
 * @param element - An object to verify
 * @param component - The optional component to match while verifying
 * @return `true` if the passed object was a jsx-slack element created from
 *   built-in component, otherwise `false`
 */
export const isValidElementFromComponent = (
  obj: unknown,
  component?: JSXSlack.FunctionComponent<any>
): obj is JSXSlack.JSX.Element =>
  isValidElementInternal(obj) &&
  isValidComponent(obj[jsxSlackObjKey].type) &&
  (!component || obj[jsxSlackObjKey].type === component)

/**
 * Clean up hidden meta value for jsx-slack from object.
 *
 * If the built-in component has nested JSX output such as alias, a hidden
 * metadata can reference an internal JSX from the public partial object. An
 * internal would not matter for jsx-slack user, so the error message displaying
 * private JSX info may confuse.
 *
 * It just re-assigns public objects into new object, but this helper makes
 * clear its purpose.
 *
 * @param element - The object with meta value for jsx-slack
 * @return The object without meta value
 */
export const cleanMeta = <T extends object>(
  element: T
): T extends Array<infer R> ? Array<R> : Omit<T, keyof JSXSlack.Node> =>
  (Array.isArray(element) ? [...element] : { ...element }) as any
