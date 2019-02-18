/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'

type BlockChild = JSXSlack.Node<BlockComponentProps>

export interface BlockProps {
  children: BlockChild | BlockChild[]
}

export interface BlockComponentProps {
  blockId?: string
}

export const Block: JSXSlack.FC<BlockProps> = ({ children }) => {
  const wrapped = Array.isArray(children) ? children : [children]

  if (wrapped.some(c => typeof c.node === 'string'))
    throw new Error('<Block> allows only including Block component.')

  return <JSXSlack.Arr>{children}</JSXSlack.Arr>
}
