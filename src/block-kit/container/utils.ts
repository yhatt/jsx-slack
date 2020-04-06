import { ActionsBlock, Block, SectionBlock } from '@slack/types'
import { availableActionTypes } from '../layout/Actions'
import { availableSectionAccessoryTypes } from '../layout/Section'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

interface GenerateBlocksContainerOptions {
  aliases?: Record<string, JSXSlack.FC<any>>
  availableBlockTypes: Record<string, ((block: any) => void) | true>
  typesToCheckMissingLabel?: string[]
  name: string
}

export const generateBlocksContainer = ({
  aliases = {},
  availableBlockTypes,
  typesToCheckMissingLabel,
  name,
}: GenerateBlocksContainerOptions) =>
  createComponent<{ children: JSXSlack.ChildNodes }, Block[]>(
    name,
    ({ children }) =>
      JSXSlack.Children.toArray(children).reduce((reduced: Block[], child) => {
        const tag = resolveTagName(child)
        const target: typeof child | null =
          JSXSlack.isValidElement(child) &&
          typeof child.$$jsxslack.type === 'string' &&
          aliases[child.$$jsxslack.type]
            ? alias(child, aliases[child.$$jsxslack.type]) || child
            : child

        if (typeof target === 'object' && target) {
          const block = target as Block
          const validator = availableBlockTypes[block.type]

          if (validator) {
            if (typeof validator === 'function') validator(block)
            return [...reduced, block]
          }

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
        return reduced
      }, [])
  )

export const generateActionsValidator = (
  availableTypes: string[] = [...availableActionTypes]
) => (block: ActionsBlock) => {
  const elements = block.elements || []
  const element = elements.find(({ type }) => !availableTypes.includes(type))

  if (element) {
    const tag = resolveTagName(element)

    throw new Error(
      `<Actions> block has detected an incompatible element with the root container${
        tag ? `: ${tag}` : '.'
      }`
    )
  }
}

export const generateSectionValidator = (
  availableTypes: string[] = availableSectionAccessoryTypes
) => (block: SectionBlock) => {
  const type = block.accessory?.type

  if (type && !availableTypes.includes(type)) {
    const tag = resolveTagName(block.accessory)

    throw new Error(
      `<Section> block has detected an incompatible accessory with the root container${
        tag ? `: ${tag}` : '.'
      }`
    )
  }
}
