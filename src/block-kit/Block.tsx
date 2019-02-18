/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'

export interface BlockProps {
  children:
    | JSXSlack.Node<BlockComponentProps>
    | JSXSlack.Node<BlockComponentProps>[]
}

export interface BlockComponentProps {
  blockId?: string
}

export const Block: JSXSlack.FC<BlockProps> = props => (
  <JSXSlack.Arr>{props.children}</JSXSlack.Arr>
)
