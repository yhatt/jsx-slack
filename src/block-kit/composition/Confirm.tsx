/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { plainText, mrkdwnFromNode } from './utils'

export interface ConfirmProps {
  children: JSXSlack.Children<{}>
  confirm?: string
  deny?: string
  title?: string
}

export const Confirm: JSXSlack.FC<ConfirmProps> = (props) => (
  <ObjectOutput<SlackConfirm>
    title={props.title !== undefined ? plainText(props.title) : undefined}
    text={mrkdwnFromNode(props.children)}
    confirm={props.confirm !== undefined ? plainText(props.confirm) : undefined}
    deny={props.deny !== undefined ? plainText(props.deny) : undefined}
  />
)
