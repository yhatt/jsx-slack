/** @jsx JSXSlack.h */
import { JSXSlack, createComponent, isValidComponent } from '../../jsx'

interface GenerateBlocksContainerOptions {
  aliases?: Record<string, JSXSlack.FC<any>>
  availableBlockTypes: string[]
  name: string
}

export const generateBlocksContainer = ({
  aliases = {},
  availableBlockTypes,
  name,
}: GenerateBlocksContainerOptions) =>
  createComponent<{ children: JSXSlack.ChildElements }, object[]>(
    name,
    ({ children }) =>
      JSXSlack.Children.toArray(children)
        .map((child) =>
          JSXSlack.isValidElement(child) &&
          typeof child.$$jsxslack.type === 'string' &&
          aliases[child.$$jsxslack.type]
            ? JSXSlack.h(
                aliases[child.$$jsxslack.type],
                child.$$jsxslack.props,
                ...child.$$jsxslack.children
              )
            : child
        )
        .filter((child): child is object => {
          if (typeof child === 'object') {
            const { type } = child as any
            if (availableBlockTypes.includes(type)) return true

            throw new Error(
              `<${name}> has included the layout block with not-supported block type: "${type}"${
                JSXSlack.isValidElement(child) &&
                isValidComponent(child.$$jsxslack.type)
                  ? ` (provided by <${child.$$jsxslack.type.$$jsxslackComponent.name}>)`
                  : ''
              }`
            )
          }
          return false
        })
  )
