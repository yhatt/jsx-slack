import { Block } from '@slack/types'
import { createComponent } from '../../jsx'
import { LayoutBlockProps } from './utils'

type CallBlock = Block & {
  type: 'call'
  call_id: string
}

export interface CallProps extends LayoutBlockProps {
  children?: never

  /** A string of registered call's ID. */
  callId: string
}

/**
 * The `call` layout block to display your registered call to Slack.
 *
 * _This component is available only in `<Blocks>` container for messaging._
 *
 * Learn about [using the Calls API](https://api.slack.com/apis/calls) in
 * the document of Slack API.
 *
 * @return The partial JSON for `call` layout block
 */
export const Call = createComponent<CallProps, CallBlock>('Call', (props) => ({
  type: 'call',
  block_id: props.blockId || props.id,
  call_id: props.callId,
}))
