import { Block } from '@slack/types'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

interface GenerateBlocksContainerOptions {
  aliases?: Record<string, JSXSlack.FC<any>>
  availableBlockTypes: string[]
  typesToCheckMissingLabel?: string[]
  name: string
}

export const generateBlocksContainer = ({
  aliases = {},
  availableBlockTypes,
  typesToCheckMissingLabel,
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
            ? alias(child, aliases[child.$$jsxslack.type]) || child
            : child

        if (typeof target === 'object' && target) {
          const block = target as Block
          if (availableBlockTypes.includes(block.type)) return block

          let additional = ''

          if (tag) {
            additional = `Provided by ${tag}`

            if ((typesToCheckMissingLabel || []).includes(block.type))
              additional +=
                '. Are you missing the definition of "label" prop to use the input component?'
          }

          throw new Error(
            `<${name}> has detected an invalid block type as the layout block: "${
              block.type
            }"${additional ? ` (${additional})` : ''}`
          )
        }

        throw new Error(
          `<${name}> allows including components only for the layout block.${
            tag ? ` ${tag} is invalid.` : ''
          }`
        )
      }, [])
  )
