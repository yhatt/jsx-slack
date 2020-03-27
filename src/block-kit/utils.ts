import { JSXSlack, isValidComponent } from '../jsx'

export const alias = (element: JSXSlack.Node, to: JSXSlack.FC<any>) =>
  JSXSlack.h(to, element.$$jsxslack.props, ...element.$$jsxslack.children)

export const assignMetaFrom = <T extends {}>(element: JSXSlack.Node, obj: T) =>
  Object.defineProperty(obj, '$$jsxslack', { value: element.$$jsxslack }) as T

export const resolveTagName = (element: unknown): string | undefined => {
  if (JSXSlack.isValidElement(element)) {
    if (typeof element.$$jsxslack.type === 'string')
      return `<${element.$$jsxslack.type}>`

    if (isValidComponent(element.$$jsxslack.type))
      return `<${element.$$jsxslack.type.$$jsxslackComponent.name}>`
  }
  return undefined
}
