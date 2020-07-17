import { DividerBlock } from '@slack/types'
import { createComponent } from '../../jsx'
import { LayoutBlockProps } from './utils'

export interface DividerProps extends LayoutBlockProps {
  children?: never
}

/**
 * {@link https://api.slack.com/reference/messaging/blocks#divider|The `divider` layout block}
 * just to insert a divider.
 *
 * @return The partial JSON for `divider` layout block
 */
export const Divider = createComponent<DividerProps, DividerBlock>(
  'Divider',
  ({ blockId, id }) => ({ type: 'divider', block_id: blockId || id })
)
