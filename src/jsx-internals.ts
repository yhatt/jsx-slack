/* eslint-disable @typescript-eslint/ban-types */
import type { JSXSlack } from './jsx'

export interface BuiltInComponent<P extends {}> extends JSXSlack.FC<P> {
  readonly $$jsxslackComponent: { name: string } & Record<any, any>
}

export const createElementInternal = (
  type: JSXSlack.FC | keyof JSXSlack.JSX.IntrinsicElements,
  props: JSXSlack.Props | null = null,
  ...children: JSXSlack.ChildElement[]
): JSXSlack.JSX.Element | null => {
  let rendered: JSXSlack.Node | null = Object.create(null)

  if (typeof type === 'function') {
    const p = { ...(props || {}) }

    if (children.length === 1) [p.children] = children
    else if (children.length > 1) p.children = children

    rendered = type(p)
  }

  if (rendered && typeof rendered === 'object') {
    // Apply JSON normalization
    for (const key of Object.keys(rendered)) {
      if (rendered[key] === undefined) delete rendered[key]
    }

    if (!rendered.$$jsxslack) {
      // Children in metadata must be an array
      let metaChildren = children

      if (children.length === 0) {
        // Fallback to children props
        const { children: propsChildren } = props || {}
        if (propsChildren !== undefined) metaChildren = [].concat(propsChildren)
      }

      Object.defineProperty(rendered, '$$jsxslack', {
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
  component: (props: JSXSlack.Props<P>) => O | null,
  meta: Record<any, any> = {}
): BuiltInComponent<P> =>
  Object.defineProperty(component as any, '$$jsxslackComponent', {
    value: Object.freeze(
      Object.defineProperty({ ...meta }, 'name', {
        value: name || '[Anonymous component]',
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
 * @return `true` if the passed object was a jsx-slack component., otherwise
 *   `false`
 */
export const isValidComponent = <T = any>(
  fn: unknown
): fn is BuiltInComponent<T> =>
  typeof fn === 'function' &&
  !!Object.prototype.hasOwnProperty.call(fn, '$$jsxslackComponent')

export const isValidElementInternal = (
  obj: unknown
): obj is JSXSlack.JSX.Element =>
  typeof obj === 'object' &&
  !!obj &&
  !!Object.prototype.hasOwnProperty.call(obj, '$$jsxslack')

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
  component?: JSXSlack.FunctionalComponent<any>
): obj is JSXSlack.JSX.Element =>
  isValidElementInternal(obj) &&
  isValidComponent(obj.$$jsxslack.type) &&
  (!component || obj.$$jsxslack.type === component)

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
