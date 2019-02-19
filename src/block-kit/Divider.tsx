/** @jsx JSXSlack.h */
import { DividerBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { BlockComponentProps } from './Block'

export const Divider: JSXSlack.FC<BlockComponentProps> = ({
  blockId,
  id,
}): JSXSlack.Node<DividerBlock> => (
  <JSXSlack.Obj type="divider" block_id={id || blockId} />
)
