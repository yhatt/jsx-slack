import { JSXSlack, isValidComponent } from '../jsx'

export const assignMetaFrom = <T extends object>(
  element: JSXSlack.Node,
  obj: T
): T & JSXSlack.Node =>
  Object.defineProperty(obj, '$$jsxslack', { value: element.$$jsxslack })

export const alias = (
  element: JSXSlack.Node,
  to: JSXSlack.FC<any>
): JSXSlack.Node => {
  const aliased = JSXSlack.h(
    to,
    element.$$jsxslack.props,
    ...element.$$jsxslack.children
  )

  if (Array.isArray(aliased)) return assignMetaFrom(element, [...aliased])
  if (typeof aliased === 'object')
    return assignMetaFrom(element, { ...aliased })

  return aliased
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
