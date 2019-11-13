/** @jsx JSXSlack.h */
import { DividerBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'

export const Divider: JSXSlack.FC<BlockComponentProps & {
  children?: undefined
}> = ({ blockId, id }) => (
  <ObjectOutput<DividerBlock> type="divider" block_id={id || blockId} />
)
