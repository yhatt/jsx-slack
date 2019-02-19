/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { BlockComponentProps } from './Block'

export const Actions: JSXSlack.FC<BlockComponentProps> = ({
  id,
  blockId,
}): JSXSlack.Node<ActionsBlock> => (
  <JSXSlack.Obj type="actions" block_id={id || blockId} />
)
