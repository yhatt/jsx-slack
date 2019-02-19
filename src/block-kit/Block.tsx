/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { wrap } from '../utils'
import { Divider, Image, Section } from './index'

type BlockChild = JSXSlack.Node<BlockComponentProps>

export interface BlockProps {
  children: BlockChild | BlockChild[]
}

export interface BlockComponentProps {
  blockId?: string
  id?: string // alias to blockId
}

export const Block: JSXSlack.FC<BlockProps> = props => {
  const normalized = wrap(props.children).map((child: JSXSlack.Node) => {
    if (typeof child.node === 'string') {
      // Aliasing intrinsic elements to Block component
      switch (child.node) {
        case 'hr':
          return <Divider {...child.props}>{child.children}</Divider>
        case 'img':
          return <Image {...child.props}>{child.children}</Image>
        case 'section':
          return <Section {...child.props}>{child.children}</Section>
        default:
          throw new Error('<Block> allows only including Block component.')
      }
    }
    return child
  })

  return <JSXSlack.Arr>{normalized}</JSXSlack.Arr>
}
