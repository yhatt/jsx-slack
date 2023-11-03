import { JSXSlack } from '../jsx'
import {
  cleanMeta,
  createElementInternal,
  isValidComponent,
} from '../jsx-internals'

export const assignMetaFrom = <T extends object>(
  element: JSXSlack.Node,
  obj: T,
): T & JSXSlack.Node =>
  Object.defineProperty(obj as any, '$$jsxslack', { value: element.$$jsxslack })

export const alias = (
  element: JSXSlack.Node,
  to: JSXSlack.FC<any>,

  /**
   * Whether preserve metadata from the origin of alias. A resolved tag name
   * would not make surprise to user.
   *
   * **WARN**: Turn off this by setting `false` if the aliased element had
   * non-enumerable unique metadata.
   */
  preserveOriginMeta = true,
): JSXSlack.Node | null => {
  const aliased = createElementInternal(
    to,
    element.$$jsxslack.props,
    ...element.$$jsxslack.children,
  )

  return preserveOriginMeta && typeof aliased === 'object' && aliased
    ? assignMetaFrom(element, cleanMeta(aliased))
    : aliased
}

export const resolveTagName = (element: unknown): string | undefined => {
  if (JSXSlack.isValidElement(element)) {
    if (typeof element.$$jsxslack.type === 'string')
      return `<${element.$$jsxslack.type}>`

    if (isValidComponent(element.$$jsxslack.type))
      return `<${element.$$jsxslack.type.$$jsxslackComponent.name}>`
  }
  return undefined
}
