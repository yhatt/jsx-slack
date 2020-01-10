/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { plainText, mrkdwnFromNode } from './utils'

export interface ConfirmProps {
  children: JSXSlack.Children<{}>
  confirm: string
  deny: string
  title: string
}

export const Confirm: JSXSlack.FC<ConfirmProps> = props => (
  <ObjectOutput<SlackConfirm>
    title={plainText(props.title)}
    text={mrkdwnFromNode(props.children)}
    confirm={plainText(props.confirm)}
    deny={plainText(props.deny)}
  />
)
