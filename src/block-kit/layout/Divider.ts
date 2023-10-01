import { DividerBlock } from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { LayoutBlockProps } from './utils'

export interface DividerProps extends LayoutBlockProps {
  children?: never
}

/**
 * [The `divider` layout block](https://api.slack.com/reference/messaging/blocks#divider)
 * just to insert a divider.
 *
 * @return The partial JSON for `divider` layout block
 */
export const Divider = createComponent<DividerProps, DividerBlock>(
  'Divider',
  ({ blockId, id }) => ({ type: 'divider', block_id: blockId || id }),
)
