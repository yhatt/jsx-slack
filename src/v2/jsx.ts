/* eslint-disable dot-notation, import/export, no-redeclare, @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

export interface BuiltInComponent<P> extends JSXSlack.FunctionalComponent<P> {
  readonly $$jsxslackComponent: BuiltInComponentMeta
}

export interface BuiltInComponentMeta {
  name: string
  identifier?: symbol
}

/**
 * The helper function to cast the output type from JSX element to `any`. Just
 * returns the passed value with no operations.
 *
 * This function is provided for TypeScript user and migrated user from
 * jsx-slack v1.
 *
 * @param element - JSX element
 * @return The passed JSX element with no-ops
 */
export function JSXSlack(element: JSXSlack.JSX.Element): any {
  return element
}

/**
 * Create the component for JSON payload building with jsx-slack.
 *
 * The passed functional component has to return JSON object or null, to build
 * JSON payload for Slack. Unlike a simple functional component defined by
 * JavaScript function, the output would be always preserved in JSON even if it
 * was an array.
 *
 * @remarks
 * `createComponent()` is an internal helper to create built-in components for
 * jsx-slack. Typically user must use a simple function definition of JavaScript
 * to create the functional component.
 *
 * @internal
 * @param name - Component name for showing in debug log
 * @param component - The functional component to turn into jsx-slack component
 * @param meta - An optional metadata for jsx-slack component
 * @return A created jsx-slack component
 */
export const createComponent = <P extends {}, O extends object>(
  name: string,
  component: (props: JSXSlack.Props<P>) => O | null,
  meta: Omit<BuiltInComponentMeta, 'name'> = {}
): BuiltInComponent<P> =>
  Object.defineProperty(component, '$$jsxslackComponent', {
    value: Object.freeze(
      Object.defineProperty({ ...meta }, 'name', {
        value: name || '[Anonymous component]',
        enumerable: true,
      })
    ),
  })

/**
 * Verify the passed function is a jsx-slack component.
 *
 * @internal
 * @param fn - A function to verify
 * @return `true` if the passed object was a jsx-slack component., otherwise
 *   `false`
 */
export const isValidComponent = <T = any>(
  fn: unknown
): fn is BuiltInComponent<T> =>
  typeof fn === 'function' &&
  !!Object.prototype.hasOwnProperty.call(fn, '$$jsxslackComponent')

/**
 * Verify the passed object is a jsx-slack element created from built-in
 * component.
 *
 * @param element - An object to verify
 * @return `true` if the passed object was a jsx-slack element created from
 *   built-in component, otherwise `false`
 */
export const isValidElementFromComponent = (
  obj: unknown,
  componentIdentifier?: symbol
): obj is JSXSlack.JSX.Element =>
  JSXSlack.isValidElement(obj) &&
  isValidComponent(obj.$$jsxslack.type) &&
  (!componentIdentifier ||
    obj.$$jsxslack.type.$$jsxslackComponent.identifier === componentIdentifier)

export namespace JSXSlack {
  interface StringLike {
    toString: () => string
  }

  type ChildElement = Node | string | StringLike | boolean | null | undefined
  type Child = ChildElement | ChildElement[]
  type Children = Child | Child[]
  type FilteredChild = Extract<ChildElement, object | string>

  type MapCallbackFn<T> = (
    this: FilteredChild | null,
    child: FilteredChild | null,
    index: number
  ) => T

  export type Props<P = any> = { children?: Children } & P

  export type FunctionalComponent<P extends {} = {}> = (
    props: Props<P>
  ) => Node | null

  export type FC<P extends {} = {}> = FunctionalComponent<P>

  export interface Node<P extends {} = any> {
    readonly $$jsxslack: {
      type: FC<P> | string
      props: Props<P>
      children: Child[]
    }
  }

  /**
   * Verify the passed object is a jsx-slack element.
   *
   * @param element - An object to verify
   * @return `true` if the passed object was a jsx-slack element, otherwise
   *   `false`
   */
  export const isValidElement = (obj: unknown): obj is JSXSlack.JSX.Element =>
    typeof obj === 'object' && !!obj?.hasOwnProperty('$$jsxslack')

  /**
   * Create and return a new jsx-slack element of the given type.
   *
   * The `type` argument can be either a component function, a tag name string
   * such as `'strong'` or `'em'`, and a fragment (`JSXSlack.Fragment`).
   *
   * NOTE: You won't typically invoke this directly if you are using JSX.
   *
   * @param type - A component function, fragment, or intrinsic HTML tag name
   * @param props - Property values to pass into the element for creation
   * @param children - Children elements of a new jsx-slack element
   * @return A new jsx-slack element
   */
  export const createElement = (
    type: FC | keyof JSXSlack.JSX.IntrinsicElements,
    props: Props | null = null,
    ...children: Child[]
  ): JSX.Element | null => {
    let rendered: Node | null = Object.create(null)

    if (typeof type === 'function') {
      const p = { ...(props || {}) }

      if (children.length === 1) [p.children] = children
      else if (children.length > 1) p.children = children

      rendered = type(p)
    }

    if (rendered && typeof rendered === 'object' && !rendered?.$$jsxslack)
      Object.defineProperty(rendered, '$$jsxslack', {
        value: { type, props, children },
      })

    return rendered
  }

  /** An alias to `JSXSlack.createElement`. */
  export const h = createElement

  const fragmentIdentifier = Symbol('Fragment')

  /**
   * Group a list of JSX elements.
   *
   * Typically the component for jsx-slack should return a single JSX element.
   * Wrapping multiple elements in `JSXSlack.Fragment` lets you return a list of
   * children.
   */
  export const Fragment = createComponent<
    { children: Children },
    ChildElement[]
  >(
    'Fragment',
    ({ children }) => (Array.isArray(children) ? children : [children]),
    { identifier: fragmentIdentifier }
  )

  /**
   * Make flatten JSX elements into an array consited by allowed children and
   * `null`.
   *
   * @remarks
   * This function does not traverse children of the built-in component,
   * included `JSXSlack.Fragment`.
   *
   * @internal
   * @param children - The target child or children
   */
  const flat = (children: Children) =>
    (Array.isArray(children) && !isValidElementFromComponent(children)
      ? children
      : [children]
    ).reduce<(FilteredChild | null)[]>((reducer, child) => {
      if (Array.isArray(child) && !isValidElementFromComponent(child)) {
        reducer.push(...flat(child))
      } else if (child == null || child === true || child === false) {
        reducer.push(null)
      } else {
        reducer.push(child)
      }

      return reducer
    }, [])

  /**
   * Provide utilities for dealing with the `props.children` opaque data
   * structure.
   */
  export const Children = {
    /**
     * Return the total number of elements in `children`.
     *
     * It would be same as the number of times `JSXSlack.Children.map()` would
     * invoke the callback.
     *
     * @param children - The target element(s) to count
     * @return The total number of elements in the passed children
     */
    count: (children: Children): number =>
      children == null ? 0 : flat(children).length,

    /**
     * Like `JSXSlack.Children.map()`, but no return value.
     *
     * @param children - The target element(s) to traverse
     * @param callbackFn - Callback function
     */
    forEach: (children: Children, callbackFn: MapCallbackFn<void>) => {
      Children.map(children, callbackFn)
    },

    /**
     * Invoke callback function on every immediate child in `children`.
     *
     * The callback function allows up to 2 arguments compatible with
     * `Array.prototype.map()`, and `this` will be a traversed child. The
     * callback can return any value for transforming, or the nullish value for
     * to skip mapping.
     *
     * @remarks
     * When the passed `children` is `null` or `undefined`, this function
     * returns the passed value instead of an array as it is.
     *
     * If `JSXSlack.Fragment` was passed as `children`, it will be treated as _a
     * single child_. The callback won't invoke with every child of the
     * fragment.
     *
     * @param children - The target element(s) to traverse
     * @param callbackFn - Callback function
     * @return An array of the value returned by callback function, or nullish
     *   value when passed `null` or `undefined`.
     */
    map: <T>(children: Children, callbackFn: MapCallbackFn<T>) => {
      if (children == null) return children

      return flat(children).reduce<T[]>((reducer, child, idx) => {
        const ret = callbackFn.call(child, child, idx)
        if (ret != null) reducer.push(ret)

        return reducer
      }, [])
    },

    only: (children: Children): JSX.Element => {
      if (isValidElement(children)) return children

      throw new Error(
        'JSXSlack.Children.only expected to receive a single JSXSlack element child.'
      )
    },

    toArray: (children: Children) =>
      flat(children).reduce<FilteredChild[]>((reducer, child) => {
        if (child == null) return reducer

        // Flatten fragment
        if (isValidElementFromComponent(child, fragmentIdentifier))
          return reducer.concat(Children.toArray([...(child as any)]))

        return [...reducer, child]
      }, []),
  }

  export namespace JSX {
    export interface Element extends Node {}
    export interface IntrinsicElements {}
    export interface ElementAttributesProperty {
      props: {}
    }
    export interface ElementChildrenAttribute {
      children: {}
    }
  }
}
