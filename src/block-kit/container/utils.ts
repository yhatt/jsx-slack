import type {
  ActionsBlock,
  Block,
  InputBlock,
  SectionBlock,
} from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { availableActionTypes } from '../layout/Actions'
import { availableSectionAccessoryTypes } from '../layout/Section'
import { alias, resolveProps, resolveTagName } from '../utils'

interface GenerateBlocksContainerOptions {
  aliases: Record<string, JSXSlack.FC<any>>
  availableBlockTypes: Record<string, ((block: any) => void) | true>
  typesToCheckMissingLabel?: string[]
  name: string
}

export type PrivateMetadataTransformer = (
  hiddenValues: object | undefined,
) => string | undefined

export interface BlocksProps {
  children: JSXSlack.ChildNodes
}

export const generateBlocksContainer = ({
  aliases,
  availableBlockTypes,
  typesToCheckMissingLabel,
  name,
}: GenerateBlocksContainerOptions) =>
  createComponent<BlocksProps, Block[]>(name, ({ children }) =>
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

        throw new JSXSlackError(
          `<${name}> has detected an invalid block type as the layout block: "${
            block.type
          }"${additional ? ` (${additional})` : ''}`,
          child,
        )
      }
      return reduced
    }, []),
  )

export const generateActionsValidator =
  (availableTypes: string[] = [...availableActionTypes]) =>
  (block: ActionsBlock) => {
    const elements = block.elements || []
    const element = elements.find(({ type }) => !availableTypes.includes(type))

    if (element) {
      const tag = resolveTagName(element)

      throw new JSXSlackError(
        `<Actions> block has detected an incompatible element with the root container${
          tag ? `: ${tag}` : '.'
        }`,
        element,
      )
    }
  }

export const generateSectionValidator =
  (availableTypes: string[] = availableSectionAccessoryTypes) =>
  (block: SectionBlock) => {
    const type = block.accessory?.type

    if (type && !availableTypes.includes(type)) {
      const tag = resolveTagName(block.accessory)

      throw new JSXSlackError(
        `<Section> block has detected an incompatible accessory with the root container${
          tag ? `: ${tag}` : '.'
        }`,
        block.accessory,
      )
    }
  }

export const generateInputValidator =
  ({ unavailableInputTypes = [] }: { unavailableInputTypes?: string[] } = {}) =>
  (block: InputBlock) => {
    const { type } = block.element

    if (type && unavailableInputTypes.includes(type)) {
      let tag = resolveTagName(block)
      const props = resolveProps(block) ?? {}

      if (tag && typeof props['type'] === 'string')
        tag = `<${tag.slice(1, -1)} type="${props['type']}">`

      throw new JSXSlackError(
        `The input element has detected an incompatible type with the root container${
          tag ? `: ${tag}` : '.'
        }`,
        block,
      )
    }
  }
