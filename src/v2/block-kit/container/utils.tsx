/** @jsx JSXSlack.h */
import { Block } from '@slack/types'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

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
  createComponent<{ children: JSXSlack.ChildElements }, Block[]>(
    name,
    ({ children }) =>
      JSXSlack.Children.toArray(children).reduce(
        (reducer: Block[], child): Block[] => {
          const target: typeof child | null =
            JSXSlack.isValidElement(child) &&
            typeof child.$$jsxslack.type === 'string' &&
            aliases[child.$$jsxslack.type]
              ? alias(child, aliases[child.$$jsxslack.type])
              : child

          if (typeof target === 'object' && target) {
            const { type } = target as Block

            if (availableBlockTypes.includes(type))
              return [...reducer, target as Block]

            const tag = resolveTagName(child)
            throw new Error(
              `<${name}> has included the layout block with not-supported block type: "${type}"${
                tag ? ` (provided by ${tag})` : ''
              }`
            )
          }
          return reducer
        },
        []
      )
  )
