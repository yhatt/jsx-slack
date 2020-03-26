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
      JSXSlack.Children.toArray(children).map((child) => {
        const tag = resolveTagName(child)
        const target: typeof child | null =
          JSXSlack.isValidElement(child) &&
          typeof child.$$jsxslack.type === 'string' &&
          aliases[child.$$jsxslack.type]
            ? alias(child, aliases[child.$$jsxslack.type])
            : child

        if (typeof target === 'object' && target) {
          const block = target as Block
          if (availableBlockTypes.includes(block.type)) return block

          throw new Error(
            `<${name}> has included the layout block with not-supported block type: "${
              block.type
            }"${tag ? ` (provided by ${tag})` : ''}`
          )
        }

        throw new Error(
          `<${name}> allows including components only for the layout block.${
            tag ? ` ${tag} is invalid.` : ''
          }`
        )
      }, [])
  )
