/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { ArrayOutput, wrap } from '../utils'
import { Divider, Image, Section } from './index'

export interface BlockProps {
  children: JSXSlack.Children<BlockComponentProps>
}

export interface BlockComponentProps {
  blockId?: string
  id?: string
}

export const Block: JSXSlack.FC<BlockProps> = props => {
  const normalized = wrap(props.children).map(child => {
    if (child && typeof child === 'object') {
      const isNode = (v: object): v is JSXSlack.Node =>
        typeof (v as JSXSlack.Node).type === 'string'

      if (isNode(child)) {
        // Aliasing intrinsic elements to Block component
        switch (child.type) {
          case 'hr':
            return <Divider {...child.props}>{...child.children}</Divider>
          case 'img':
            return <Image {...child.props}>{...child.children}</Image>
          case 'section':
            return <Section {...child.props}>{...child.children}</Section>
          default:
            throw new Error('<Block> allows only including Block component.')
        }
      }
    }
    return child
  })

  return <ArrayOutput>{normalized}</ArrayOutput>
}
