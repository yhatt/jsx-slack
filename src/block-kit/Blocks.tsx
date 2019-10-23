/** @jsx JSXSlack.h */
import { JSXSlack, jsxOnParsed } from '../jsx'
import { ArrayOutput, aliasTo, isNode, wrap } from '../utils'
import { internalHiddenType, internalSubmitType } from './Input'
import { Divider, Image, Input, Section, Select, Textarea } from './index'

export interface BlocksProps {
  children: JSXSlack.Children<BlockComponentProps>
}

export interface BlockComponentProps {
  blockId?: string
  id?: string
}

export enum InternalBlockType {
  Modal = 'modal',
  Home = 'home',
}

export const blockTypeSymbol = Symbol('jsx-slack-block-type')

const knownBlocks: Map<
  InternalBlockType | undefined,
  (string | symbol)[]
> = new Map()

const basicBlocks = ['actions', 'context', 'divider', 'image', 'section']

// Blocks
knownBlocks.set(undefined, [...basicBlocks, 'file'])

// Modal
knownBlocks.set(InternalBlockType.Modal, [
  ...basicBlocks,
  'input',
  internalHiddenType,
  internalSubmitType,
])

// Home
knownBlocks.set(InternalBlockType.Home, basicBlocks)

export const Blocks: JSXSlack.FC<BlocksProps> = props => {
  const internalType: InternalBlockType | undefined = props[blockTypeSymbol]

  const normalized = wrap(props.children).map(child => {
    if (child && isNode(child) && typeof child.type === 'string') {
      // Aliasing intrinsic elements to Block component
      switch (child.type) {
        case 'hr':
          return aliasTo(Divider, child)
        case 'img':
          return aliasTo(Image, child)
        case 'input':
          return aliasTo(Input, child)
        case 'section':
          return aliasTo(Section, child)
        case 'select':
          return aliasTo(Select, child)
        case 'textarea':
          return aliasTo(Textarea, child)
        default:
          throw new Error(
            '<Blocks> allows only including layout block components.'
          )
      }
    }
    return child
  })

  const node = <ArrayOutput>{normalized}</ArrayOutput>

  node.props[jsxOnParsed] = parsed => {
    // Check the final output
    const availableBlocks = knownBlocks.get(internalType) || []

    if (parsed.some(b => !availableBlocks.includes(b.type)))
      throw new Error(
        'Block container allows only including valid layout block components.'
      )
  }

  return node
}

export const BlocksInternal: JSXSlack.FC<
  BlocksProps & { [blockTypeSymbol]?: InternalBlockType }
> = props => Blocks(props)
