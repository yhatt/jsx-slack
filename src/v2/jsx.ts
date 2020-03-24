/* eslint-disable dot-notation, import/export, no-redeclare, @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

/**
 * The type helper to pass through the element with casting to any type.
 *
 * This function is provided for TS user and migrated user from jsx-slack v1.
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
 * JSON payload for Slack. Unlike a simple functional component defined by JS
 * func, the output would be always preserved in JSON even if it was an array.
 *
 * @param component - The functional component to turn into jsx-slack component
 * @return A created jsx-slack component
 */
export const createComponent = <P extends {}, O extends object>(
  component: (props: JSXSlack.Props<P>) => O | null
): JSXSlack.FunctionalComponent<P> => {
  Object.defineProperty(component, '$$jsxslackComponent', { value: true })
  return component as JSXSlack.FunctionalComponent<P>
}

export namespace JSXSlack {
  interface StringLike {
    toString: () => string
  }

  type ChildElement =
    | Node
    | string
    | StringLike
    | boolean // Remove when calling Children.toArray()
    | null // Remove when calling Children.toArray()
    | undefined // Remove when calling Children.toArray()

  type Child = ChildElement | ChildElement[]
  type Children = Child | Child[]
  type FilteredChild = Extract<ChildElement, object | string>

  export type Props<P = any> = { children?: Children } & P

  export type FunctionalComponent<P extends {} = {}> = (
    props: Props<P>
  ) => Node | null

  export type FC<P extends {} = {}> = FunctionalComponent<P>

  export interface Node<P extends {} = any> {
    $$jsxslack: { type: FC<P> | string; props: Props<P>; children: Child[] }
  }

  /**
   * Verify the passed object is a jsx-slack element.
   *
   * @param element - An object to verify
   * @return `true` if the passed object was a jsx-slack element, otherwise `false`.
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

  /**
   * Group a list of JSX elements.
   *
   * Typically the component for jsx-slack should return a single JSX element.
   * Wrapping multiple elements in `JSXSlack.Fragment` lets you return a list of
   * children.
   */
  export const Fragment: FC<{ children: Children }> = ({ children }) =>
    children as Node

  /**
   * Provide utilities for dealing with the `props.children` opaque data structure.
   */
  export const Children = {
    count: (children: Children): number => {
      if (children === null || children === undefined) return 0
      return Array.isArray(children) ? children.length : 1
    },

    flat: (children: Children) => {
      const reducer: FilteredChild[] = []

      Children.forEach(children, (child) =>
        Array.isArray(child) &&
        !(isValidElement(child) && child.$$jsxslack.type['$$jsxslackComponent'])
          ? reducer.push(...Children.flat(child))
          : reducer.push(child)
      )

      return reducer
    },

    forEach: (
      children: Children,
      callbackFn: (
        value: FilteredChild,
        index: number,
        array: FilteredChild[]
      ) => void
    ): void => {
      Children.map(children, callbackFn)
    },

    map: <T>(
      children: Children,
      callbackFn: (
        value: FilteredChild,
        index: number,
        array: FilteredChild[]
      ) => T
    ): T[] | null | undefined => {
      if (children === null || children === undefined) return children
      return Children.toArray(children).map<T>(callbackFn)
    },

    only: (children: Children): Child => {
      if (Children.count(children) === 1) return children

      throw new Error(
        'JSXSlack.Children.only expected to receive a single JSXSlack element child.'
      )
    },

    toArray: (children: Children) =>
      (Array.isArray(children) ? children : [children]).filter(
        (c): c is FilteredChild => c != null && c !== false && c !== true
      ),
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
